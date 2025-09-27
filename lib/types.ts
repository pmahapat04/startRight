export interface User {
  id: string;
  email: string;
  name?: string;
  centers: Center[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Center {
  id: string;
  userId: string;
  name: string;
  type: 'Center' | 'Family' | 'Group Home';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  agesServed: string[];
  status: 'planning' | 'pre-application' | 'application' | 'post-licensing' | 'licensed';
  tasks: TaskState[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskState {
  id: string;
  centerId: string;
  taskKey: string;
  status: 'to-do' | 'in-progress' | 'done';
  dueDate?: Date;
  evidenceIds: string[];
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  centerId: string;
  name: string;
  url: string;
  type: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx';
  tags: string[];
  validFrom?: Date;
  validTo?: Date;
  uploadedAt: Date;
  taskKey?: string;
}

export interface ProgramMatch {
  id: string;
  centerId: string;
  programKey: string;
  eligibility: 'eligible' | 'likely' | 'not-eligible';
  rationale: string;
  nextSteps: string[];
  createdAt: Date;
}

export interface LicensingTask {
  key: string;
  title: string;
  description: string;
  why: string;
  how: string;
  dependencies: string[];
  evidenceRequirements: string[];
  estimatedDays: number;
  category: 'pre-application' | 'facility' | 'staff' | 'application' | 'post-licensing' | 'gsq';
}

export interface Program {
  key: string;
  name: string;
  description: string;
  requirements: string[];
  benefits: string[];
  eligibilityCriteria: {
    servesFood: boolean;
    wantsCoaching: boolean;
    staffRegistryStatus: boolean;
    centerType: string[];
  };
  applicationProcess: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface AIResponse {
  answer: string;
  sources: string[];
  confidence: number;
}
