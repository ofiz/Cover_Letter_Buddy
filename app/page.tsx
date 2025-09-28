'use client'

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import JobDescriptionInput from '../components/JobDescriptionInput'
import TemplateSelector from '../components/TemplateSelector'
import CoverLetterOutput from '../components/CoverLetterOutput'
import LoadingSpinner from '../components/LoadingSpinner'
import Analytics from '../components/Analytics'
import toast from 'react-hot-toast'

export type ContentType = 'cover-letter' | 'email' | 'message'

export default function Home() {
  // State management
  const [resumeContent, setResumeContent] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('professional')
  const [contentType, setContentType] = useState<ContentType>('cover-letter')
  const [coverLetter, setCoverLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationCount, setGenerationCount] = useState(0)

  // Handle file upload
  const handleFileUpload = (content: string, filename: string) => {
    setResumeContent(content)
    setResumeFileName(filename)
  }

  // Generate cover letter
  const generateCoverLetter = async () => {
    // Validation
    if (!resumeContent.trim()) {
      toast.error('Please upload your resume first')
      return
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter the job description')
      return
    }

    if (jobDescription.trim().length < 100) {
      toast.error('Job description seems too short. Please provide more details.')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent,
          jobDescription,
          templateId: selectedTemplate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter')
      }

      setCoverLetter(data.coverLetter)
      setGenerationCount(prev => prev + 1)
      toast.success('Cover letter generated successfully!')
      
      // Scroll to output section
      setTimeout(() => {
        const outputSection = document.getElementById('output-section')
        if (outputSection) {
          outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)

    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate cover letter')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 bg-indigo-400 rounded-full filter blur-xl opacity-30"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Cover Letter Buddy
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your job applications with AI-powered cover letters that stand out. 
            Upload your resume, paste the job description, and watch the magic happen.
          </p>
        </header>

        {/* Analytics */}
        <Analytics 
          totalGenerated={generationCount}
          averageTime={3.2}
          successRate={98}
          contentType={contentType}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <div className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 border border-gray-600 hover:border-gray-500 transition-all duration-300">
            <FileUpload
              title="Upload Resume"
              description="Drop your resume here"
              onFileUpload={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              icon={<span className="text-2xl">📄</span>}
            />
          </div>

          {/* Job Description */}
          <div className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 border border-gray-600 hover:border-gray-500 transition-all duration-300">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the complete job description here...

Include details about:
• Required skills and experience
• Company information
• Job responsibilities
• Qualifications needed
• Benefits and culture"
            />
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 border border-gray-600 mb-8">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            contentType={contentType}
          />
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generateCoverLetter}
            disabled={isGenerating || !resumeContent || !jobDescription}
            className={`
              relative px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300
              ${isGenerating || !resumeContent || !jobDescription
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            <span className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating Your Cover Letter...' : 'Generate Cover Letter'}
            </span>
          </button>
        </div>

        {/* Loading Spinner */}
        {isGenerating && (
          <div className="mb-8">
            <LoadingSpinner 
              isVisible={isGenerating}
              message="Creating your perfect cover letter..."
            />
          </div>
        )}

        {/* Output Section */}
        {coverLetter && (
          <div id="output-section" className="bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 border border-gray-600">
            <CoverLetterOutput
              content={coverLetter}
              onRegenerate={generateCoverLetter}
              isRegenerating={isGenerating}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-600">
          <p className="text-gray-400">
            Made with ❤️ using AI technology. Your data is processed securely and not stored.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}