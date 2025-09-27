'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Center } from '@/lib/types'

interface OnboardingWizardProps {
  onComplete: (center: Omit<Center, 'id' | 'userId' | 'tasks' | 'documents' | 'createdAt' | 'updatedAt'>) => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'Center' | 'Family' | 'Group Home' | '',
    address: '',
    city: '',
    state: 'MI',
    zipCode: '',
    capacity: '',
    agesServed: [] as string[],
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      const center = {
        name: formData.name,
        type: formData.type as 'Center' | 'Family' | 'Group Home',
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        capacity: parseInt(formData.capacity),
        agesServed: formData.agesServed,
        status: 'planning' as const,
      }
      onComplete(center)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAgeRange = (age: string) => {
    setFormData(prev => ({
      ...prev,
      agesServed: prev.agesServed.includes(age)
        ? prev.agesServed.filter(a => a !== age)
        : [...prev.agesServed, age]
    }))
  }

  const ageRanges = [
    'Infants (0-12 months)',
    'Toddlers (12-24 months)',
    'Preschool (2-5 years)',
    'School-age (5-12 years)'
  ]

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Welcome to StartRight</h2>
              <p className="text-center text-muted-foreground">
                Let's get your childcare center set up. First, tell us about your business.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Center Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your center name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Business Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Center">Child Care Center</SelectItem>
                    <SelectItem value="Family">Family Child Care Home</SelectItem>
                    <SelectItem value="Group Home">Group Child Care Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Location Details</h2>
              <p className="text-center text-muted-foreground">
                Where will your childcare center be located?
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Detroit"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="48201"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Capacity & Ages</h2>
              <p className="text-center text-muted-foreground">
                How many children will you serve and what ages?
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="capacity">Maximum Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="12"
                  value={formData.capacity}
                  onChange={(e) => updateFormData('capacity', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum number of children you plan to serve
                </p>
              </div>
              <div>
                <Label>Ages You'll Serve</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ageRanges.map((age) => (
                    <Button
                      key={age}
                      variant={formData.agesServed.includes(age) ? "default" : "outline"}
                      onClick={() => toggleAgeRange(age)}
                      className="justify-start"
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Review Your Information</h2>
              <p className="text-center text-muted-foreground">
                Please review your information before we create your center profile.
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Center Name</Label>
                    <p className="text-lg">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
                    <p className="text-lg">{formData.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-lg">
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                    <p className="text-lg">{formData.capacity} children</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ages Served</Label>
                    <p className="text-lg">{formData.agesServed.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="text-center">
            <CardTitle>Set Up Your Childcare Center</CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.name || !formData.type)) ||
                (step === 2 && (!formData.address || !formData.city || !formData.zipCode)) ||
                (step === 3 && (!formData.capacity || formData.agesServed.length === 0))
              }
            >
              {step === totalSteps ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
