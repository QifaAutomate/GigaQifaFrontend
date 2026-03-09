
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru';

const translations = {
  en: {
    console_version: "GigaQifa v2.4",
    workspace: "Workspace",
    active_chat: "Active Chat",
    knowledge_base: "Knowledge Base",
    recent_history: "Recent History",
    context_files: "CONTEXT FILES",
    context_files_desc: "Provide documents to anchor the AI network's responses in specific organizational data.",
    agent_status: "AGENT MODULES",
    consultant_agent: "Consultant",
    parser_agent: "Parser",
    validation_expert: "Validation Expert",
    online: "Online",
    offline: "Offline",
    idle: "Idle",
    thinking: "Thinking...",
    searching: "Parsing...",
    validating: "Validating...",
    header_title: "GigaQifa Prototyper",
    header_subtitle: "Enterprise Agent Network",
    chat_welcome: "Hello! I am your AI Agent Network. How can I assist you today? You can drop files in the right panel to provide me with more context.",
    chat_placeholder: "Type your query to the agent network...",
    chat_disclaimer: "GigaQifa Prototyper can analyze complex documents using advanced AI agents.",
    chat_error: "I'm sorry, I encountered an error while processing your request. Please try again.",
    dropzone_title: "Drop context files here",
    dropzone_subtitle: "Support PDF, Excel, and more",
    dropzone_browse: "Browse Files",
    you: "You",
    ai_network: "AI Agent Network",
    copy_failed: "Copy failed",
    copy_failed_desc: "Could not copy response to clipboard.",
    history_items: ["Q4 Financial Analysis", "Inventory Optimization", "Customer Risk Report", "Supply Chain Logistics"]
  },
  ru: {
    console_version: "GigaQifa v2.4",
    workspace: "Рабочее пространство",
    active_chat: "Активный чат",
    knowledge_base: "База знаний",
    recent_history: "История",
    context_files: "ФАЙЛЫ КОНТЕКСТА",
    context_files_desc: "Предоставьте документы, чтобы привязать ответы ИИ-сети к конкретным данным организации.",
    agent_status: "МОДУЛИ АГЕНТОВ",
    consultant_agent: "Консультант",
    parser_agent: "Парсер",
    validation_expert: "Эксперт по валидации",
    online: "В сети",
    offline: "Не в сети",
    idle: "Ожидание",
    thinking: "Думает...",
    searching: "Парсинг...",
    validating: "Проверка...",
    header_title: "GigaQifa Прототип",
    header_subtitle: "Корпоративная сеть агентов",
    chat_welcome: "Привет! Я ваша сеть ИИ-агентов. Чем я могу вам помочь сегодня? Вы можете перетащить файлы в правую панель, чтобы предоставить мне больше контекста.",
    chat_placeholder: "Введите ваш запрос для сети агентов...",
    chat_disclaimer: "GigaQifa Прототип может анализировать сложные документы с помощью продвинутых ИИ-агентов.",
    chat_error: "К сожалению, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
    dropzone_title: "Перетащите файлы контекста сюда",
    dropzone_subtitle: "Поддержка PDF, Excel и других форматов",
    dropzone_browse: "Выбрать файлы",
    you: "Вы",
    ai_network: "ИИ-сеть агентов",
    copy_failed: "Ошибка копирования",
    copy_failed_desc: "Не удалось скопировать ответ в буфер обмена.",
    history_items: ["Финансовый анализ Q4", "Оптимизация запасов", "Отчет по рискам клиентов", "Логистика цепочки поставок"]
  }
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
