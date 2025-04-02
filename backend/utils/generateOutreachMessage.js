import axios from 'axios';

export const generateOutreachMessage = async ({ name, title, company, email }) => {
  const prompt = `You're a B2B SDR assistant. Write a friendly and concise outreach message for the following lead:
  
- Name: ${name}
- Title: ${title}
- Company: ${company}
- Email: ${email}

Tone: Professional, confident, and value-oriented. Keep it under 4 sentences.
Respond with only the message, no metadata.`;

  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
    {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const message = response.data.choices?.[0]?.message?.content?.trim();
  if (!message) throw new Error('No outreach message returned from AI');
  return message;
};