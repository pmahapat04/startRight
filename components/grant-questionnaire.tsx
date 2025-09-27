'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Center } from '@/lib/types'
import { Users, DollarSign, MapPin, Building, Heart, Award, Loader2, CheckCircle } from 'lucide-react'

interface GrantProfile {
  // Demographics
  gender: string
  race: string
  age: string
  isVeteran: boolean
  hasDisability: boolean
  
  // Economic Status
  householdIncome: string
  receivingAssistance: boolean
  assistancePrograms: string[]
  lowIncomeArea: boolean
  singleParent: boolean
  
  // Business Status
  businessExperience: string
  firstTimeOwner: boolean
  hasBusinessPlan: boolean
  creditScore: string
  fundingNeeded: string
  
  // Childcare Specific
  serveLowIncome: boolean
  foodService: boolean
  specialNeeds: boolean
  bilingualServices: boolean
  ruralLocation: boolean
}

interface GrantQuestionnaireProps {
  center: Center
  onComplete: (profile: GrantProfile, results: any) => void
  onBack: () => void
}

export function GrantQuestionnaire({ center, onComplete, onBack }: GrantQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<GrantProfile>({
    gender: '',
    race: '',
    age: '',
    isVeteran: false,
    hasDisability: false,
    householdIncome: '',
    receivingAssistance: false,
    assistancePrograms: [],
    lowIncomeArea: false,
    singleParent: false,
    businessExperience: '',
    firstTimeOwner: true,
    hasBusinessPlan: false,
    creditScore: '',
    fundingNeeded: '',
    serveLowIncome: false,
    foodService: false,
    specialNeeds: false,
    bilingualServices: false,
    ruralLocation: false
  })

  const totalSteps = 4

  const handleArrayChange = (field: 'assistancePrograms', value: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/grant-matcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          centerInfo: center,
          grantProfile: profile
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        onComplete(profile, data.data)
      } else {
        console.error('Grant matching failed:', data.error)
        // Still show results even if there was an error
        onComplete(profile, data.data || {})
      }
    } catch (error) {
      console.error('Error matching grants:', error)
      // Provide fallback
      onComplete(profile, {
        eligibilityCount: 0,
        error: 'Unable to connect to grant matching service'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Personal Demographics
        </CardTitle>
        <CardDescription>
          This information helps us find grants specifically for your background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age">Age Range</Label>
            <Select value={profile.age} onValueChange={(value) => setProfile(prev => ({ ...prev, age: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46-55">46-55</SelectItem>
                <SelectItem value="56-65">56-65</SelectItem>
                <SelectItem value="65+">65+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="race">Race/Ethnicity</Label>
          <Select value={profile.race} onValueChange={(value) => setProfile(prev => ({ ...prev, race: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select race/ethnicity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="african-american">African American/Black</SelectItem>
              <SelectItem value="hispanic-latino">Hispanic/Latino</SelectItem>
              <SelectItem value="native-american">Native American</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="mixed">Mixed/Multiracial</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Special Status (Check all that apply)</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVeteran"
                checked={profile.isVeteran}
                onChange={(e) => setProfile(prev => ({ ...prev, isVeteran: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isVeteran">Veteran or active military</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasDisability"
                checked={profile.hasDisability}
                onChange={(e) => setProfile(prev => ({ ...prev, hasDisability: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="hasDisability">Person with disability</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="singleParent"
                checked={profile.singleParent}
                onChange={(e) => setProfile(prev => ({ ...prev, singleParent: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="singleParent">Single parent</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Economic Background
        </CardTitle>
        <CardDescription>
          Financial information helps identify income-based funding opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="householdIncome">Annual Household Income</Label>
          <Select value={profile.householdIncome} onValueChange={(value) => setProfile(prev => ({ ...prev, householdIncome: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-25k">Under $25,000</SelectItem>
              <SelectItem value="25k-35k">$25,000 - $35,000</SelectItem>
              <SelectItem value="35k-50k">$35,000 - $50,000</SelectItem>
              <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
              <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
              <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
              <SelectItem value="over-150k">Over $150,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="receivingAssistance"
              checked={profile.receivingAssistance}
              onChange={(e) => setProfile(prev => ({ ...prev, receivingAssistance: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="receivingAssistance">Currently receiving government assistance</Label>
          </div>
          
          {profile.receivingAssistance && (
            <div className="space-y-2 ml-6">
              <Label>Which programs? (Check all that apply)</Label>
              {['SNAP (Food Stamps)', 'TANF (Cash Assistance)', 'Medicaid', 'WIC', 'Housing Assistance', 'Childcare Assistance'].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={program}
                    checked={profile.assistancePrograms.includes(program)}
                    onChange={(e) => handleArrayChange('assistancePrograms', program, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="lowIncomeArea"
            checked={profile.lowIncomeArea}
            onChange={(e) => setProfile(prev => ({ ...prev, lowIncomeArea: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <Label htmlFor="lowIncomeArea">Located in low-income or underserved area</Label>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Business Experience
        </CardTitle>
        <CardDescription>
          Business background helps match you to appropriate funding programs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="businessExperience">Business Experience Level</Label>
          <Select value={profile.businessExperience} onValueChange={(value) => setProfile(prev => ({ ...prev, businessExperience: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No previous business experience</SelectItem>
              <SelectItem value="some">Some business experience</SelectItem>
              <SelectItem value="experienced">Experienced business owner</SelectItem>
              <SelectItem value="serial">Serial entrepreneur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="creditScore">Credit Score Range</Label>
          <Select value={profile.creditScore} onValueChange={(value) => setProfile(prev => ({ ...prev, creditScore: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select credit range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor (300-579)</SelectItem>
              <SelectItem value="fair">Fair (580-669)</SelectItem>
              <SelectItem value="good">Good (670-739)</SelectItem>
              <SelectItem value="very-good">Very Good (740-799)</SelectItem>
              <SelectItem value="excellent">Excellent (800+)</SelectItem>
              <SelectItem value="unknown">Don't know</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fundingNeeded">How much funding do you need?</Label>
          <Select value={profile.fundingNeeded} onValueChange={(value) => setProfile(prev => ({ ...prev, fundingNeeded: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select funding range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-10k">Under $10,000</SelectItem>
              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
              <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
              <SelectItem value="over-250k">Over $250,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="firstTimeOwner"
              checked={profile.firstTimeOwner}
              onChange={(e) => setProfile(prev => ({ ...prev, firstTimeOwner: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="firstTimeOwner">First-time business owner</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasBusinessPlan"
              checked={profile.hasBusinessPlan}
              onChange={(e) => setProfile(prev => ({ ...prev, hasBusinessPlan: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="hasBusinessPlan">Have a completed business plan</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Childcare Program Details
        </CardTitle>
        <CardDescription>
          Program specifics help identify childcare industry grants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Your childcare program will include: (Check all that apply)</Label>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="serveLowIncome"
              checked={profile.serveLowIncome}
              onChange={(e) => setProfile(prev => ({ ...prev, serveLowIncome: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="serveLowIncome">Serve low-income families</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="foodService"
              checked={profile.foodService}
              onChange={(e) => setProfile(prev => ({ ...prev, foodService: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="foodService">Provide meals/food service</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="specialNeeds"
              checked={profile.specialNeeds}
              onChange={(e) => setProfile(prev => ({ ...prev, specialNeeds: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="specialNeeds">Care for children with special needs</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bilingualServices"
              checked={profile.bilingualServices}
              onChange={(e) => setProfile(prev => ({ ...prev, bilingualServices: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="bilingualServices">Bilingual/multilingual services</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ruralLocation"
              checked={profile.ruralLocation}
              onChange={(e) => setProfile(prev => ({ ...prev, ruralLocation: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="ruralLocation">Located in rural area</Label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Ready to find your grants!</h4>
          <p className="text-sm text-blue-700">
            Based on your answers, our AI will research specific grants and funding opportunities 
            you're eligible for. This may take a moment.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grant Eligibility Assessment</h1>
          <p className="text-muted-foreground">
            Answer a few questions to discover grants and funding opportunities for your childcare business
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Programs
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Current Step */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 mx-auto text-blue-600 mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Finding Your Grants</h3>
              <p className="text-muted-foreground">
                Our AI is researching grants and funding opportunities based on your profile...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!isLoading && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!profile.gender || !profile.race || !profile.age)) ||
              (currentStep === 2 && !profile.householdIncome) ||
              (currentStep === 3 && (!profile.businessExperience || !profile.creditScore || !profile.fundingNeeded))
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Researching...
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Find My Grants
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
