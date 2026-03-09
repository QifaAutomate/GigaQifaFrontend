/**
 * @fileOverview Модульный сервис для работы с конкретными ИИ-агентами.
 * Реализован с возможностью подключения независимых бэкендов для каждого модуля.
 */

import { apiClient } from './api-client';
import { AgentStatus, ChatSession, MessageRequest, MessageResponse } from './types';

export const AgentService = {
  /**
   * Получение статуса всех модулей. 
   * Бэкенд на Python может агрегировать эти данные из разных микросервисов.
   */
  getAgentsStatus: () => 
    apiClient.get<AgentStatus[]>('/orchestrator/status'),

  /**
   * Получение статуса конкретного агента (модуля).
   * @param agentId 'consultant' | 'parser' | 'validator'
   */
  getSingleAgentStatus: (agentId: string) =>
    apiClient.get<AgentStatus>(`/agents/${agentId}/status`),

  /**
   * Получение истории последних сессий.
   */
  getRecentHistory: () => 
    apiClient.get<ChatSession[]>('/history/recent'),

  /**
   * Отправка запроса в общую сеть. 
   * Orchestrator на Python сам решит, какие агенты должны участвовать.
   */
  processQuery: (payload: MessageRequest) => 
    apiClient.post<MessageResponse>('/orchestrator/process', payload),

  /**
   * Загрузка файла для контекста.
   */
  uploadContextFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ fileId: string }>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' } as any
    });
  }
};
