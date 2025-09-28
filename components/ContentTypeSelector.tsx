'use client'

import React from 'react'
import { FileText, Mail, MessageCircle, CheckCircle } from 'lucide-react'

export type ContentType = 'cover-letter' | 'email' | 'message'

interface ContentOption {
  id: ContentType
  name: string
  description: string
  icon: React.ReactNode
  languages?: string[]
}

const contentOptions: ContentOption[] = [
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    description: 'Professional cover letter for job applications',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'email',
    name: 'Email to Company',
    description: 'Professional email expressing interest in the position',
    icon: <Mail className="w-6 h-6" />,
    languages: ['English', 'Hebrew']
  },
  {
    id: 'message',
    name: 'Recruiter Message',
    description: 'Casual message for LinkedIn or direct contact (Hebrew)',
    icon: <MessageCircle className="w-6 h-6" />
  }
]

interface ContentTypeSelectorProps {
  selectedType: ContentType
  onTypeSelect: (type: ContentType) => void
}

export default function ContentTypeSelector({ selectedType, onTypeSelect }: ContentTypeSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        What would you like to generate?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contentOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => onTypeSelect(option.id)}
            className={`
              relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
              ${selectedType === option.id
                ? 'border-indigo-400 bg-indigo-400/10 shadow-lg shadow-indigo-400/20'
                : 'border-gray-600 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10'
              }
            `}
          >
            {selectedType === option.id && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-indigo-400" />
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedType === option.id ? 'bg-indigo-500/20' : 'bg-gray-700/50'
                }`}>
                  {option.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{option.name}</h4>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {option.description}
              </p>

              {option.languages && (
                <div className="flex gap-2 mt-3">
                  {option.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedType && (
        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
          <p className="text-indigo-300 text-sm">
            ✓ Selected: <strong>{contentOptions.find(t => t.id === selectedType)?.name}</strong>
          </p>
        </div>
      )}
    </div>
  )
}