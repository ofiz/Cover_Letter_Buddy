'use client'

import React from 'react'
import { TrendingUp, Users, Clock, FileText } from 'lucide-react'

export type ContentType = 'cover-letter' | 'email' | 'message'

interface AnalyticsProps {
  totalGenerated: number
  averageTime: number
  successRate: number
  contentType?: ContentType
}

export default function Analytics({ 
  totalGenerated = 0, 
  averageTime = 0, 
  successRate = 0,
  contentType = 'cover-letter'
}: AnalyticsProps) {
  
  const getContentLabel = () => {
    switch (contentType) {
      case 'cover-letter': return 'Cover Letters'
      case 'email': return 'Emails'
      case 'message': return 'Messages'
      default: return 'Letters'
    }
  }

  const stats = [
    {
      icon: FileText,
      label: `${getContentLabel()} Generated`,
      value: totalGenerated.toLocaleString(),
      color: 'text-blue-400'
    },
    {
      icon: Clock,
      label: 'Avg. Generation Time',
      value: `${averageTime}s`,
      color: 'text-green-400'
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: `${successRate}%`,
      color: 'text-purple-400'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '1,234+',
      color: 'text-amber-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-700 rounded-xl p-4 
                     hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}