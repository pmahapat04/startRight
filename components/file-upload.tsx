'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadFile, saveDocument } from '@/lib/supabase'
import { Document } from '@/lib/types'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  centerId: string
  onUploadComplete: (document: Document) => void
}

export function FileUpload({ centerId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadForm, setUploadForm] = useState({
    name: '',
    tags: [] as string[],
    taskKey: '',
  })
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadForm(prev => ({ ...prev, name: file.name }))
      setUploadStatus('idle')
    }
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !uploadForm.tags.includes(tag)) {
      setUploadForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setUploadForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.name) return

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFile(selectedFile, centerId)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Save document record to database
      const documentData = {
        centerId,
        name: uploadForm.name,
        url: uploadData.publicUrl,
        type: selectedFile.type.split('/')[1] as any,
        tags: uploadForm.tags,
        taskKey: uploadForm.taskKey || undefined,
      }

      const { data: saveData, error: saveError } = await saveDocument(documentData)

      if (saveError) {
        throw new Error(saveError.message)
      }

      // Create document object for parent component
      const document: Document = {
        id: saveData[0].id,
        centerId,
        name: uploadForm.name,
        url: uploadData.publicUrl,
        type: documentData.type,
        tags: uploadForm.tags,
        uploadedAt: new Date(),
        taskKey: uploadForm.taskKey || undefined,
      }

      setUploadStatus('success')
      onUploadComplete(document)

      // Reset form
      setUploadForm({ name: '', tags: [], taskKey: '' })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadStatus('idle'), 3000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div>
          <Label htmlFor="file">Select File</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="mt-1"
          />
          {selectedFile && (
            <div className="mt-2 p-2 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
              </p>
            </div>
          )}
        </div>

        {/* Document Name */}
        <div>
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            placeholder="Enter a descriptive name"
            value={uploadForm.name}
            onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Related Task */}
        <div>
          <Label htmlFor="taskKey">Related Task (Optional)</Label>
          <Select value={uploadForm.taskKey} onValueChange={(value) => setUploadForm(prev => ({ ...prev, taskKey: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a licensing task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fire-inspection">Fire Safety Inspection</SelectItem>
              <SelectItem value="health-inspection">Health Department Inspection</SelectItem>
              <SelectItem value="background-checks">Background Checks</SelectItem>
              <SelectItem value="business-plan">Business Plan</SelectItem>
              <SelectItem value="curriculum-development">Curriculum Development</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {uploadForm.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add a tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTagAdd(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add a tag"]') as HTMLInputElement
                if (input.value) {
                  handleTagAdd(input.value)
                  input.value = ''
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Uploading... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Upload successful!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !uploadForm.name || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </CardContent>
    </Card>
  )
}
