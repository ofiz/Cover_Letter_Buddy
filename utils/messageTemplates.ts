export interface MessageTemplate {
  id: string
  name: string
  language: 'hebrew'
  systemPrompt: string
  structure: string[]
  tone: string
  platform: string
}

export const messageTemplates: Record<string, MessageTemplate> = {
  'message-casual': {
    id: 'message-casual',
    name: 'Casual Recruiter Message',
    language: 'hebrew',
    platform: 'LinkedIn/Direct Message',
    tone: 'casual, friendly, conversational in Hebrew',
    structure: [
      'Casual Hebrew greeting with recruiter name',
      'Brief self-introduction with name',
      'Mention of specific job post or opportunity',
      'Quick background highlights (military/education)',
      'Current work status if relevant',
      'Polite request to send CV',
      'Thank you and casual closing'
    ],
    systemPrompt: `Create a casual, friendly message in Hebrew for contacting recruiters on LinkedIn or direct messaging. The message should be conversational, not formal, and written in modern colloquial Hebrew as used in Israeli tech industry communications.`
  }
}

export function getMessageTemplate(templateId: string): MessageTemplate {
  return messageTemplates[templateId] || messageTemplates['message-casual']
}

export function generateMessagePrompt(
  templateId: string,
  resumeContent: string,
  jobDescription: string,
  personalInfo: any
): string {
  const template = getMessageTemplate(templateId)
  
  return `
You are an expert at writing casual, friendly messages in Hebrew for recruiting communications in Israel's tech industry.

TEMPLATE REQUIREMENTS:
- Style: ${template.name}
- Platform: ${template.platform}
- Language: Hebrew (colloquial, modern Israeli Hebrew)
- Tone: ${template.tone}
- Structure: ${template.structure.join(', ')}

INSTRUCTIONS:
${template.systemPrompt}

IMPORTANT: 
- Write in casual, modern Hebrew as used in Israeli tech/startup industry
- Use informal language but remain respectful
- Keep it brief and conversational (80-120 words)
- Include natural Hebrew expressions like "אהלן", "מה הולך", etc.
- Sound like a young professional reaching out to a recruiter

PERSONAL INFORMATION:
Name: ${personalInfo.name}
Phone: ${personalInfo.phone || 'Not provided'}
Email: ${personalInfo.email || 'Not provided'}

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

EXAMPLE STYLE (follow this tone and structure):
"אהלן [שם המגייס] מה הולך? שמי [שם], הנני בוגר יחידת 8200 ובוגר תואר ראשון במדעי המחשב, כעת עובד במשרה חלקית במשרד רה״מ. ראיתי את הפוסט בלינקדאין שפרסמת אתמול לגבי משרת ג׳וניור שיש אצלכם, הייתי שמח לשלוח לך את הקו״ח שלי עבור הגשת מועמדות/סיוע שלך, אם אפשר כמובן המון תודה!"

REQUIREMENTS:
1. Write in casual Hebrew (80-120 words)
2. Start with casual greeting using recruiter name if available
3. Include the person's name and brief background
4. Reference the specific job posting
5. Mention key qualifications naturally
6. Include polite request to send CV
7. End with casual thank you
8. Use modern Israeli Hebrew expressions
9. Sound natural and conversational

Generate only the Hebrew message content, no explanations or metadata.
`
}