# StartRight - Michigan Childcare Licensing Assistant

A comprehensive web application that helps beginners open a childcare center in Michigan by guiding them through the licensing process and program enrollment.

## Features

### 🎯 Core Features (MVP)

1. **Onboarding Wizard**
   - Collects business type (Center/Family/Group Home)
   - Captures address, capacity, and ages served
   - Stores user profile information

2. **Dashboard**
   - Progress bar showing licensing steps completion
   - "Next Best Action" banner with recommended tasks
   - Quick shortcuts to Checklist, Upload Docs, Programs, and AI Helper

3. **Michigan Licensing Checklist**
   - Pre-seeded JSON configuration for Michigan centers
   - Task dependencies and unlocking system
   - Evidence requirements tracking
   - Status management (to-do/in-progress/done)
   - Document attachment and notes

4. **Document Vault**
   - Upload PDF/JPG/PNG documents
   - Tag uploads to specific task requirements
   - Search and filter functionality
   - Evidence tracking integration

5. **Program Matcher**
   - Great Start to Quality eligibility assessment
   - CACFP (Child and Adult Care Food Program) matching
   - Eligibility scoring (Eligible/Likely/Not Eligible)
   - Plain-English next steps and contact information

6. **AI Helper**
   - Sidebar chat interface
   - Seeded with Michigan childcare licensing knowledge
   - Handles queries like "What's next?", "How do I get a fire inspection?"
   - OpenAI API integration for intelligent responses

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (auth, Postgres, storage)
- **AI**: OpenAI API (embeddings + LLM)
- **Deploy**: Vercel + Supabase

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd startRight
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Models

### User
- `id`: string
- `email`: string
- `centers`: Center[]

### Center
- `id`: string
- `userId`: string
- `name`: string
- `type`: 'Center' | 'Family' | 'Group Home'
- `address`: string
- `city`: string
- `state`: string
- `zipCode`: string
- `capacity`: number
- `agesServed`: string[]
- `status`: 'planning' | 'pre-application' | 'application' | 'post-licensing' | 'licensed'
- `tasks`: TaskState[]
- `documents`: Document[]

### TaskState
- `id`: string
- `centerId`: string
- `taskKey`: string
- `status`: 'to-do' | 'in-progress' | 'done'
- `dueDate`: Date?
- `evidenceIds`: string[]
- `notes`: string?

### Document
- `id`: string
- `centerId`: string
- `name`: string
- `url`: string
- `type`: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx'
- `tags`: string[]
- `validFrom`: Date?
- `validTo`: Date?

### ProgramMatch
- `id`: string
- `centerId`: string
- `programKey`: string
- `eligibility`: 'eligible' | 'likely' | 'not-eligible'
- `rationale`: string
- `nextSteps`: string[]

## Seed Data

The application includes comprehensive seed data:

- **Licensing Tasks**: 12 pre-configured tasks covering the complete Michigan licensing process
- **Programs**: 4 Michigan programs including Great Start to Quality, CACFP, Head Start Partnership, and Child Care Subsidy

## Features in Detail

### Onboarding Wizard
- 4-step guided process
- Validates required information
- Creates initial center profile
- Sets up task states

### Dashboard
- Real-time progress tracking
- Smart next action recommendations
- Quick access to all features
- Visual progress indicators

### Licensing Checklist
- Dependency-based task unlocking
- Evidence requirement tracking
- Status management
- Document attachment
- Notes and comments

### Document Vault
- Secure file upload
- Tag-based organization
- Search and filter
- Evidence linking
- File type validation

### Program Matcher
- Eligibility assessment
- Program-specific requirements
- Contact information
- Application guidance
- Benefits overview

### AI Helper
- Context-aware responses
- Michigan-specific knowledge
- Quick question templates
- Conversation history
- Source attribution

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations
3. Set up storage buckets for documents
4. Configure authentication providers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced AI capabilities
- [ ] Mobile app
- [ ] Integration with state systems
- [ ] Multi-state support
- [ ] Advanced analytics
- [ ] Community features
