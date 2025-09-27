-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  center_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'jpg', 'png', 'doc', 'docx')),
  tags TEXT[] DEFAULT '{}',
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  task_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create centers table
CREATE TABLE centers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Center', 'Family', 'Group Home')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  ages_served TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'pre-application', 'application', 'post-licensing', 'licensed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_states table
CREATE TABLE task_states (
  id TEXT PRIMARY KEY,
  center_id TEXT NOT NULL,
  task_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'to-do' CHECK (status IN ('to-do', 'in-progress', 'done')),
  due_date TIMESTAMP WITH TIME ZONE,
  evidence_ids TEXT[] DEFAULT '{}',
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create program_matches table
CREATE TABLE program_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  center_id TEXT NOT NULL,
  program_key TEXT NOT NULL,
  eligibility TEXT NOT NULL CHECK (eligibility IN ('eligible', 'likely', 'not-eligible')),
  rationale TEXT NOT NULL,
  next_steps TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_documents_center_id ON documents(center_id);
CREATE INDEX idx_task_states_center_id ON task_states(center_id);
CREATE INDEX idx_task_states_task_key ON task_states(task_key);
CREATE INDEX idx_program_matches_center_id ON program_matches(center_id);
