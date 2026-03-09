"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy, Check, User, Bot, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { AttachedFile } from "./file-dropzone"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  files?: AttachedFile[]
}

export function ChatMessage({ role, content, files }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: t('copy_failed'),
        description: t('copy_failed_desc')
      })
    }
  }

  const getFileIcon = (mime: string) => {
    if (mime.includes("pdf")) return <FileText size={14} className="text-destructive" />
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) 
      return <FileSpreadsheet size={14} className="text-chart-2" />
    if (mime.includes("image")) return <FileIcon size={14} className="text-primary" />
    return <FileIcon size={14} className="text-muted-foreground" />
  }

  return (
    <div className={cn(
      "group relative flex w-full gap-4 p-6 transition-colors duration-200",
      role === "assistant" ? "bg-accent/30" : "bg-transparent"
    )}>
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm",
        role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {role === "user" ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {role === "user" ? t('you') : t('ai_network')}
          </span>
          {role === "assistant" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4 text-chart-2" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
        
        {files && files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white/50 border rounded-md text-[10px] font-medium shadow-sm">
                {getFileIcon(file.mimeType)}
                <span className="truncate max-w-[150px]">{file.fileName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
