import { createClient } from '@supabase/supabase-js'

// Use placeholder values for local development when Supabase isn't configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// File upload helper
export async function uploadFile(
  file: File, 
  centerId: string, 
  path: string = 'documents'
): Promise<{ data: any; error: any }> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${path}/${centerId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (error) {
    return { data: null, error }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)

  return { data: { ...data, publicUrl: urlData.publicUrl }, error: null }
}

// Save document record to database
export async function saveDocument(
  document: {
    centerId: string
    name: string
    url: string
    type: string
    tags: string[]
    taskKey?: string
  }
) {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()

  return { data, error }
}

// Get documents for a center
export async function getDocuments(centerId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('centerId', centerId)
    .order('uploadedAt', { ascending: false })

  return { data, error }
}

// Delete document
export async function deleteDocument(documentId: string) {
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  return { data, error }
}
