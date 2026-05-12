import { model } from '../../config/gemini.js';
import { ApiError } from '../../utils/ApiError.js';

const VALID_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health & Fitness',
  'Utilities',
  'Housing',
  'Education',
  'Travel',
  'Personal Care',
  'Investments',
  'Other',
];

export const categoriseExpense = async (description, merchant) => {
  try {
    const prompt = `
      You are a personal finance categoriser.
      Given the following transaction, return ONLY one category label.
      Valid categories: ${VALID_CATEGORIES.join(', ')}.

      Merchant: ${merchant || 'unknown'}
      Description: ${description || 'no description'}

      Respond with ONLY the category name. No explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text().trim();

    return VALID_CATEGORIES.includes(raw) ? raw : 'Other';
  } catch (error) {
    console.error('AI Categorization Error:', error);
    return 'Other'; // Fallback
  }
};

export const parseNLExpense = async (text) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
      Parse this expense description and return ONLY valid JSON.
      Today is ${today}.
      Input: "${text}"

      Return JSON with keys:
      { "amount": number, "merchant": string, "date": "YYYY-MM-DD", 
        "category": string, "description": string }
      Use null for fields you cannot determine.
      For category, choose from: ${VALID_CATEGORIES.join(', ')}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text().trim();
    
    // Basic sanitization to handle potential markdown backticks in response
    textResult = textResult.replace(/```json|```/g, '');
    
    const json = JSON.parse(textResult);
    return json;
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw new ApiError(500, 'Failed to parse natural language input');
  }
};

export const generateWeeklyInsight = async (weekData, priorWeekData, user) => {
  try {
    const prompt = `
      You are a personal finance advisor for ${user.name}.
      Analyse their spending for the past 7 days vs the prior 7 days.

      This week: ${JSON.stringify(weekData)}
      Prior week: ${JSON.stringify(priorWeekData)}
      Currency: ${user.currency}

      Write a friendly 3-paragraph summary covering:
      1. Top spending categories and notable changes
      2. One positive observation
      3. One specific actionable saving tip.
      Use Markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Weekly Insight Error:', error);
    return 'Unable to generate insights at this time.';
  }
};

export const explainAnomaly = async (transaction, mean) => {
  try {
    const prompt = `
      An expense was flagged as an anomaly.
      New transaction: ${transaction.amount} in ${transaction.category}.
      Historical average for this category: ${mean}.
      
      Provide a ONE SENTENCE friendly explanation why this is unusual. 
      Example: "This purchase is 3x your usual Food & Dining spend."`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return 'This transaction is significantly higher than your typical spending in this category.';
  }
};

export const getForecastCommentary = async (projected, budget, currency) => {
  try {
    const status = projected > budget ? 'over' : 'under';
    const prompt = `
      Based on current pace, the user is projected to spend ${projected} ${currency} this month.
      Their budget is ${budget} ${currency}.
      They are tracking to be ${status} budget.
      
      Provide a short, motivating 2-sentence forecast commentary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return 'Your spending is being tracked. Keep an eye on your category budgets.';
  }
};
