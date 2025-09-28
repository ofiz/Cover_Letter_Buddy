'use client'

import React, { useState } from 'react'
import { Briefcase, Wand2 } from 'lucide-react'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function JobDescriptionInput({
  value,
  onChange,
  placeholder = "Paste the job description here..."
}: JobDescriptionInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const sampleJobDescription = `We're looking for a passionate Software Engineer to join our growing team. You'll be working on cutting-edge web applications using React, Node.js, and modern technologies.

The ideal candidate has 3+ years of experience with:
• Frontend: React, TypeScript, CSS-in-JS
• Backend: Node.js, Express, RESTful APIs
• Database: PostgreSQL, MongoDB
• Cloud: AWS, Docker, CI/CD

You'll collaborate with our design team to create beautiful, responsive user interfaces and work closely with product managers to deliver features that delight our users.

What we offer:
• Competitive salary + equity
• Flexible work arrangements
• Health, dental, vision insurance
• $2000 annual learning budget
• Top-tier equipment and setup

Join us in building the future of digital experiences!`

  const handleUseSample = () => {
    onChange(sampleJobDescription)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Description
        </h3>
        
        <button
          onClick={handleUseSample}
          className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-300 hover:text-indigo-200 
                   border border-indigo-500/30 hover:border-indigo-400/50 rounded-lg transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Use Sample
        </button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={12}
          className={`
            w-full resize-none rounded-2xl p-4 text-white placeholder-gray-400 
            transition-all duration-300 font-mono text-sm leading-relaxed
            bg-white/5 backdrop-blur-sm
            border-2 ${isFocused ? 'border-indigo-400' : 'border-gray-600'}
            focus:outline-none focus:ring-0
            ${isFocused ? 'bg-white/10' : 'hover:bg-white/7'}
          `}
        />
        
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          {value.length} characters
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-2 text-sm text-gray-400">
          ✓ Job description ready ({value.split(' ').length} words)
        </div>
      )}
    </div>
  )
}