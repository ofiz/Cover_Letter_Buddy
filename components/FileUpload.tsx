'use client'

import React, { useRef, useState } from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileUpload: (content: string, filename: string) => void
  accept?: string
  title: string
  description: string
  icon?: React.ReactNode
}

export default function FileUpload({
  onFileUpload,
  accept = '.pdf,.doc,.docx,.txt',
  title,
  description,
  icon
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    setIsUploading(true)
    
    try {
      const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain']
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a PDF, DOC, DOCX, or TXT file')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      let content = ''
      
      if (file.type === 'text/plain') {
        content = await file.text()
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll need to implement PDF text extraction
        // For now, we'll show a placeholder
        content = `PDF file uploaded: ${file.name}. Content extraction will be implemented.`
      } else {
        // For DOC/DOCX files
        content = `Document uploaded: ${file.name}. Content extraction will be implemented.`
      }

      setUploadedFile(file.name)
      onFileUpload(content, file.name)
      toast.success(`${file.name} uploaded successfully!`)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        {icon || <FileText className="w-5 h-5" />}
        {title}
      </h3>
      
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-green-400 bg-green-400/5 scale-102' 
            : uploadedFile 
              ? 'border-green-400 bg-green-400/5' 
              : 'border-gray-600 hover:border-indigo-400 hover:bg-indigo-400/5'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-300">Processing file...</p>
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">✓ {uploadedFile}</p>
                <p className="text-gray-400 text-sm mt-1">Click to replace</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-white font-medium">{description}</p>
                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}