
"use client"

import React, { useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

export interface AttachedFile {
  dataUri: string
  mimeType: string
  fileName: string
}

interface FileDropzoneProps {
  files: AttachedFile[]
  onFilesChange: (files: AttachedFile[]) => void
}

export function FileDropzone({ files, onFilesChange }: FileDropzoneProps) {
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleFile = useCallback(async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUri = e.target?.result as string
      onFilesChange([...files, {
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
  }, [files, onFilesChange, toast])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(handleFile)
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  const getFileIcon = (mime: string) => {
    if (mime.includes("pdf")) return <FileText className="text-destructive" />
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) 
      return <FileSpreadsheet className="text-chart-2" />
    return <FileIcon className="text-primary" />
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-200",
          "hover:border-primary hover:bg-primary/5 group",
          files.length > 0 ? "border-muted" : "border-primary/40 bg-white"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {t('dropzone_title')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('dropzone_subtitle')}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || [])
            selectedFiles.forEach(handleFile)
          }}
        />
        <label
          htmlFor="file-upload"
          className="mt-4 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {t('dropzone_browse')}
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm group animate-in fade-in slide-in-from-top-1">
              <div className="shrink-0">
                {getFileIcon(file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{file.fileName}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{file.mimeType.split("/")[1]}</p>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-full transition-opacity"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
