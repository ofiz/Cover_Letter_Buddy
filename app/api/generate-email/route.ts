import { NextRequest, NextResponse } from 'next/server'
import { generateEmailPrompt, getEmailTemplate } from '../../../utils/emailTemplates'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  
  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return true
  }
  
  if (limit.count >= 10) {
    return false
  }
  
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { 
      resumeContent, 
      jobDescription, 
      templateId = 'email-english', 
      personalInfo,
      language = 'english'
    } = body

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume content and job description are required' },
        { status: 400 }
      )
    }

    if (!personalInfo || !personalInfo.name) {
      return NextResponse.json(
        { error: 'Personal information with name is required for email generation' },
        { status: 400 }
      )
    }

    if (resumeContent.length < 50) {
      return NextResponse.json(
        { error: 'Resume content seems too short. Please provide more details.' },
        { status: 400 }
      )
    }

    if (jobDescription.length < 100) {
      return NextResponse.json(
        { error: 'Job description seems too short. Please provide more details.' },
        { status: 400 }
      )
    }

    const prompt = generateEmailPrompt(
      templateId,
      resumeContent,
      jobDescription,
      personalInfo,
      language
    )

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert at writing professional job application emails.${language === 'hebrew' ? ' You must write in Hebrew using proper Hebrew grammar and professional language.' : ''}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to generate email. Please try again.' },
        { status: 500 }
      )
    }

    const data = await openaiResponse.json()
    const email = data.choices[0]?.message?.content

    if (!email) {
      return NextResponse.json(
        { error: 'No email generated. Please try again.' },
        { status: 500 }
      )
    }

    const template = getEmailTemplate(templateId)

    return NextResponse.json({
      email: email.trim(),
      template: {
        id: template.id,
        name: template.name,
        language: template.language,
        tone: template.tone
      },
      metadata: {
        wordsCount: email.trim().split(' ').length,
        generatedAt: new Date().toISOString(),
        templateUsed: templateId,
        language: language
      }
    })

  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'email-generation',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}