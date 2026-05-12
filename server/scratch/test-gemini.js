import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const key = process.env.GEMINI_API_KEY;
console.log(`Key length: ${key?.length}`);
console.log(`Key starts with: ${key?.substring(0, 7)}...`);

if (!key) {
  console.error('No API key found in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
  try {
    const result = await model.generateContent('Hi');
    const response = await result.response;
    console.log('SUCCESS:', response.text());
  } catch (error) {
    console.error('FAILURE:', error.message);
  }
}

test();
