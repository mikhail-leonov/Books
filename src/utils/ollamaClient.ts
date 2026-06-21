import axios from 'axios';
import { logger } from './logger';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Use tags 'qwen3', 'qwen3:8b', 'qwen2.5'. Override via OLLAMA_MODEL.
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3';

/**
 * Remove <think>...</think> reasoning blocks emitted by reasoning models
 * (qwen3 and similar) so they don't end up stored in the description.
 */
function stripThinking(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
        const api = `${OLLAMA_HOST}/api/generate`;
        logger.error(` - - Call to: ${api}`);
        const response = await axios.post( api, { model: OLLAMA_MODEL, prompt, system: systemPrompt, stream: false, options: { temperature: 0.3, top_p: 0.9 }, }, { timeout: 1200000 }  );
        const raw = response?.data?.response;
        if (typeof raw !== 'string') {
            throw new Error('Ollama returned an unexpected response shape (no "response" field)');
        }
        return stripThinking(raw);
    } catch (err: any) {
        const detail = err?.response?.data?.error || err?.message || 'unknown error';
        logger.error(`Ollama generateText failed (model=${OLLAMA_MODEL}): ${detail}`);
        throw new Error(`Ollama request failed: ${detail}`);
    }
}
