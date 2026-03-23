/**
 * @fileOverview Модульный сервис для работы с конкретными ИИ-агентами.
 * Реализован с возможностью подключения независимых бэкендов для каждого модуля.
 */

import { apiClient } from './api-client';
import { AgentStatus, ChatSession, MessageRequest, MessageResponse, LeadSearchStats } from './types';

export const AgentService = {
  /**
   * Получение статуса всех модулей. 
   */
  getAgentsStatus: () => 
    apiClient.get<AgentStatus[]>('/orchestrator/status'),

  /**
   * Получение статистики для экрана "Поиск Лидов".
   */
  getLeadStats: () =>
    apiClient.get<LeadSearchStats>('/leads/stats'),

  /**
   * Получение истории последних сессий.
   */
  getRecentHistory: () => 
    apiClient.get<ChatSession[]>('/history/recent'),

  /**
   * Отправка запроса в общую сеть. 
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
