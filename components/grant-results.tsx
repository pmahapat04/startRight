'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge' // Using inline styles instead
import { CheckCircle, DollarSign, Phone, ExternalLink, Calendar, Users, Award, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react'

interface Grant {
  name: string
  organization: string
  matchScore: number
  fundingRange: string
  eligibilityMet: string[]
  deadline: string
  contact: string
  nextSteps: string[]
  whyGoodFit: string
  website?: string
}

interface GrantResults {
  eligibilityCount: number
  totalPotentialFunding: string
  highMatchGrants: Grant[]
  goodMatchGrants: Grant[]
  possibleGrants: Grant[]
  summary: string
  nextSteps: string[]
  researchDate: string
  error?: string
  fallbackUsed?: boolean
}

interface GrantResultsProps {
  results: GrantResults
  profile: any
  center: any
  onNewSearch: () => void
  onBack: () => void
}

export function GrantResults({ results, profile, center, onNewSearch, onBack }: GrantResultsProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent Match'
    if (score >= 6) return 'Good Match'
    return 'Possible Match'
  }

  const renderGrant = (grant: Grant, category: string) => (
    <Card key={grant.name} className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{grant.name}</CardTitle>
            <CardDescription className="mt-1">{grant.organization}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs border ${getMatchScoreColor(grant.matchScore)}`}>
              {getMatchScoreLabel(grant.matchScore)} ({grant.matchScore}/10)
            </span>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">{grant.fundingRange}</div>
              <div className="text-xs text-muted-foreground">Funding Range</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Why You Qualify
          </h4>
          <p className="text-sm text-muted-foreground mb-2">{grant.whyGoodFit}</p>
          <div className="flex flex-wrap gap-1">
            {grant.eligibilityMet.map((criteria, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-200">
                {criteria}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              Deadline
            </div>
            <div>{grant.deadline}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Phone className="w-3 h-3" />
              Contact
            </div>
            <div>{grant.contact}</div>
          </div>
        </div>

        {grant.nextSteps && grant.nextSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <ArrowRight className="w-4 h-4 text-blue-600" />
              Next Steps
            </h4>
            <ul className="text-sm space-y-1">
              {grant.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Award className="w-4 h-4 mr-1" />
            Apply Now
          </Button>
          {grant.website && (
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Grant Opportunities</h1>
          <p className="text-muted-foreground">
            Based on your profile, here are funding opportunities you're eligible for
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewSearch}>
            Retake Assessment
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back to Programs
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{results.eligibilityCount || 0}</p>
                <p className="text-sm text-muted-foreground">Grants Found</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{results.totalPotentialFunding || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Potential Funding</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{center.name}</p>
                <p className="text-sm text-muted-foreground">Your Center</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      {results.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{results.summary}</p>
            {results.fallbackUsed && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Using basic grant information. For comprehensive research, try again later.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* High Match Grants */}
      {results.highMatchGrants && results.highMatchGrants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-green-600">🎯 Excellent Matches</h2>
            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
              {results.highMatchGrants.length} found
            </span>
          </div>
          <div className="grid gap-4">
            {results.highMatchGrants.map(grant => renderGrant(grant, 'high'))}
          </div>
        </div>
      )}

      {/* Good Match Grants */}
      {results.goodMatchGrants && results.goodMatchGrants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-yellow-600">👍 Good Matches</h2>
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
              {results.goodMatchGrants.length} found
            </span>
          </div>
          <div className="grid gap-4">
            {results.goodMatchGrants.map(grant => renderGrant(grant, 'good'))}
          </div>
        </div>
      )}

      {/* Possible Grants */}
      {results.possibleGrants && results.possibleGrants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-blue-600">💡 Worth Exploring</h2>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
              {results.possibleGrants.length} found
            </span>
          </div>
          <div className="grid gap-4">
            {results.possibleGrants.map(grant => renderGrant(grant, 'possible'))}
          </div>
        </div>
      )}

      {/* No Results */}
      {(!results.highMatchGrants || results.highMatchGrants.length === 0) && 
       (!results.goodMatchGrants || results.goodMatchGrants.length === 0) && 
       (!results.possibleGrants || results.possibleGrants.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Specific Matches Found</h3>
              <p className="text-muted-foreground mb-4">
                Our AI research didn't find specific grants matching your exact profile. 
                This doesn't mean funding isn't available!
              </p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <p className="font-medium">Consider these general resources:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• SBA loans and programs (sba.gov)</li>
                  <li>• State business development programs</li>
                  <li>• Local economic development offices</li>
                  <li>• SCORE mentoring (score.org)</li>
                  <li>• Community Development Financial Institutions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {results.nextSteps && results.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {results.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-medium mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-blue-900">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Research Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Research completed: {new Date(results.researchDate).toLocaleString()}</span>
            <span>Powered by AI grant research</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
