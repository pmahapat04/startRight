'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Document, Center } from '@/lib/types'
import { Upload, FileText, Download, Trash2, Tag } from 'lucide-react'

interface DocumentVaultProps {
  center: Center
  documents: Document[]
  onUpload: (file: File, tags: string[], taskKey?: string) => void
  onDelete: (documentId: string) => void
}

export function DocumentVault({ center, documents, onUpload, onDelete }: DocumentVaultProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: '',
    tags: [] as string[],
    taskKey: '',
    file: null as File | null
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('')

  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)))
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !filterTag || doc.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadForm(prev => ({ ...prev, file, name: file.name }))
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
    if (!uploadForm.file) return

    setIsUploading(true)
    try {
      // In a real app, this would upload to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload
      
      onUpload(uploadForm.file, uploadForm.tags, uploadForm.taskKey || undefined)
      
      // Reset form
      setUploadForm({
        name: '',
        tags: [],
        taskKey: '',
        file: null
      })
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'jpg':
      case 'png':
        return <FileText className="h-8 w-8 text-green-500" />
      default:
        return <FileText className="h-8 w-8 text-blue-500" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Vault</h2>
          <p className="text-muted-foreground">
            Upload and organize your licensing documents
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {documents.length} documents
        </div>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
          <CardDescription>
            Upload documents and tag them for easy organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="mt-1"
            />
            {uploadForm.file && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              placeholder="Enter a descriptive name"
              value={uploadForm.name}
              onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

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
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!uploadForm.file || !uploadForm.name || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground">
                  Upload your first document to get started
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getFileIcon(document.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold">{document.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {document.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(document.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
