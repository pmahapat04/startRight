'use client'

import { useState, useEffect } from 'react'
import { OnboardingWizard } from '@/components/onboarding-wizard'
import { Dashboard } from '@/components/dashboard'
import { Center, TaskState, LicensingTask, Document } from '@/lib/types'
import licensingTasks from '@/data/licensing-tasks.json'

export default function Home() {
  const [center, setCenter] = useState<Center | null>(null)
  const [taskStates, setTaskStates] = useState<TaskState[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing center data in localStorage
    const savedCenter = localStorage.getItem('startright-center')
    const savedTaskStates = localStorage.getItem('startright-task-states')
    const savedDocuments = localStorage.getItem('startright-documents')
    
    if (savedCenter) {
      setCenter(JSON.parse(savedCenter))
    }
    
    if (savedTaskStates) {
      setTaskStates(JSON.parse(savedTaskStates))
    } else {
      // Initialize task states for all licensing tasks
      const initialTaskStates: TaskState[] = licensingTasks.map((task, index) => ({
        id: `task-${index}`,
        centerId: center?.id || 'temp',
        taskKey: task.key,
        status: 'to-do',
        evidenceIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      setTaskStates(initialTaskStates)
    }

    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments))
    }
    
    setIsLoading(false)
  }, [])

  const handleOnboardingComplete = (centerData: Omit<Center, 'id' | 'userId' | 'tasks' | 'documents' | 'createdAt' | 'updatedAt'>) => {
    const newCenter: Center = {
      ...centerData,
      id: `center-${Date.now()}`,
      userId: 'user-1', // In a real app, this would come from authentication
      tasks: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setCenter(newCenter)
    localStorage.setItem('startright-center', JSON.stringify(newCenter))
    
    // Initialize task states for the new center
    const initialTaskStates: TaskState[] = licensingTasks.map((task, index) => ({
      id: `task-${index}`,
      centerId: newCenter.id,
      taskKey: task.key,
      status: 'to-do',
      evidenceIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    
    setTaskStates(initialTaskStates)
    localStorage.setItem('startright-task-states', JSON.stringify(initialTaskStates))
  }

  const handleDocumentUpload = (document: Document) => {
    setDocuments(prev => [document, ...prev])
    localStorage.setItem('startright-documents', JSON.stringify([document, ...documents]))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!center) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  return (
    <Dashboard 
      center={center} 
      tasks={licensingTasks as LicensingTask[]} 
      taskStates={taskStates}
      documents={documents}
      onDocumentUpload={handleDocumentUpload}
    />
  )
}
