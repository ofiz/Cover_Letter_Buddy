export interface CoverLetterTemplate {
  id: string
  name: string
  description: string
  systemPrompt: string
  structure: string[]
  tone: string
}

export const templates: Record<string, CoverLetterTemplate> = {
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and formal tone perfect for corporate positions',
    tone: 'formal, respectful, and business-focused',
    structure: [
      'Professional greeting',
      'Opening statement with position interest',
      'Relevant experience and achievements',
      'Skills alignment with job requirements',
      'Company knowledge and enthusiasm',
      'Call to action and closing'
    ],
    systemPrompt: `Create a professional cover letter with a formal tone. Use business language, maintain proper structure, and focus on achievements and qualifications. Be respectful and concise.`
  },
  
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Engaging style for design and creative roles',
    tone: 'innovative, personality-driven, and expressive',
    structure: [
      'Creative opening hook',
      'Passion for the industry/company',
      'Portfolio highlights and creative achievements',
      'Problem-solving approach',
      'Cultural fit and collaboration style',
      'Enthusiastic closing'
    ],
    systemPrompt: `Create a creative cover letter that shows personality while remaining professional. Use engaging language, highlight creative achievements, and demonstrate passion for the field.`
  },
  
  technical: {
    id: 'technical',
    name: 'Technical',
    description: 'Detailed approach for engineering positions',
    tone: 'technical, precise, and solution-oriented',
    structure: [
      'Technical introduction',
      'Relevant technologies and frameworks',
      'Project achievements and metrics',
      'Problem-solving examples',
      'Technical leadership or collaboration',
      'Interest in technical challenges'
    ],
    systemPrompt: `Create a technical cover letter that emphasizes programming skills, technologies, and engineering achievements. Use precise language and include relevant technical details and metrics.`
  },
  
  startup: {
    id: 'startup',
    name: 'Startup',
    description: 'Dynamic tone for fast-paced environments',
    tone: 'energetic, growth-minded, and adaptable',
    structure: [
      'Energetic opening',
      'Adaptability and quick learning',
      'Growth mindset and achievements',
      'Startup experience or interest',
      'Contribution to company mission',
      'Excited closing with availability'
    ],
    systemPrompt: `Create a startup-focused cover letter with energy and enthusiasm. Emphasize adaptability, growth mindset, and ability to work in fast-paced environments. Show excitement for innovation.`
  }
}

export function getTemplate(templateId: string): CoverLetterTemplate {
  return templates[templateId] || templates.professional
}

export function generatePrompt(
  templateId: string,
  resumeContent: string,
  jobDescription: string,
  additionalInstructions?: string
): string {
  const template = getTemplate(templateId)
  
  return `
You are an expert cover letter writer. Create a compelling cover letter using the ${template.name} template.

TEMPLATE REQUIREMENTS:
- Style: ${template.description}
- Tone: ${template.tone}
- Structure: ${template.structure.join(', ')}

INSTRUCTIONS:
${template.systemPrompt}

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

${additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${additionalInstructions}` : ''}

REQUIREMENTS:
1. Write a complete cover letter (300-400 words)
2. Personalize it based on the job description
3. Highlight relevant experience from the resume
4. Use the specified tone and style
5. Include specific examples and achievements
6. Make it compelling and unique
7. End with a strong call to action

Generate only the cover letter content, no explanations or metadata.
`
}