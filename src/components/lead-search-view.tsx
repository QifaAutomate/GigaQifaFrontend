"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Users, Activity, BarChart3, TrendingUp, Flame } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function LeadSearchView() {
  const { t } = useLanguage()

  const metrics = [
    { id: 'telegram', name: t('group_telegram'), processed: 1240, inWork: 450, warmLeads: 120, icon: <Users className="text-primary" size={18} /> },
    { id: 'vk', name: t('group_vk'), processed: 890, inWork: 210, warmLeads: 45, icon: <Activity className="text-secondary" size={18} /> },
    { id: 'max', name: t('group_max'), processed: 560, inWork: 130, warmLeads: 32, icon: <TrendingUp className="text-purple-500" size={18} /> },
  ]

  const totalProcessed = metrics.reduce((acc, m) => acc + m.processed, 0)
  const totalInWork = metrics.reduce((acc, m) => acc + m.inWork, 0)
  const totalWarmLeads = metrics.reduce((acc, m) => acc + m.warmLeads, 0)

  const handleExport = (groupId: string) => {
    console.log(`Exporting data for ${groupId}...`)
    // Logic for Excel export would go here
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* General Stats Window */}
      <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
            <BarChart3 size={20} />
            {t('total_metrics')}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white hover:bg-primary/10 text-primary border-primary/20 gap-2"
            onClick={() => handleExport('all')}
          >
            <FileSpreadsheet size={16} />
            {t('export_excel')}
          </Button>
        </CardHeader>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">{t('processed_contacts')}</span>
            <span className="text-4xl font-extrabold text-foreground">{totalProcessed.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">{t('contacts_in_work')}</span>
            <span className="text-4xl font-extrabold text-blue-600">{totalInWork.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-widest text-secondary flex items-center gap-1">
              <Flame size={14} fill="currentColor" />
              {t('warm_leads')}
            </span>
            <span className="text-4xl font-extrabold text-secondary">{totalWarmLeads.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Grid for groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((group) => (
          <Card key={group.id} className="shadow-lg border-white/60 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                {group.icon}
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground leading-tight">{t('processed_contacts')}</span>
                    <span className="text-lg font-bold">{group.processed}</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground leading-tight">{t('contacts_in_work')}</span>
                    <span className="text-lg font-bold text-blue-600">{group.inWork}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] uppercase font-bold text-secondary leading-tight">{t('warm_leads')}</span>
                    <span className="text-lg font-bold text-secondary">{group.warmLeads}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2 h-9 text-xs hover:bg-accent border"
                  onClick={() => handleExport(group.id)}
                >
                  <FileSpreadsheet size={14} className="text-chart-2" />
                  {t('export_excel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
