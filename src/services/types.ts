/**
 * @fileOverview Определения типов данных (моделей), соответствующих схемам бэкенда.
 * Для Python-разработчиков: Эти интерфейсы соответствуют вашим Pydantic моделям в FastAPI.
 */

export type AgentStatusCode = 'online' | 'idle' | 'offline' | 'thinking' | 'searching' | 'validating';

export interface AgentStatus {
  id: string;
  name: string;
  status: AgentStatusCode;
  lastActive: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRequest {
  query: string;
  contextFiles?: string[]; // IDs загруженных файлов
}

export interface MessageResponse {
  answer: string;
  confidence: number;
  sources: string[];
}
