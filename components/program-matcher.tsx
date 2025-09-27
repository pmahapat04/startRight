'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Center, Program, ProgramMatch } from '@/lib/types'
import { getEligibilityColor } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Phone, Mail } from 'lucide-react'
import programs from '@/data/programs.json'

interface ProgramMatcherProps {
  center: Center
  onMatchComplete: (matches: ProgramMatch[]) => void
}

export function ProgramMatcher({ center, onMatchComplete }: ProgramMatcherProps) {
  const [currentStep, setCurrentStep] = useState<'questions' | 'results'>('questions')
  const [answers, setAnswers] = useState({
    servesFood: false,
    wantsCoaching: false,
    staffRegistryStatus: false,
  })
  const [matches, setMatches] = useState<ProgramMatch[]>([])

  const handleAnswerChange = (question: keyof typeof answers, value: boolean) => {
    setAnswers(prev => ({ ...prev, [question]: value }))
  }

  const calculateMatches = () => {
    const programMatches: ProgramMatch[] = programs.map((program: Program) => {
      const criteria = program.eligibilityCriteria
      
      // Check eligibility based on center type
      const centerTypeMatch = criteria.centerType.includes(center.type)
      
      // Check other criteria
      const servesFoodMatch = criteria.servesFood === answers.servesFood
      const coachingMatch = criteria.wantsCoaching === answers.wantsCoaching
      const staffRegistryMatch = criteria.staffRegistryStatus === answers.staffRegistryStatus
      
      // Calculate overall eligibility
      const allCriteriaMatch = centerTypeMatch && servesFoodMatch && coachingMatch && staffRegistryMatch
      const someCriteriaMatch = centerTypeMatch && (servesFoodMatch || coachingMatch || staffRegistryMatch)
      
      let eligibility: 'eligible' | 'likely' | 'not-eligible'
      let rationale: string
      let nextSteps: string[]
      
      if (allCriteriaMatch) {
        eligibility = 'eligible'
        rationale = 'You meet all eligibility criteria for this program.'
        nextSteps = program.applicationProcess
      } else if (someCriteriaMatch) {
        eligibility = 'likely'
        rationale = 'You meet most eligibility criteria. Some requirements may need to be addressed.'
        nextSteps = [
          'Review specific requirements that may not be met',
          ...program.applicationProcess
        ]
      } else {
        eligibility = 'not-eligible'
        rationale = 'You do not currently meet the eligibility criteria for this program.'
        nextSteps = [
          'Consider if you can meet the requirements in the future',
          'Look for alternative programs that may be a better fit'
        ]
      }
      
      return {
        id: `match-${program.key}`,
        centerId: center.id,
        programKey: program.key,
        eligibility,
        rationale,
        nextSteps,
        createdAt: new Date()
      }
    })
    
    setMatches(programMatches)
    onMatchComplete(programMatches)
    setCurrentStep('results')
  }

  const getEligibilityIcon = (eligibility: string) => {
    switch (eligibility) {
      case 'eligible':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'likely':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'not-eligible':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const renderQuestions = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Program Eligibility Assessment</h2>
        <p className="text-muted-foreground">
          Answer a few questions to see which programs you're eligible for
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Your Program</CardTitle>
          <CardDescription>
            Help us understand your program to match you with the right opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">Do you plan to serve meals and snacks?</Label>
                <p className="text-sm text-muted-foreground">
                  This affects eligibility for nutrition programs like CACFP
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={answers.servesFood ? "default" : "outline"}
                  onClick={() => handleAnswerChange('servesFood', true)}
                >
                  Yes
                </Button>
                <Button
                  variant={!answers.servesFood ? "default" : "outline"}
                  onClick={() => handleAnswerChange('servesFood', false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">Are you interested in quality improvement coaching?</Label>
                <p className="text-sm text-muted-foreground">
                  This affects eligibility for programs like Great Start to Quality
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={answers.wantsCoaching ? "default" : "outline"}
                  onClick={() => handleAnswerChange('wantsCoaching', true)}
                >
                  Yes
                </Button>
                <Button
                  variant={!answers.wantsCoaching ? "default" : "outline"}
                  onClick={() => handleAnswerChange('wantsCoaching', false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">Do you have staff registered in the Michigan Registry?</Label>
                <p className="text-sm text-muted-foreground">
                  Some programs require staff to be registered in the state registry
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={answers.staffRegistryStatus ? "default" : "outline"}
                  onClick={() => handleAnswerChange('staffRegistryStatus', true)}
                >
                  Yes
                </Button>
                <Button
                  variant={!answers.staffRegistryStatus ? "default" : "outline"}
                  onClick={() => handleAnswerChange('staffRegistryStatus', false)}
                >
                  No
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={calculateMatches} className="w-full">
            Check My Eligibility
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Program Matches</h2>
          <p className="text-muted-foreground">
            Based on your answers, here are the programs you're eligible for
          </p>
        </div>
        <Button variant="outline" onClick={() => setCurrentStep('questions')}>
          Retake Assessment
        </Button>
      </div>

      <div className="grid gap-6">
        {matches.map((match) => {
          const program = programs.find(p => p.key === match.programKey) as Program
          if (!program) return null

          return (
            <Card key={match.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getEligibilityIcon(match.eligibility)}
                      {program.name}
                    </CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEligibilityColor(match.eligibility)}`}>
                    {match.eligibility.replace('-', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Eligibility Assessment</h4>
                  <p className="text-sm text-muted-foreground">{match.rationale}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {program.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    {match.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{program.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{program.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={program.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {program.contactInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {currentStep === 'questions' ? renderQuestions() : renderResults()}
      </div>
    </div>
  )
}
