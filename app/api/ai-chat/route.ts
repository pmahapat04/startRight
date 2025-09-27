import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body

    // Create a comprehensive system prompt for Michigan childcare licensing
    const systemPrompt = `You are an expert Michigan childcare licensing assistant. You have comprehensive knowledge of:

1. Michigan LARA (Licensing and Regulatory Affairs) requirements
2. MiLEAP (Michigan Learning and Education Advancement Program) standards
3. Child Care Licensing Bureau regulations
4. Michigan childcare center licensing process
5. Required forms, inspections, and documentation
6. State regulations R 400.8101 through R 400.8191
7. Health, safety, and educational requirements
8. Staff qualifications and background check requirements
9. Facility requirements and zoning
10. Food service and nutrition requirements

Your responses should be:
- Accurate and specific to Michigan regulations
- Helpful and actionable
- Include relevant form numbers or regulation references when applicable
- Mention deadlines or timeframes when relevant
- Suggest next steps when appropriate
- Be concise but thorough
- Use a friendly, professional tone

If asked about topics outside Michigan childcare licensing, politely redirect the conversation back to licensing topics.`

    // Build conversation history for context
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt
      }
    ]

    // Add conversation history (last 5 messages for context)
    if (history && Array.isArray(history)) {
      history.slice(-5).forEach((msg: any) => {
        messages.push({
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })
      })
    }

    // Add current user message
    messages.push({
      role: "user" as const,
      content: message
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.2,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({
      success: true,
      response: response
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get AI response',
      response: "I'm sorry, I'm having trouble responding right now. For immediate assistance with Michigan childcare licensing, please visit michigan.gov/mileap or contact LARA at 1-866-685-0006."
    }, { status: 500 })
  }
}
