'use client'

import React, { useState, useRef } from 'react'
import { MessageCircle, Download, Edit3, Copy, RotateCcw, Save } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

interface MessageOutputProps {
  content: string
  onRegenerate: () => void
  isRegenerating?: boolean
}

export default function MessageOutput({ 
  content, 
  onRegenerate, 
  isRegenerating = false 
}: MessageOutputProps) {
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
      toast.success('Message copied to clipboard!')
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
      tempDiv.style.direction = 'rtl' // Hebrew text direction
      
      // Format content for PDF
      const formattedContent = editedContent
        .split('\n')
        .map(line => line.trim())
        .join('\n')
      
      tempDiv.innerHTML = `<div style="white-space: pre-wrap; direction: rtl; text-align: right;">${formattedContent}</div>`
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
      const filename = `recruiter-message-${timestamp}.pdf`
      
      pdf.save(filename)
      toast.success('Message PDF downloaded successfully!')
      
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
          <MessageCircle className="w-5 h-5" />
          Your Recruiter Message
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
                   min-h-[300px] relative"
      >
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[300px] bg-transparent text-white resize-none 
                     focus:outline-none font-mono text-sm leading-relaxed"
            autoFocus
            style={{ direction: 'rtl', textAlign: 'right' }}
          />
        ) : (
          <div 
            className="text-white leading-relaxed whitespace-pre-wrap font-mono text-sm"
            style={{ direction: 'rtl', textAlign: 'right' }}
          >
            {editedContent || 'Your recruiter message will appear here...'}
          </div>
        )}
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <p className="text-yellow-300 text-sm">
          💡 This message is designed for casual communication with recruiters on LinkedIn or via direct contact.
          The tone is friendly and conversational in Hebrew.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                   border border-gray-600 hover:border-gray-500 text-white rounded-lg 
                   transition-all duration-200"
        >
          <Copy className="w-4 h-4" />
          Copy Message
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
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                   disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg 
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