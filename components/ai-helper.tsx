'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Center, AIResponse } from '@/lib/types'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIHelperProps {
  center: Center
}

export function AIHelper({ center }: AIHelperProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for Michigan childcare licensing. I can help you with questions about the licensing process, requirements, and next steps. What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // In a real app, this would call the OpenAI API
      const response = await simulateAIResponse(input.trim())
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (question: string): Promise<AIResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerQuestion = question.toLowerCase()

    // Simple keyword-based responses (in a real app, this would use OpenAI embeddings)
    if (lowerQuestion.includes('fire') || lowerQuestion.includes('inspection')) {
      return {
        answer: `For fire safety inspections in Michigan, you'll need to contact your local fire department to schedule an inspection. They'll check for proper fire exits, smoke detectors, fire extinguishers, and other safety equipment. Make sure your facility meets all local fire codes before the inspection.`,
        sources: ['Michigan Fire Safety Code', 'Local Fire Department Guidelines'],
        confidence: 0.9
      }
    }

    if (lowerQuestion.includes('health') || lowerQuestion.includes('sanitation')) {
      return {
        answer: `Health department inspections focus on sanitation, food handling (if you serve meals), and general health safety. You'll need to ensure proper handwashing facilities, clean surfaces, safe food storage, and appropriate waste disposal. Contact your local health department to schedule the inspection.`,
        sources: ['Michigan Health Department', 'Child Care Health Guidelines'],
        confidence: 0.9
      }
    }

    if (lowerQuestion.includes('background') || lowerQuestion.includes('check')) {
      return {
        answer: `All staff members and household members over 18 must complete background checks. This includes fingerprinting and criminal history checks. You can start this process at your local police department or through approved vendors. This process can take 2-4 weeks, so start early.`,
        sources: ['Michigan LARA Background Check Requirements', 'Local Police Department'],
        confidence: 0.9
      }
    }

    if (lowerQuestion.includes('great start') || lowerQuestion.includes('quality')) {
      return {
        answer: `Great Start to Quality is Michigan's quality rating and improvement system. It provides coaching, resources, and recognition for quality childcare programs. Enrollment is voluntary but can help improve your program and increase visibility to families. The process includes a self-assessment and quality improvement planning.`,
        sources: ['Great Start to Quality Website', 'Michigan Department of Education'],
        confidence: 0.9
      }
    }

    if (lowerQuestion.includes('cacfp') || lowerQuestion.includes('food') || lowerQuestion.includes('meal')) {
      return {
        answer: `CACFP (Child and Adult Care Food Program) provides reimbursement for nutritious meals and snacks. To be eligible, you must serve meals to children and follow USDA nutrition guidelines. The program requires annual training and detailed meal records. Contact your local CACFP sponsor to apply.`,
        sources: ['USDA CACFP Guidelines', 'Michigan Department of Education CACFP'],
        confidence: 0.9
      }
    }

    if (lowerQuestion.includes('next') || lowerQuestion.includes('what should i do')) {
      return {
        answer: `Based on your center type (${center.type}), I recommend starting with research and business planning. Your next steps should include: 1) Research licensing requirements, 2) Develop a business plan, 3) Secure your facility location, and 4) Begin background checks for staff. Would you like more details about any of these steps?`,
        sources: ['Michigan LARA Licensing Guide', 'StartRight Checklist'],
        confidence: 0.8
      }
    }

    if (lowerQuestion.includes('cost') || lowerQuestion.includes('fee') || lowerQuestion.includes('price')) {
      return {
        answer: `Licensing costs vary by center type. Application fees typically range from $100-500, plus costs for inspections, background checks, and required training. Additional costs include facility preparation, equipment, and ongoing compliance. Budget for $2,000-5,000 in initial licensing costs, plus ongoing operational expenses.`,
        sources: ['Michigan LARA Fee Schedule', 'Child Care Business Planning Guide'],
        confidence: 0.8
      }
    }

    // Default response
    return {
      answer: `I understand you're asking about "${question}". For specific Michigan childcare licensing questions, I recommend checking the LARA website or contacting your local licensing specialist. I can help with general questions about the licensing process, requirements, and next steps. What specific aspect would you like to know more about?`,
      sources: ['Michigan LARA', 'Child Care Licensing Resources'],
      confidence: 0.6
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">AI Helper</h2>
          <p className="text-muted-foreground">
            Ask questions about Michigan childcare licensing
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about Michigan childcare licensing..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Quick Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "What's my next step?",
              "How do I get a fire inspection?",
              "What is Great Start to Quality?",
              "How much does licensing cost?",
              "What background checks do I need?",
              "How do I apply for CACFP?"
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
