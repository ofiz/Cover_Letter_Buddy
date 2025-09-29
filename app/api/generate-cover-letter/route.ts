import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { generatePrompt, getTemplate } from '../../../utils/templateSystem'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Rate limiting (simple in-memory store)
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
    const { resumeContent, jobDescription, templateId = 'professional', additionalInstructions } = body

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume content and job description are required' },
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

    const prompt = generatePrompt(templateId, resumeContent, jobDescription, additionalInstructions)

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const coverLetter = response.text()

    if (!coverLetter) {
      return NextResponse.json(
        { error: 'No cover letter generated. Please try again.' },
        { status: 500 }
      )
    }

    const template = getTemplate(templateId)

    return NextResponse.json({
      coverLetter: coverLetter.trim(),
      template: {
        id: template.id,
        name: template.name,
        tone: template.tone
      },
      metadata: {
        wordsCount: coverLetter.trim().split(' ').length,
        generatedAt: new Date().toISOString(),
        templateUsed: templateId
      }
    })

  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}