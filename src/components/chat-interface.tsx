"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { AttachedFile } from "./file-dropzone"
import { receiveAgentNetworkResponses } from "@/ai/flows/receive-agent-network-responses"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Paperclip, X, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/context/language-context"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
  files?: AttachedFile[]
}

export function ChatInterface() {
  const { t } = useLanguage()
  const { toast } = useToast()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: t('chat_welcome') }
      ])
    }
  }, [t, messages.length])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    selectedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUri = event.target?.result as string
        setAttachedFiles(prev => [...prev, {
          dataUri,
          mimeType: file.type,
          fileName: file.name
        }])
      }
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "File Error",
          description: `Failed to read ${file.name}`
        })
      }
      reader.readAsDataURL(file)
    })
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return

    const currentFiles = [...attachedFiles]
    const currentInput = input
    const userMessage: Message = { 
      role: "user", 
      content: currentInput,
      files: currentFiles.length > 0 ? currentFiles : undefined
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setAttachedFiles([])
    setIsLoading(true)
    
    try {
      const result = await receiveAgentNetworkResponses({
        query: currentInput,
        files: currentFiles.length > 0 ? currentFiles : undefined
      })
      
      setMessages(prev => [...prev, { role: "assistant", content: result.response }])
    } catch (error) {
      console.error('Chat error:', error)
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

  const getFileIcon = (mime: string) => {
    if (mime.includes("pdf")) return <FileText size={14} className="text-destructive" />
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) 
      return <FileSpreadsheet size={14} className="text-chart-2" />
    return <FileIcon size={14} className="text-primary" />
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
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Attached Files Preview Area */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl text-[11px] font-medium shadow-sm group">
                  {getFileIcon(file.mimeType)}
                  <span className="max-w-[120px] truncate">{file.fileName}</span>
                  <button 
                    onClick={() => removeAttachedFile(idx)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative group flex items-end gap-2 bg-white border-2 border-transparent focus-within:border-primary transition-all shadow-sm rounded-2xl p-2 px-4">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              multiple 
              onChange={handleFileSelection}
            />
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t('chat_placeholder')}
              className="flex-1 min-h-[44px] max-h-[400px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-2 px-0 resize-y shadow-none text-sm"
            />

            <div className="flex items-center gap-1 mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
                title={t('attach_file')}
              >
                <Paperclip size={20} />
              </Button>

              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
                className="h-9 w-9 rounded-full shrink-0 shadow-md"
                size="icon"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          {t('chat_disclaimer')}
        </p>
      </div>
    </div>
  )
}
