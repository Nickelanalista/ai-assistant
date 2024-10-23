import type { Message } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL;

export async function generateAIResponse(messages: Message[]): Promise<{ content: string }> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error en la llamada a la API de OpenAI');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Error en la comunicación con OpenAI. Por favor, verifica tu conexión y API key.');
  }
}