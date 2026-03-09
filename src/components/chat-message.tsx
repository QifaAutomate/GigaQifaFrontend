
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy, Check, User, Bot } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy response to clipboard."
      })
    }
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
            {role === "user" ? "You" : "AI Agent Network"}
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
      </div>
    </div>
  )
}
