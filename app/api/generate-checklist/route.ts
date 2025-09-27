import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { centerInfo } = body

    const prompt = `You are an expert Michigan childcare licensing consultant. Generate a comprehensive, actionable checklist for obtaining a Michigan childcare license.

CENTER INFORMATION:
- Name: ${centerInfo.name}
- Type: ${centerInfo.type}
- Location: ${centerInfo.city}, ${centerInfo.state} ${centerInfo.zipCode}
- Capacity: ${centerInfo.capacity} children
- Ages Served: ${centerInfo.agesServed?.join(', ') || 'All ages'}

Generate a JSON response with a checklist array containing detailed licensing tasks. Each task should include:
- id, title, description
- category (pre-application, facility, staff, program, application, inspection, post-licensing)
- priority (high, medium, low)
- estimatedDays
- requirements array
- officialForms array with name, number, url, description
- legalReference
- tips array
- contactInfo with agency, phone, website

Focus on current Michigan LARA/MiLEAP requirements including business registration, facility requirements, staff qualifications, application process, and inspections.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert Michigan childcare licensing consultant with comprehensive knowledge of LARA/MiLEAP requirements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    let structuredResponse
    try {
      structuredResponse = JSON.parse(response)
    } catch (parseError) {
      // Fallback structure
      structuredResponse = {
        checklist: [
          {
            id: "business_registration",
            title: "Register Your Business",
            description: "Register your childcare business with the state of Michigan",
            category: "pre-application",
            priority: "high",
            estimatedDays: 3,
            requirements: [
              "Choose business structure (LLC, Corporation, etc.)",
              "Register with Michigan Department of Licensing and Regulatory Affairs",
              "Obtain Federal EIN number"
            ],
            officialForms: [
              {
                name: "Articles of Incorporation",
                number: "Various",
                url: "https://www.michigan.gov/lara",
                description: "Business registration forms"
              }
            ],
            legalReference: "Michigan Business Corporation Act",
            tips: [
              "Consider consulting with a business attorney",
              "Choose a business name that's not already taken"
            ],
            contactInfo: {
              agency: "Michigan LARA",
              phone: "1-517-241-9288",
              website: "michigan.gov/lara"
            }
          },
          {
            id: "license_application",
            title: "Submit Childcare License Application",
            description: "Complete and submit the official Michigan childcare license application",
            category: "application",
            priority: "high",
            estimatedDays: 5,
            requirements: [
              "Complete application forms",
              "Pay application fees",
              "Submit required documentation"
            ],
            officialForms: [
              {
                name: "Application for Child Care Center License",
                number: "BCAL-4001",
                url: "https://www.michigan.gov/mileap",
                description: "Primary license application"
              }
            ],
            legalReference: "R 400.8101 - R 400.8191",
            tips: [
              "Double-check all forms for completeness",
              "Keep copies of all submitted documents"
            ],
            contactInfo: {
              agency: "Child Care Licensing Bureau",
              phone: "1-866-685-0006",
              website: "michigan.gov/mileap"
            }
          }
        ],
        summary: {
          totalTasks: 2,
          estimatedTimelineWeeks: 8
        },
        lastUpdated: new Date().toISOString(),
        sources: ["AI generated from Michigan requirements"]
      }
    }

    structuredResponse.generatedAt = new Date().toISOString()
    structuredResponse.centerInfo = centerInfo

    return NextResponse.json({
      success: true,
      data: structuredResponse
    })

  } catch (error) {
    console.error('Checklist generation error:', error)
    
    const fallbackChecklist = {
      checklist: [
        {
          id: "basic_setup",
          title: "Basic Business Setup",
          description: "Start with business registration and basic requirements",
          category: "pre-application",
          priority: "high",
          estimatedDays: 7,
          requirements: [
            "Register business with Michigan",
            "Obtain necessary permits",
            "Set up business structure"
          ],
          officialForms: [],
          legalReference: "Michigan licensing requirements",
          tips: ["Contact LARA for guidance"],
          contactInfo: {
            agency: "Michigan LARA",
            phone: "1-866-685-0006",
            website: "michigan.gov/mileap"
          }
        }
      ],
      summary: {
        totalTasks: 1,
        estimatedTimelineWeeks: 4
      },
      lastUpdated: new Date().toISOString(),
      sources: ["Fallback - basic requirements"],
      fallbackUsed: true
    }

    return NextResponse.json({
      success: true,
      data: fallbackChecklist,
      message: "Using basic checklist. AI service may be temporarily unavailable."
    })
  }
}