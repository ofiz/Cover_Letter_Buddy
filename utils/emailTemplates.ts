export interface EmailTemplate {
  id: string
  name: string
  language: 'english' | 'hebrew'
  systemPrompt: string
  structure: string[]
  tone: string
}

export const emailTemplates: Record<string, EmailTemplate> = {
  'email-english': {
    id: 'email-english',
    name: 'Professional Email (English)',
    language: 'english',
    tone: 'professional, concise, and respectful',
    structure: [
      'Professional greeting with recruiter name',
      'Brief introduction and position interest',
      'Key qualifications summary',
      'Relevant experience highlights',
      'Enthusiasm for the company/role',
      'Call to action and contact information',
      'Professional closing'
    ],
    systemPrompt: `Create a professional email expressing interest in a job position. The email should be concise (150-200 words), professional, and include personal contact information. Follow this structure and tone.`
  },
  
  'email-hebrew': {
    id: 'email-hebrew',
    name: 'Professional Email (Hebrew)',
    language: 'hebrew',
    tone: 'professional, respectful, formal in Hebrew',
    structure: [
      'Professional Hebrew greeting',
      'Position interest statement',
      'Brief background summary',
      'Key qualifications',
      'Company enthusiasm',
      'Contact information',
      'Professional Hebrew closing'
    ],
    systemPrompt: `Create a professional email in Hebrew expressing interest in a job position. The email should be formal, respectful, and concise (150-200 words). Include personal contact information and maintain professional Hebrew language throughout.`
  },
  
  professional: {
    id: 'professional',
    name: 'Professional Email',
    language: 'english',
    tone: 'formal, business-focused, and structured',
    structure: [
      'Formal greeting',
      'Clear position interest',
      'Relevant qualifications',
      'Professional experience',
      'Company knowledge',
      'Next steps request',
      'Professional signature'
    ],
    systemPrompt: `Create a formal professional email for job interest. Use business language, be concise but comprehensive, and maintain a respectful tone throughout.`
  },
  
  creative: {
    id: 'creative',
    name: 'Creative Email',
    language: 'english',
    tone: 'engaging, personality-driven while professional',
    structure: [
      'Engaging opening',
      'Creative position interest',
      'Portfolio/creative highlights',
      'Passion demonstration',
      'Cultural fit emphasis',
      'Enthusiastic closing'
    ],
    systemPrompt: `Create an engaging email for creative positions. Show personality while maintaining professionalism. Highlight creative achievements and demonstrate passion for the field.`
  },
  
  technical: {
    id: 'technical',
    name: 'Technical Email',
    language: 'english',
    tone: 'technical, precise, and solution-oriented',
    structure: [
      'Technical greeting',
      'Position and technical interest',
      'Relevant technologies',
      'Technical achievements',
      'Problem-solving examples',
      'Technical collaboration interest'
    ],
    systemPrompt: `Create a technical email emphasizing programming skills and technical expertise. Include relevant technologies and quantifiable achievements.`
  },
  
  startup: {
    id: 'startup',
    name: 'Startup Email',
    language: 'english',
    tone: 'energetic, growth-minded, and adaptable',
    structure: [
      'Energetic opening',
      'Startup position interest',
      'Adaptability examples',
      'Growth mindset demonstration',
      'Mission alignment',
      'Excited closing'
    ],
    systemPrompt: `Create an energetic email for startup positions. Emphasize adaptability, growth mindset, and excitement for innovation and fast-paced environments.`
  }
}

export function getEmailTemplate(templateId: string): EmailTemplate {
  return emailTemplates[templateId] || emailTemplates['email-english']
}

export function generateEmailPrompt(
  templateId: string,
  resumeContent: string,
  jobDescription: string,
  personalInfo: any,
  language: 'english' | 'hebrew' = 'english'
): string {
  const template = getEmailTemplate(templateId)
  
  return `
You are an expert at writing professional job application emails. Create a compelling email expressing interest in a job position.

TEMPLATE REQUIREMENTS:
- Style: ${template.name}
- Language: ${language === 'hebrew' ? 'Hebrew' : 'English'}
- Tone: ${template.tone}
- Structure: ${template.structure.join(', ')}

INSTRUCTIONS:
${template.systemPrompt}

${language === 'hebrew' ? 'IMPORTANT: Write the entire email in Hebrew. Use proper Hebrew grammar and formal business language.' : ''}

PERSONAL INFORMATION:
Name: ${personalInfo.name}
Phone: ${personalInfo.phone || 'Not provided'}
Email: ${personalInfo.email || 'Not provided'}
LinkedIn: ${personalInfo.linkedin || 'Not provided'}
GitHub: ${personalInfo.github || 'Not provided'}

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:
1. Write a complete professional email (150-200 words)
2. Include appropriate greeting (use recruiter name if mentioned in job description)
3. Express clear interest in the specific position
4. Highlight relevant experience from the resume
5. Include the person's contact information naturally
6. Use ${language === 'hebrew' ? 'Hebrew' : 'English'} language throughout
7. End with a professional closing
8. Make it personal and compelling

${language === 'hebrew' ? 
  'Generate the email in Hebrew only. Use formal Hebrew business language.' : 
  'Generate the email in English with professional business language.'
}

Generate only the email content, no explanations or metadata.
`
}