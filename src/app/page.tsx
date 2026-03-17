"use client"

import React, { useState, useEffect, useMemo } from "react"
import { AppHeader } from "@/components/app-header"
import { ChatInterface } from "@/components/chat-interface"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar"
import { MessageSquare, Clock, Zap, Database, ChevronRight, Languages, Loader2, ShieldCheck, Activity } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { AgentStatus, AgentStatusCode } from "@/services/types"

export default function Home() {
  const { t, lang, setLang } = useLanguage()

  const initialAgents = useMemo(() => [
    { id: 'consultant', name: t('consultant_agent'), status: 'online' as const, lastActive: 'Active' },
    { id: 'parser', name: t('parser_agent'), status: 'online' as const, lastActive: 'Active' },
    { id: 'validator', name: t('validation_expert'), status: 'online' as const, lastActive: 'Active' },
  ], [t]);

  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(initialAgents)

  useEffect(() => {
    setAgentStatuses(initialAgents)
  }, [initialAgents])

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'zh' : 'ru')
  }

  const getStatusColor = (status: AgentStatusCode) => {
    switch (status) {
      case 'thinking': return 'bg-primary/10 text-primary border-primary/20'
      case 'searching': return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'validating': return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'online': return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'offline': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'idle': return 'bg-muted text-muted-foreground border-transparent'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: AgentStatusCode) => {
    switch (status) {
      case 'thinking': return t('thinking')
      case 'searching': return t('searching')
      case 'validating': return t('validating')
      case 'online': return t('online')
      case 'offline': return t('offline')
      case 'idle': return t('idle')
      default: return status
    }
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
              <span>{lang === 'ru' ? '中文 (简体)' : 'Русский'}</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <AppHeader />
          
          <main className="flex-1 p-6 flex flex-row gap-6 overflow-hidden">
            <div className="flex-[7] flex flex-col min-h-0">
              <ChatInterface />
            </div>

            <div className="flex-[3] flex flex-col gap-6 min-h-0 overflow-y-auto">
              {/* Agent Health & Status Section */}
              <section className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-primary">
                  <Activity size={16} />
                  {t('agent_status')}
                </h3>
                <div className="space-y-4">
                  {agentStatuses.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 border border-white/60">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{agent.name}</span>
                        {(agent.status === 'thinking' || agent.status === 'searching') && (
                          <span className="text-[10px] text-primary flex items-center gap-1 mt-1">
                            <Loader2 size={10} className="animate-spin" />
                            Processing...
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${getStatusColor(agent.status)}`}>
                        {getStatusLabel(agent.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Verification / Info Card */}
              <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-secondary">
                  <ShieldCheck size={16} />
                  {t('security_title')}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t('security_desc')}
                </p>
                <div className="mt-4 pt-4 border-t border-secondary/10">
                  <div className="flex items-center justify-between text-[10px] text-secondary font-bold uppercase tracking-wider">
                    <span>{t('uptime')}</span>
                    <span>99.9%</span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
