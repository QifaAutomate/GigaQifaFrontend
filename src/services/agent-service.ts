/**
 * @fileOverview Сервис для работы с агентами и историей чатов.
 * Использует apiClient для выполнения запросов.
 */

import { apiClient } from './api-client';
import { AgentStatus, ChatSession, MessageRequest, MessageResponse } from './types';

export const AgentService = {
  /**
   * Получение текущего статуса всех агентов в сети.
   */
  getAgentsStatus: () => 
    apiClient.get<AgentStatus[]>('/agents/status'),

  /**
   * Получение истории последних сессий пользователя.
   */
  getRecentHistory: () => 
    apiClient.get<ChatSession[]>('/history/recent'),

  /**
   * Отправка запроса в нейронную сеть агентов.
   */
  processQuery: (payload: MessageRequest) => 
    apiClient.post<MessageResponse>('/chat/process', payload),

  /**
   * Загрузка файла для контекста (возвращает ID файла).
   */
  uploadContextFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ fileId: string }>('/files/upload', formData, {
      // Переопределяем headers для FormData, так как fetch сам выставит нужный boundary
      headers: { 'Content-Type': 'multipart/form-data' } as any
    });
  }
};
