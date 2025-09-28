'use client'

import React, { useState, useRef } from 'react'
import { Mail, Download, Edit3, Copy, RotateCcw, Save } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

interface EmailOutputProps {
  content: string
  onRegenerate: () => void
  isRegenerating?: boolean
}

export default function EmailOutput({ 
  content, 
  onRegenerate, 
  isRegenerating = false 
}: EmailOutputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isDownloading, setIsDownloading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Update edited content when new content is generated
  React.useEffect(() => {
    setEditedContent(content)
    setIsEditing(false)
  }, [content])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
      toast.success('Email copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
    toast.success('Changes saved!')
  }

  const handleCancelEdit = () => {
    setEditedContent(content)
    setIsEditing(false)
  }

  const downloadAsPDF = async () => {
    if (!contentRef.current) return
    
    setIsDownloading(true)
    
    try {
      // Create a temporary container for PDF generation
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '8.5in'
      tempDiv.style.padding = '1in'
      tempDiv.style.backgroundColor = 'white'
      tempDiv.style.color = 'black'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      tempDiv.style.fontSize = '12pt'
      tempDiv.style.lineHeight = '1.6'
      
      // Format content for PDF
      const formattedContent = editedContent
        .split('\n')
        .map(line => line.trim())
        .join('\n')
      
      tempDiv.innerHTML = `<div style="white-space: pre-wrap;">${formattedContent}</div>`
      document.body.appendChild(tempDiv)
      
      // Generate canvas from the temp div
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: 'white'
      })
      
      // Remove temp div
      document.body.removeChild(tempDiv)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      })
      
      const imgWidth = 6.5 // 8.5 - 2 inches margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 1, 1, imgWidth, imgHeight)
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `email-${timestamp}.pdf`
      
      pdf.save(filename)
      toast.success('Email PDF downloaded successfully!')
      
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Your Professional Email
        </h3>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 
                         hover:border-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 
                         rounded-lg transition-colors flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div 
        ref={contentRef}
        className="bg-white/5 backdrop-blur-sm border-2 border-gray-600 rounded-2xl p-6 
                   min-h-[400px] relative"
      >
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[400px] bg-transparent text-white resize-none 
                     focus:outline-none font-mono text-sm leading-relaxed"
            autoFocus
            style={{ direction: editedContent.match(/[\u0590-\u05FF]/) ? 'rtl' : 'ltr' }}
          />
        ) : (
          <div 
            className="text-white leading-relaxed whitespace-pre-wrap font-mono text-sm"
            style={{ direction: editedContent.match(/[\u0590-\u05FF]/) ? 'rtl' : 'ltr' }}
          >
            {editedContent || 'Your professional email will appear here...'}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                   border border-gray-600 hover:border-gray-500 text-white rounded-lg 
                   transition-all duration-200"
        >
          <Copy className="w-4 h-4" />
          Copy Email
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                   border border-gray-600 hover:border-gray-500 text-white rounded-lg 
                   transition-all duration-200"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Preview' : 'Edit'}
        </button>

        <button
          onClick={downloadAsPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg 
                   transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>

        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 
                   disabled:bg-amber-800 disabled:cursor-not-allowed text-white rounded-lg 
                   transition-all duration-200"
        >
          <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  )
}