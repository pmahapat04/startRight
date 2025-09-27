'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Center, TaskState, LicensingTask, Document } from '@/lib/types'
import { getProgressPercentage, getStatusColor } from '@/lib/utils'
import { CheckCircle, Clock, FileText, Upload, MessageCircle, BookOpen } from 'lucide-react'
// import { FileUpload } from '@/components/file-upload' // Temporarily disabled
// import { AIProgramMatcher } from '@/components/ai-program-matcher'
// import { PersonalProfile } from '@/components/personal-profile'
import { GrantQuestionnaire } from '@/components/grant-questionnaire'
import { GrantResults } from '@/components/grant-results'

interface DashboardProps {
  center: Center
  tasks: LicensingTask[]
  taskStates: TaskState[]
  documents: Document[]
  onDocumentUpload: (document: Document) => void
}

export function Dashboard({ center, tasks, taskStates, documents, onDocumentUpload }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'documents' | 'programs'>('overview')
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState<any[]>([])
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false)
  const [checklistLastGenerated, setChecklistLastGenerated] = useState<Date | null>(null)
  const [completedAiTasks, setCompletedAiTasks] = useState<Set<string>>(new Set())
  
  // Grant matching states
  const [programView, setProgramView] = useState<'questionnaire' | 'results'>('questionnaire')
  const [grantResults, setGrantResults] = useState<any>(null)
  const [grantProfile, setGrantProfile] = useState<any>(null)

  const completedTasks = taskStates.filter(task => task.status === 'done').length
  const inProgressTasks = taskStates.filter(task => task.status === 'in-progress').length
  const totalTasks = tasks.length
  const progressPercentage = getProgressPercentage(completedTasks, totalTasks)

  const generateAIChecklist = async () => {
    setIsGeneratingChecklist(true)
    try {
      const response = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          centerInfo: center,
          forceRefresh: true
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAiGeneratedTasks(data.data.checklist || [])
        setChecklistLastGenerated(new Date())
      } else {
        console.error('Failed to generate checklist:', data.error)
        // Use fallback if provided
        if (data.data?.checklist) {
          setAiGeneratedTasks(data.data.checklist)
          setChecklistLastGenerated(new Date())
        }
      }
    } catch (error) {
      console.error('Error generating checklist:', error)
    } finally {
      setIsGeneratingChecklist(false)
    }
  }

  const nextTask = tasks.find(task => {
    const taskState = taskStates.find(ts => ts.taskKey === task.key)
    return !taskState || taskState.status === 'to-do'
  })

  const getNextAction = () => {
    if (nextTask) {
      return {
        title: nextTask.title,
        description: nextTask.description,
        estimatedDays: nextTask.estimatedDays,
        category: nextTask.category
      }
    }
    return null
  }

  const nextAction = getNextAction()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Licensing Progress
          </CardTitle>
          <CardDescription>
            Track your progress through the Michigan licensing process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{totalTasks - completedTasks - inProgressTasks}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Best Action */}
      {nextAction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Best Action
            </CardTitle>
            <CardDescription>
              Your recommended next step in the licensing process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{nextAction.title}</h4>
                <p className="text-sm text-muted-foreground">{nextAction.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {nextAction.category}
                </span>
                <span className="text-muted-foreground">
                  Estimated: {nextAction.estimatedDays} days
                </span>
              </div>
              <Button 
                className="w-full"
                onClick={() => setActiveTab('checklist')}
              >
                Start This Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('checklist')}
            >
              <FileText className="h-6 w-6" />
              <span>Checklist</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('documents')}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Docs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('programs')}
            >
              <BookOpen className="h-6 w-6" />
              <span>Programs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('ai')}
            >
              <MessageCircle className="h-6 w-6" />
              <span>Ask AI</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )


  const renderChecklist = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI-Generated Licensing Checklist</h2>
        <div className="flex gap-2">
          <Button 
            onClick={generateAIChecklist}
            disabled={isGeneratingChecklist}
            variant="outline"
          >
            {isGeneratingChecklist ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                {aiGeneratedTasks.length > 0 ? 'Refresh' : 'Generate'} Checklist
              </>
            )}
          </Button>
          <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
        </div>
      </div>

      {checklistLastGenerated && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Last updated: {checklistLastGenerated.toLocaleString()} | 
              Generated by AI from current Michigan licensing requirements
            </p>
          </CardContent>
        </Card>
      )}

      {isGeneratingChecklist && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Researching Current Requirements</h3>
              <p className="text-muted-foreground">
                AI is analyzing the latest Michigan LARA/MiLEAP requirements to create your personalized checklist...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGeneratingChecklist && aiGeneratedTasks.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Generate Your Custom Checklist</h3>
              <p className="text-muted-foreground mb-4">
                Click "Generate Checklist" to have AI research the latest Michigan childcare licensing 
                requirements and create a personalized checklist for your {center.name}.
              </p>
              <Button onClick={generateAIChecklist}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Generate AI Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {aiGeneratedTasks.length > 0 && !isGeneratingChecklist && (
        <div className="space-y-4">
          {aiGeneratedTasks.map((task, index) => {
            const priorityColors = {
              high: 'bg-red-100 text-red-800 border-red-200',
              medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              low: 'bg-green-100 text-green-800 border-green-200'
            }

            return (
              <Card 
                key={task.id || index} 
                className={`relative transition-colors duration-200 ${
                  completedAiTasks.has(task.id) 
                    ? 'bg-green-50 border-green-200' 
                    : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[task.priority] || priorityColors.medium}`}>
                          {task.priority} priority
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      
                      {task.requirements && task.requirements.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {task.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {task.officialForms && task.officialForms.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Official Forms:</h4>
                          <div className="space-y-1">
                            {task.officialForms.map((form, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>{form.name}</span>
                                {form.number && (
                                  <span className="text-muted-foreground">({form.number})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {task.legalReference && (
                        <div className="mb-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Legal Reference: {task.legalReference}
                          </span>
                        </div>
                      )}

                      {task.tips && task.tips.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1 text-green-700">💡 Tips:</h4>
                          <ul className="text-sm text-green-600 space-y-1">
                            {task.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Est. {task.estimatedDays} days</span>
                        {task.contactInfo && (
                          <span>Contact: {task.contactInfo.agency}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant={completedAiTasks.has(task.id) ? "default" : "outline"}
                        onClick={() => {
                          setCompletedAiTasks(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(task.id)) {
                              newSet.delete(task.id)
                            } else {
                              newSet.add(task.id)
                            }
                            return newSet
                          })
                        }}
                        className={completedAiTasks.has(task.id) ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {completedAiTasks.has(task.id) ? "✓ Completed" : "Mark Complete"}
                      </Button>
                      {task.contactInfo?.phone && (
                        <Button size="sm" variant="ghost" className="text-xs">
                          📞 {task.contactInfo.phone}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Vault</h2>
        <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
      </div>
      {/* <FileUpload 
        centerId={center.id} 
        onUploadComplete={onDocumentUpload}
      /> */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Documents</h3>
            <p className="text-muted-foreground mb-4">
              Document upload feature will be available with database setup
            </p>
            <Button disabled>Upload Document</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrograms = () => {
    if (programView === 'results' && grantResults) {
      return (
        <GrantResults
          results={grantResults}
          profile={grantProfile}
          center={center}
          onNewSearch={() => {
            setProgramView('questionnaire')
            setGrantResults(null)
            setGrantProfile(null)
          }}
          onBack={() => setActiveTab('overview')}
        />
      )
    }

    return (
      <GrantQuestionnaire
        center={center}
        onComplete={(profile, results) => {
          setGrantProfile(profile)
          setGrantResults(results)
          setProgramView('results')
        }}
        onBack={() => setActiveTab('overview')}
      />
    )
  }

  const renderAI = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Helper</h2>
        <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ask Your Questions</h3>
            <p className="text-muted-foreground mb-4">
              Get help with Michigan childcare licensing questions
            </p>
            <Button>Start Chat</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to {center.name}</h1>
          <p className="text-muted-foreground">
            {center.type} • {center.city}, {center.state} • Capacity: {center.capacity}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'checklist' && renderChecklist()}
            {activeTab === 'documents' && renderDocuments()}
            {activeTab === 'programs' && renderPrograms()}
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button 
                  variant={activeTab === 'checklist' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('checklist')}
                >
                  Checklist
                </Button>
                <Button 
                  variant={activeTab === 'documents' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </Button>
                <Button 
                  variant={activeTab === 'programs' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('programs')
                    setProgramView('questionnaire') // Reset to questionnaire when accessing programs
                  }}
                >
                  💰 Find Grants
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
