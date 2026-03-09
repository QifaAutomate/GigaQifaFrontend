/**
 * @fileOverview Определения типов данных (моделей), соответствующих схемам бэкенда.
 * При использовании Swagger эти типы можно генерировать автоматически.
 */

export interface AgentStatus {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'offline';
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
