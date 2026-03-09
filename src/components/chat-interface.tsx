"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { AttachedFile } from "./file-dropzone"
import { receiveAgentNetworkResponses } from "@/ai/flows/receive-agent-network-responses"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/context/language-context"

interface Message {
  role: "user" | "assistant"
  content: string
  files?: AttachedFile[]
}

interface ChatInterfaceProps {
  attachedFiles: AttachedFile[]
  clearFiles: () => void
}

export function ChatInterface({ attachedFiles, clearFiles }: ChatInterfaceProps) {
  const { t } = useLanguage()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: t('chat_welcome') }
      ])
    }
  }, [t, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return

    const currentFiles = [...attachedFiles]
    const userMessage: Message = { 
      role: "user", 
      content: input,
      files: currentFiles.length > 0 ? currentFiles : undefined
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    // Clear files immediately after adding to message history to avoid double sending
    if (currentFiles.length > 0) {
      clearFiles()
    }

    try {
      const result = await receiveAgentNetworkResponses({
        query: input,
        files: currentFiles.length > 0 ? currentFiles : undefined
      })
      
      setMessages(prev => [...prev, { role: "assistant", content: result.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: t('chat_error') }])
    } finally {
      setIsLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} files={m.files} />
          ))}
          {isLoading && (
            <div className="flex gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-primary text-primary-foreground shadow-sm">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-accent/10">
        <div className="max-w-4xl mx-auto relative group">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('chat_placeholder')}
            className="min-h-[100px] pr-16 bg-white border-2 border-transparent focus-visible:border-primary transition-all resize-none shadow-sm rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
            className="absolute right-3 bottom-3 h-10 w-10 rounded-full shadow-lg"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          {t('chat_disclaimer')}
        </p>
      </div>
    </div>
  )
}
