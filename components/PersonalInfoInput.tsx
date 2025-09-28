'use client'

import React from 'react'
import { User, Phone, Mail, Linkedin, Github } from 'lucide-react'

export interface PersonalInfo {
  name: string
  phone: string
  email: string
  linkedin: string
  github: string
}

interface PersonalInfoInputProps {
  personalInfo: PersonalInfo
  onChange: (info: PersonalInfo) => void
}

export default function PersonalInfoInput({ personalInfo, onChange }: PersonalInfoInputProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value
    })
  }

  const inputFields = [
    {
      key: 'name' as keyof PersonalInfo,
      label: 'Full Name',
      placeholder: 'Ofir Cohen',
      icon: User,
      required: true
    },
    {
      key: 'phone' as keyof PersonalInfo,
      label: 'Phone',
      placeholder: '+972-54-247-6376',
      icon: Phone,
      required: false
    },
    {
      key: 'email' as keyof PersonalInfo,
      label: 'Email',
      placeholder: 'ofircohen599@gmail.com',
      icon: Mail,
      required: false
    },
    {
      key: 'linkedin' as keyof PersonalInfo,
      label: 'LinkedIn',
      placeholder: 'linkedin.com/in/ofircohen',
      icon: Linkedin,
      required: false
    },
    {
      key: 'github' as keyof PersonalInfo,
      label: 'GitHub',
      placeholder: 'github.com/ofircohen',
      icon: Github,
      required: false
    }
  ]

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <field.icon className="w-4 h-4" />
              {field.label}
              {field.required && <span className="text-red-400">*</span>}
            </label>
            
            <input
              type="text"
              value={personalInfo[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={`
                w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 
                transition-all duration-300 bg-white bg-opacity-5 backdrop-blur-sm
                border-2 border-gray-600 focus:border-indigo-400 focus:outline-none
                hover:bg-white hover:bg-opacity-10 focus:bg-white focus:bg-opacity-10
                ${field.required && !personalInfo[field.key] ? 'border-red-400 border-opacity-50' : ''}
              `}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg">
        <p className="text-blue-300 text-sm">
          💡 This information will be used to personalize your emails and messages. 
          Only the name is required for basic generation.
        </p>
      </div>
    </div>
  )
}