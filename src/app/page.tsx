
"use client"

import React, { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { ChatInterface } from "@/components/chat-interface"
import { FileDropzone, AttachedFile } from "@/components/file-dropzone"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { MessageSquare, Clock, Zap, Database, ChevronRight } from "lucide-react"

export default function Home() {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const clearFiles = () => setAttachedFiles([])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Left Sidebar for Navigation/History */}
        <Sidebar className="border-r">
          <SidebarHeader className="h-20 flex items-center px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg">
                <Zap size={18} />
              </div>
              <span className="font-bold tracking-tight">Console v2.4</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <MessageSquare size={18} />
                    <span>Active Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Database size={18} />
                    <span>Knowledge Base</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Recent History</SidebarGroupLabel>
              <SidebarMenu>
                {[
                  "Q4 Financial Analysis",
                  "Inventory Optimization",
                  "Customer Risk Report",
                  "Supply Chain Logistics"
                ].map((item, idx) => (
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
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <AppHeader />
          
          <main className="flex-1 flex flex-row p-6 gap-6 overflow-hidden">
            {/* Chat Column (approx 70%) */}
            <div className="flex-[7] flex flex-col min-h-0">
              <ChatInterface 
                attachedFiles={attachedFiles} 
                clearFiles={clearFiles} 
              />
            </div>

            {/* Context/Files Column (approx 30%) */}
            <div className="flex-[3] flex flex-col gap-6 min-h-0 overflow-y-auto">
              <section className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-primary">
                  <Database size={16} />
                  CONTEXT FILES
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Provide documents to anchor the AI network's responses in specific organizational data.
                </p>
                <FileDropzone 
                  files={attachedFiles} 
                  onFilesChange={setAttachedFiles} 
                />
              </section>

              <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 shadow-lg border">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-secondary">
                  <Zap size={16} />
                  AGENT STATUS
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Analyst Agent</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-chart-2/10 text-chart-2 rounded-full uppercase">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Data Harvester</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-chart-2/10 text-chart-2 rounded-full uppercase">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Validation Expert</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary/10 text-secondary rounded-full uppercase">Idle</span>
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
