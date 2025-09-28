'use client'

import React from 'react'
import { Palette, CheckCircle } from 'lucide-react'

export type ContentType = 'cover-letter' | 'email' | 'message'

export interface Template {
  id: string
  name: string
  description: string
  tone: string
  preview: string
  contentTypes: ContentType[]
}

const templates: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and formal tone perfect for corporate positions',
    tone: 'Formal, structured, and business-focused',
    preview: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role...',
    contentTypes: ['cover-letter', 'email']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Engaging style for design and creative roles',
    tone: 'Innovative, personality-driven, and expressive',
    preview: 'Hello [Company Team]!\n\nYour [Position] opening caught my eye because...',
    contentTypes: ['cover-letter', 'email']
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Detailed approach for engineering positions',
    tone: 'Technical, precise, and solution-oriented',
    preview: 'Dear Technical Team,\n\nAs a [Role] with expertise in [Technologies]...',
    contentTypes: ['cover-letter', 'email']
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Dynamic tone for fast-paced environments',
    tone: 'Energetic, growth-minded, and adaptable',
    preview: 'Hi [Team],\n\nI\'m excited about the opportunity to contribute to [Company]\'s mission...',
    contentTypes: ['cover-letter', 'email']
  },
  {
    id: 'email-english',
    name: 'Professional Email (English)',
    description: 'Formal email for international companies',
    tone: 'Professional, concise, and respectful',
    preview: 'Dear [Recruiter Name],\n\nI am reaching out to express my interest in the [Position]...',
    contentTypes: ['email']
  },
  {
    id: 'email-hebrew',
    name: 'Professional Email (Hebrew)',
    description: 'Formal email for Israeli companies',
    tone: 'Professional, respectful, in Hebrew',
    preview: 'שלום [שם המגייס],\n\nאני פונה אליך כדי להביע את העניין שלי בתפקיד [התפקיד]...',
    contentTypes: ['email']
  },
  {
    id: 'message-casual',
    name: 'Casual Recruiter Message',
    description: 'Friendly message for LinkedIn or direct contact',
    tone: 'Casual, friendly, conversational in Hebrew',
    preview: 'היי [שם],\n\nמה הולך? שמי [שם], ראיתי את הפוסט שלך לגבי...',
    contentTypes: ['message']
  }
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
  contentType: ContentType
}

export default function TemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  contentType 
}: TemplateSelectorProps) {
  
  // Filter templates based on content type
  const availableTemplates = templates.filter(template => 
    template.contentTypes.includes(contentType)
  )

  // Auto-select first available template if current selection is not valid
  React.useEffect(() => {
    if (!availableTemplates.find(t => t.id === selectedTemplate)) {
      onTemplateSelect(availableTemplates[0]?.id || 'professional')
    }
  }, [contentType, selectedTemplate, onTemplateSelect, availableTemplates])

  const getTitle = () => {
    switch (contentType) {
      case 'cover-letter': return 'Choose Your Cover Letter Style'
      case 'email': return 'Choose Your Email Style'
      case 'message': return 'Choose Your Message Style'
      default: return 'Choose Your Style'
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        {getTitle()}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`
              relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
              ${selectedTemplate === template.id
                ? 'border-indigo-400 bg-indigo-400/10 shadow-lg shadow-indigo-400/20'
                : 'border-gray-600 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10'
              }
            `}
          >
            {selectedTemplate === template.id && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-indigo-400" />
            )}

            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white">{template.name}</h4>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {template.description}
              </p>
              
              <div className="bg-black/20 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Tone: {template.tone}</p>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {template.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
          <p className="text-indigo-300 text-sm">
            ✓ Selected: <strong>{availableTemplates.find(t => t.id === selectedTemplate)?.name}</strong> template
          </p>
        </div>
      )}
    </div>
  )
}