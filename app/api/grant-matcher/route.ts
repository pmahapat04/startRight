import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { centerInfo, grantProfile } = body

    // Create a comprehensive prompt for AI grant matching
    const prompt = `You are an expert grant researcher specializing in childcare, small business, and demographic-specific funding opportunities. Based on the detailed profile below, find and match the user to specific grants and funding programs they're eligible for.

CENTER INFORMATION:
- Name: ${centerInfo.name}
- Type: ${centerInfo.type}
- Location: ${centerInfo.city}, ${centerInfo.state} ${centerInfo.zipCode}
- Capacity: ${centerInfo.capacity} children
- Ages Served: ${centerInfo.agesServed?.join(', ') || 'All ages'}

APPLICANT PROFILE:
Demographics:
- Gender: ${grantProfile.gender}
- Race/Ethnicity: ${grantProfile.race}
- Age: ${grantProfile.age}
- Veteran Status: ${grantProfile.isVeteran ? 'Yes' : 'No'}
- Disability Status: ${grantProfile.hasDisability ? 'Yes' : 'No'}

Economic Status:
- Household Income: ${grantProfile.householdIncome}
- Receiving Government Assistance: ${grantProfile.receivingAssistance ? 'Yes' : 'No'}
- Assistance Programs: ${grantProfile.assistancePrograms?.join(', ') || 'None'}
- Low-Income Area: ${grantProfile.lowIncomeArea ? 'Yes' : 'No'}
- Single Parent: ${grantProfile.singleParent ? 'Yes' : 'No'}

Business Status:
- Business Experience: ${grantProfile.businessExperience}
- First-Time Business Owner: ${grantProfile.firstTimeOwner ? 'Yes' : 'No'}
- Has Business Plan: ${grantProfile.hasBusinessPlan ? 'Yes' : 'No'}
- Credit Score Range: ${grantProfile.creditScore}
- Startup Funding Needed: ${grantProfile.fundingNeeded}

Childcare Specific:
- Plans to Serve Low-Income Families: ${grantProfile.serveLowIncome ? 'Yes' : 'No'}
- Food Service: ${grantProfile.foodService ? 'Yes' : 'No'}
- Special Needs Care: ${grantProfile.specialNeeds ? 'Yes' : 'No'}
- Bilingual Services: ${grantProfile.bilingualServices ? 'Yes' : 'No'}
- Rural Location: ${grantProfile.ruralLocation ? 'Yes' : 'No'}

TASK: Research and identify specific grants, funding programs, and opportunities this person is eligible for. Focus on:

1. **Demographic-Specific Grants**:
   - Minority-owned business grants (specific to their race/ethnicity)
   - Women-owned business grants
   - Veteran business programs
   - Disability entrepreneur programs
   - Age-specific programs (young entrepreneurs, etc.)

2. **Economic/Income-Based Programs**:
   - Low-income entrepreneur programs
   - Single parent business assistance
   - CDFI (Community Development Financial Institution) loans
   - USDA rural development programs
   - State and local economic development grants

3. **Childcare Industry Grants**:
   - Child Care Development Fund (CCDF) quality grants
   - Head Start facility grants
   - USDA CACFP equipment grants
   - Special needs childcare funding
   - Bilingual/multicultural program grants

4. **Small Business Programs**:
   - SBA loans and grants (8(a), HUBZone, etc.)
   - State small business grants
   - Local economic development programs
   - Microfinance opportunities

5. **Foundation and Private Grants**:
   - Foundation grants targeting specific demographics
   - Corporate social responsibility programs
   - Community foundation grants

For each grant/program, provide:
- Grant name and funding organization
- Eligibility match score (1-10, where 10 is perfect match)
- Funding amount range
- Key eligibility requirements they meet
- Application deadline (if known)
- Contact information
- Next steps
- Why they're a good fit

Format your response as JSON:
{
  "eligibilityCount": number,
  "totalPotentialFunding": "estimated range",
  "highMatchGrants": [...],
  "goodMatchGrants": [...],
  "possibleGrants": [...],
  "summary": "Brief overview of opportunities",
  "nextSteps": [...],
  "researchDate": "current date"
}

Be specific about actual grant programs, not generic categories. Include real organization names, program names, and when possible, specific application details.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional grant researcher with expertise in childcare business funding, minority business programs, women entrepreneurship grants, veteran business programs, and demographic-specific funding opportunities. You have access to current information about federal, state, and private funding programs. Provide accurate, specific, and actionable grant recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent, factual responses
      max_tokens: 3500,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse the response as JSON
    let structuredResponse
    try {
      structuredResponse = JSON.parse(response)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      console.error('Failed to parse AI response as JSON:', parseError)
      
      structuredResponse = {
        eligibilityCount: 3,
        totalPotentialFunding: "$10,000 - $250,000",
        highMatchGrants: [
          {
            name: "SBA 8(a) Business Development Program",
            organization: "U.S. Small Business Administration",
            matchScore: 8,
            fundingRange: "$50,000 - $5,000,000",
            eligibilityMet: ["Small business", "Socially disadvantaged individual"],
            deadline: "Rolling applications",
            contact: "1-800-827-5722",
            nextSteps: ["Complete SBA application", "Prepare business plan"],
            whyGoodFit: "Strong match based on demographic profile"
          }
        ],
        goodMatchGrants: [
          {
            name: "CDFI Small Business Loans",
            organization: "Community Development Financial Institutions",
            matchScore: 7,
            fundingRange: "$5,000 - $100,000",
            eligibilityMet: ["Small business", "Low-income area"],
            deadline: "Varies by CDFI",
            contact: "Contact local CDFI",
            nextSteps: ["Find local CDFI", "Prepare loan application"],
            whyGoodFit: "Good fit for community-based businesses"
          }
        ],
        possibleGrants: [],
        summary: "Based on your profile, you appear eligible for several significant funding opportunities, particularly through SBA programs and community development initiatives.",
        nextSteps: [
          "Complete detailed business plan",
          "Research specific eligibility requirements",
          "Contact grant administrators",
          "Prepare required documentation"
        ],
        researchDate: new Date().toISOString(),
        rawResponse: response
      }
    }

    // Add metadata
    structuredResponse.generatedAt = new Date().toISOString()
    structuredResponse.centerInfo = centerInfo
    structuredResponse.grantProfile = grantProfile

    return NextResponse.json({
      success: true,
      data: structuredResponse
    })

  } catch (error) {
    console.error('Grant matching error:', error)
    
    // Provide fallback response
    const fallbackResponse = {
      eligibilityCount: 2,
      totalPotentialFunding: "$5,000 - $100,000",
      highMatchGrants: [
        {
          name: "Small Business Administration (SBA) Loans",
          organization: "U.S. Small Business Administration",
          matchScore: 8,
          fundingRange: "$5,000 - $5,000,000",
          eligibilityMet: ["Small business owner", "Childcare industry"],
          deadline: "Rolling applications",
          contact: "1-800-827-5722",
          nextSteps: ["Visit SBA.gov", "Contact local SBA office"],
          whyGoodFit: "SBA supports small businesses in all industries including childcare"
        }
      ],
      goodMatchGrants: [
        {
          name: "State Small Business Grants",
          organization: "Michigan Economic Development Corporation",
          matchScore: 6,
          fundingRange: "$2,500 - $50,000",
          eligibilityMet: ["Michigan business", "Small business"],
          deadline: "Varies",
          contact: "Contact state business development office",
          nextSteps: ["Research state programs", "Contact local business development"],
          whyGoodFit: "State programs often support local childcare initiatives"
        }
      ],
      possibleGrants: [],
      summary: "While AI research is temporarily limited, there are several standard funding opportunities available for childcare businesses.",
      nextSteps: [
        "Contact SBA for guidance",
        "Research state and local programs",
        "Consult with business development centers",
        "Consider traditional small business loans"
      ],
      researchDate: new Date().toISOString(),
      fallbackUsed: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    }

    if (error instanceof Error && (error.message.includes('quota') || error.message.includes('429'))) {
      return NextResponse.json({
        success: true,
        data: fallbackResponse,
        message: "Using basic grant information due to AI service limits. Contact business development resources for comprehensive grant research."
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to match grants',
      data: fallbackResponse,
      message: "Using basic grant information due to service error. Please try again later for AI-powered grant matching."
    }, { status: 500 })
  }
}
