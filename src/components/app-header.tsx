
"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Bell, Settings } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function AppHeader() {
  const logo = PlaceHolderImages.find(img => img.id === "app-logo")
  const { t } = useLanguage()

  return (
    <header className="flex h-20 w-full items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden border shadow-sm">
          <Image
            src={logo?.imageUrl || ""}
            alt="Logo"
            fill
            className="object-cover"
            data-ai-hint="abstract tech logo"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            AgentConnect <span className="text-primary">Console</span>
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
            {t('header_subtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
          <Settings size={20} />
        </button>
        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary ml-4">
          JD
        </div>
      </div>
    </header>
  )
}
