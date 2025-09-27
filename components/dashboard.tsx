'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Center, TaskState, LicensingTask } from '@/lib/types'
import { getProgressPercentage, getStatusColor } from '@/lib/utils'
import { CheckCircle, Clock, FileText, Upload, MessageCircle, BookOpen } from 'lucide-react'

interface DashboardProps {
  center: Center
  tasks: LicensingTask[]
  taskStates: TaskState[]
}

export function Dashboard({ center, tasks, taskStates }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'documents' | 'programs' | 'ai'>('overview')

  const completedTasks = taskStates.filter(task => task.status === 'done').length
  const inProgressTasks = taskStates.filter(task => task.status === 'in-progress').length
  const totalTasks = tasks.length
  const progressPercentage = getProgressPercentage(completedTasks, totalTasks)

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
              <Button className="w-full">
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
        <h2 className="text-2xl font-bold">Licensing Checklist</h2>
        <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => {
          const taskState = taskStates.find(ts => ts.taskKey === task.key)
          const status = taskState?.status || 'to-do'
          
          return (
            <Card key={task.key}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                        {status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Category: {task.category}</span>
                      <span>Est. {task.estimatedDays} days</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    {status === 'done' ? 'View' : status === 'in-progress' ? 'Continue' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Vault</h2>
        <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Documents</h3>
            <p className="text-muted-foreground mb-4">
              Upload and organize your licensing documents
            </p>
            <Button>Upload Document</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrograms = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Program Eligibility</h2>
        <Button onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Program Matcher</h3>
            <p className="text-muted-foreground mb-4">
              Check your eligibility for Great Start to Quality and CACFP
            </p>
            <Button>Check Eligibility</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
            {activeTab === 'ai' && renderAI()}
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
                  onClick={() => setActiveTab('programs')}
                >
                  Programs
                </Button>
                <Button 
                  variant={activeTab === 'ai' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('ai')}
                >
                  AI Helper
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
