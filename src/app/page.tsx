
"use client"

import React, { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { ChatInterface } from "@/components/chat-interface"
import { FileDropzone, AttachedFile } from "@/components/file-dropzone"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar"
import { MessageSquare, Clock, Zap, Database, ChevronRight, Languages } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { AgentService } from "@/services/agent-service"
import { AgentStatus } from "@/services/types"

export default function Home() {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([])
  const { t, lang, setLang } = useLanguage()

  // Пример "живого" получения статусов агентов через созданный сервис
  useEffect(() => {
    async function fetchStatuses() {
      const { data } = await AgentService.getAgentsStatus()
      if (data) {
        setAgentStatuses(data)
      } else {
        // Заглушка, если бэкенд еще не подключен
        setAgentStatuses([
          { id: '1', name: t('analyst_agent'), status: 'online', lastActive: '' },
          { id: '2', name: t('data_harvester'), status: 'online', lastActive: '' },
          { id: '3', name: t('validation_expert'), status: 'idle', lastActive: '' },
        ])
      }
    }
    fetchStatuses()
  }, [t])

  const clearFiles = () => setAttachedFiles([])

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru')
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="h-20 flex items-center px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg">
                <Zap size={18} />
              </div>
              <span className="font-bold tracking-tight">{t('console_version')}</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('workspace')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <MessageSquare size={18} />
                    <span>{t('active_chat')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Database size={18} />
                    <span>{t('knowledge_base')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel>{t('recent_history')}</SidebarGroupLabel>
              <SidebarMenu>
                {(t('history_items') as string[]).map((item, idx) => (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton className="group">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="truncate">{item}</span>
                      <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-white/50" 
              onClick={toggleLanguage}
            >
              <Languages size={16} />
              <span>{lang === 'ru' ? 'English' : 'Русский'}</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <AppHeader />
          
          <main className="flex-1 flex flex-row p-6 gap-6 overflow-hidden">
            <div className="flex-[7] flex flex-col min-h-0">
              <ChatInterface 
                attachedFiles={attachedFiles} 
                clearFiles={clearFiles} 
              />
            </div>

            <div className="flex-[3] flex flex-col gap-6 min-h-0 overflow-y-auto">
              <section className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-primary">
                  <Database size={16} />
                  {t('context_files')}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {t('context_files_desc')}
                </p>
                <FileDropzone 
                  files={attachedFiles} 
                  onFilesChange={setAttachedFiles} 
                />
              </section>

              <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-secondary">
                  <Zap size={16} />
                  {t('agent_status')}
                </h3>
                <div className="space-y-4">
                  {agentStatuses.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <span className="text-xs font-medium">{agent.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        agent.status === 'online' ? 'bg-chart-2/10 text-chart-2' : 
                        agent.status === 'idle' ? 'bg-secondary/10 text-secondary' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        {agent.status === 'online' ? t('online') : agent.status === 'idle' ? t('idle') : 'Offline'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
