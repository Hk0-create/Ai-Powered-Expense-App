import { GoogleGenerativeAI } from '@google/generative-ai';

let modelInstance = null;

export const getModel = () => {
  if (!modelInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    modelInstance = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return modelInstance;
};

// For backward compatibility if needed, but better to use getModel()
export const model = new Proxy({}, {
  get: (target, prop) => {
    return getModel()[prop];
  }
});
