# AI-Powered Contact & Forms System

📍 **Full Documentation:** [ROADMAP.md Section 3.1](../../ROADMAP.md#31-ai-powered-contact--forms-system)

## Overview

Transform static forms into intelligent, conversational experiences powered by Claude using LangChain + LangGraph.

**Estimated Effort:**
- Phase A (Basic Contact Form): 2 days
- Phase B (AI Integration): 5-7 days
**Total:** 7-9 days

## Why AI-Powered Forms?

- **Better UX:** Natural conversation vs rigid forms
- **Smart Field Extraction:** AI pulls data from casual messages
- **Intent Classification:** Route inquiries appropriately
- **Follow-up Questions:** Context-aware clarifications
- **Showcase Skills:** Demonstrates AI/LLM integration

## Tech Stack

### AI & LLM
- **LangChain** - LLM orchestration framework
- **LangGraph** - State machine for multi-turn conversations
- **LangSmith** - Observability, tracing, and debugging for LLM apps
- **Anthropic Claude 3.5 Sonnet** - Primary language model
- **Zod** - Schema validation for extracted fields

### Vector Database & Embeddings
- **pgVector** - PostgreSQL extension for vector similarity search
- **Embedding Providers:**
  - OpenAI (`text-embedding-3-small`, `text-embedding-3-large`)
  - Cohere (`embed-english-v3.0`, `embed-multilingual-v3.0`)
  - Anthropic Claude (via Voyage AI)
  - Google Gemini (Vertex AI `textembedding-gecko`)
  - Local Models (Sentence Transformers, all-MiniLM-L6-v2)

### Retrieval & Ranking
- **LangChain Retrievers** - Semantic search, hybrid search, multi-query
- **Ranking Models:**
  - Cohere Rerank (`rerank-english-v3.0`)
  - Cross-encoders (local)
  - LangChain ContextualCompressionRetriever

### Infrastructure
- **Strapi v5** - Headless CMS with PostgreSQL + pgVector
- **PostgreSQL 16+** - Database with pgVector extension
- **SendGrid/Resend** - Email delivery
- **reCAPTCHA v3** - Spam protection

## Architecture

### High-Level AI Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SUBMISSION                              │
│  (Contact, Feedback, Testimonial, Bug Report, Feature Request, etc) │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      SPAM PROTECTION                                 │
│  • reCAPTCHA v3 Score Check (>0.5 threshold)                        │
│  • Rate Limiting (Redis)                                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    LANGGRAPH STATE MACHINE                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. IntentClassifierAgent                                     │  │
│  │     → Classify: contact | project | feedback | testimonial   │  │
│  │                | bug | feature | collaboration | music        │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                           │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │  2. EasterEggDetectorAgent (Optional)                         │  │
│  │     → Detect hidden keywords, patterns, jokes                 │  │
│  │     → Unlock special responses or badges                      │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                           │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │  3. FieldExtractionAgent                                      │  │
│  │     → Extract structured data (name, email, message, etc.)    │  │
│  │     → Use intent-specific schemas                             │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                           │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │  4. ValidationAgent                                            │  │
│  │     → Check required fields with Zod                          │  │
│  │     → Missing fields? → FollowUpAgent                         │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                           │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │  5. SummarizationAgent                                         │  │
│  │     → Generate AI summary (50-150 words)                      │  │
│  │     → Sentiment analysis (positive/neutral/negative)          │  │
│  │     → Extract key topics and tags                             │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                           │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │  6. AutoResponseAgent (Optional)                               │  │
│  │     → Generate personalized auto-reply                        │  │
│  │     → Context-aware based on intent & sentiment               │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  LANGSMITH OBSERVABILITY                             │
│  • Trace full conversation flow                                      │
│  • Log intent classification accuracy                                │
│  • Monitor field extraction quality                                  │
│  • Track latency and token usage                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  STRAPI v5 STORAGE                                   │
│  • Store structured submission data                                  │
│  • Save AI summary and sentiment                                     │
│  • Record Easter egg info (if detected)                              │
│  • Store metadata (timestamp, user agent, etc.)                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              EMBEDDING GENERATION (Async Job)                        │
│  • Generate embeddings for:                                          │
│    - Original message text                                           │
│    - AI-generated summary                                            │
│    - Combined text (message + context)                               │
│                                                                       │
│  • Embedding Provider (choose one):                                  │
│    - OpenAI (text-embedding-3-small: 1536 dims, fast, cheap)       │
│    - Cohere (embed-english-v3.0: 1024 dims, multilingual)          │
│    - Voyage AI (voyage-2: 1024 dims, Claude-optimized)             │
│    - Gemini (textembedding-gecko: 768 dims, free tier)             │
│    - Local (all-MiniLM-L6-v2: 384 dims, free, offline)             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PGVECTOR STORAGE                                   │
│  • Store embeddings in PostgreSQL with pgVector extension            │
│  • Create vector index (HNSW or IVFFlat)                            │
│  • Store metadata for filtering:                                     │
│    - formType (contact, feedback, testimonial, etc.)                │
│    - sentiment (positive, neutral, negative)                         │
│    - timestamp, tags, userId, sessionId                              │
│    - easterEggDetected (boolean)                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│            RETRIEVAL & RANKING (Query Time)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Use Cases:                                                   │  │
│  │  1. Semantic Search - Find similar feedback/bug reports      │  │
│  │  2. RAG - Provide context to AI for follow-up responses      │  │
│  │  3. Analytics - Group similar submissions, detect patterns   │  │
│  │  4. Deduplication - Identify duplicate bug reports/features  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Retrieval Pipeline:                                          │  │
│  │                                                                │  │
│  │  Query → Generate Query Embedding                             │  │
│  │            ↓                                                   │  │
│  │  pgVector Similarity Search (cosine distance <-> 0.3)        │  │
│  │            ↓                                                   │  │
│  │  Apply Metadata Filters (formType, sentiment, dateRange)     │  │
│  │            ↓                                                   │  │
│  │  Fetch Top K candidates (k=20-50)                            │  │
│  │            ↓                                                   │  │
│  │  Rerank with LangChain ContextualCompressionRetriever        │  │
│  │    • Cohere Rerank API (rerank-english-v3.0)                 │  │
│  │    • Cross-encoder models (local)                            │  │
│  │            ↓                                                   │  │
│  │  Return Top N results (n=5-10)                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Simplified Conversation Flow

```
User Message
    ↓
[reCAPTCHA + Rate Limit Check]
    ↓
IntentClassifierAgent → Intent Classification
    ↓
EasterEggDetectorAgent → Optional Easter Egg Detection
    ↓
FieldExtractionAgent → Extract structured data
    ↓
ValidationAgent → Check required fields
    ↓
[Missing fields?] → FollowUpAgent → Ask clarifying questions
    ↓
SummarizationAgent → Generate AI summary + sentiment
    ↓
AutoResponseAgent → Optional personalized reply
    ↓
[Store in Strapi] → Email notification → [Log to LangSmith]
    ↓
[Async] Generate embeddings → Store in pgVector
    ↓
[Available for] Semantic search, RAG, Analytics
```

## Implementation

### Phase A: Basic Contact Form (2 days)

```tsx
// components/ContactForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span className="error">{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input {...register('subject')} placeholder="Subject" />
      <textarea {...register('message')} placeholder="Message" rows={5} />

      <button type="submit">Send Message</button>
    </form>
  );
}
```

---

### Phase B: AI Integration with LangChain (5-7 days)

#### 1. LangGraph State Machine (2 days)

```typescript
// lib/langchain/formStateMachine.ts
import { StateGraph } from 'langgraph';
import { ChatAnthropic } from '@langchain/anthropic';

interface FormState {
  intent: 'contact' | 'project' | 'career' | 'general';
  extractedFields: Record<string, any>;
  conversationHistory: Message[];
  currentStep: string;
  completionStatus: 'gathering' | 'confirming' | 'complete';
  missingFields: string[];
}

// Initialize Claude
const model = new ChatAnthropic({
  modelName: 'claude-3-5-sonnet-20240229',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

// Define state graph
const workflow = new StateGraph<FormState>({
  channels: {
    intent: null,
    extractedFields: null,
    conversationHistory: null,
    currentStep: null,
    completionStatus: null,
    missingFields: null,
  },
});

// Add nodes
workflow.addNode('classifier', classifyIntent);
workflow.addNode('extractor', extractFields);
workflow.addNode('validator', validateFields);
workflow.addNode('followUp', askFollowUp);
workflow.addNode('summary', summarize);
workflow.addNode('submit', submitForm);

// Define edges
workflow.addEdge('classifier', 'extractor');
workflow.addConditionalEdges('validator', routeBasedOnMissingFields);
workflow.addEdge('followUp', 'extractor');
workflow.addEdge('summary', 'submit');

// Compile
const app = workflow.compile();
```

#### 2. Intent Classifier Agent (1 day)

```typescript
// lib/langchain/agents/classifier.ts
import { PromptTemplate } from '@langchain/core/prompts';

const classifierPrompt = PromptTemplate.fromTemplate(`
Classify the following user message into one of these categories:
- contact: General inquiry or question
- project: Project proposal or collaboration request
- career: Job opportunity or career-related
- general: Other or unclear

User message: {message}

Respond with just the category name.
`);

export async function classifyIntent(state: FormState): Promise<Partial<FormState>> {
  const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];

  const chain = classifierPrompt.pipe(model);
  const result = await chain.invoke({ message: lastMessage.content });

  return {
    intent: result.content as FormState['intent'],
  };
}
```

#### 3. Field Extraction Agent (2 days)

```typescript
// lib/langchain/agents/extractor.ts
import { z } from 'zod';

const contactFieldsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(), // For project inquiries
  timeline: z.string().optional(),
  companyName: z.string().optional(),
});

const extractorPrompt = PromptTemplate.fromTemplate(`
Extract structured information from this conversation.

Conversation history:
{conversation}

Latest message:
{message}

Extract the following fields if mentioned: name, email, subject, message, budget, timeline, companyName

Return JSON only, with null for fields not found.
`);

export async function extractFields(state: FormState): Promise<Partial<FormState>> {
  const conversation = state.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');
  const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];

  const chain = extractorPrompt.pipe(model).pipe(new JsonOutputParser());
  const extracted = await chain.invoke({
    conversation,
    message: lastMessage.content,
  });

  // Validate with Zod
  const validated = contactFieldsSchema.parse(extracted);

  return {
    extractedFields: {
      ...state.extractedFields,
      ...validated,
    },
  };
}
```

#### 4. Conversational UI Component (1-2 days)

```tsx
// components/AIContactForm.tsx
import { useState } from 'react';
import { useChat } from 'ai/react';

export function AIContactForm() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai-contact',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg p-6 h-[500px] overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-400 text-sm">
            Claude is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Tell me about your project or inquiry..."
          className="flex-1 px-4 py-2 bg-gray-800 rounded-lg"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>

      <button
        onClick={() => setSwitchToTraditional(true)}
        className="mt-4 text-sm text-gray-400 hover:text-gray-300"
      >
        Prefer a traditional form?
      </button>
    </div>
  );
}
```

#### 5. API Route (1 day)

```typescript
// pages/api/ai-contact.ts
import { StreamingTextResponse, LangChainStream } from 'ai';
import { formStateMachine } from '@/lib/langchain/formStateMachine';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  // Run LangGraph state machine
  const state = await formStateMachine.invoke({
    conversationHistory: messages,
    extractedFields: {},
    completionStatus: 'gathering',
  }, {
    callbacks: [handlers],
  });

  return new StreamingTextResponse(stream);
}
```

## Use Cases

### 1. Project Inquiry Assistant
```
User: "I need help building an e-commerce site"
AI: "Great! I'd love to help. What kind of products will you be selling?"
User: "Handmade jewelry"
AI: "Awesome! Do you have a budget and timeline in mind?"
User: "Around $5k, need it in 2 months"
AI: "Perfect! And your email so I can send you a detailed proposal?"
→ Extracts: project_type, budget, timeline, contact info
```

### 2. Career Collaboration
```
User: "Interested in a senior React position?"
AI: "Thanks for reaching out! Could you share more about the role?"
User: "Remote, $150k, building design systems"
AI: "Sounds interesting! Can you send the full JD to john@example.com?"
→ Extracts: opportunity_type, compensation, skills_needed, contact
```

### 3. Portfolio Feedback Form 💬
**Goal:** Collect constructive feedback on the portfolio from visitors

**AI Conversation Flow:**
```
User: "The animations are really smooth!"
AI: "Thank you! I appreciate that. What aspects of the portfolio did you find most engaging?"
User: "The Three.js scene and the atmospheric transitions"
AI: "Great! Is there anything you think could be improved?"
User: "Maybe add a dark mode toggle?"
AI: "That's excellent feedback! On a scale of 1-10, how would you rate your overall experience?"
User: "8/10"
AI: "Thanks! Would you like to leave your email so I can notify you when dark mode is implemented?"
→ Extracts: positive_feedback, improvement_suggestions, rating, features_liked, email (optional)
```

**Schema:**
```typescript
const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  rating: z.number().min(1).max(10),
  positiveFeedback: z.string(),
  improvementSuggestions: z.string().optional(),
  featuresLiked: z.array(z.string()).optional(),
  pageVisited: z.string(), // Auto-detected from URL
  userAgent: z.string(), // Auto-detected
  timestamp: z.date().default(() => new Date()),
});
```

**AI Agent Behavior:**
- Encourage positive feedback first (builds rapport)
- Gently ask for improvements (non-confrontational)
- Request rating naturally in conversation
- Make email optional (reduce friction)
- Track which page they're providing feedback on

**Storage:**
- Save to Strapi `Feedback` collection
- Display on admin dashboard
- Aggregate ratings for analytics
- Track improvement suggestions by frequency

---

### 4. Testimonial Submission Form ⭐
**Goal:** Gather testimonials from clients, colleagues, or users

**AI Conversation Flow:**
```
User: "I worked with you on the XYZ project"
AI: "Great to hear from you! How was your experience working together?"
User: "It was fantastic. You delivered everything on time and the code quality was excellent."
AI: "Thank you so much! What would you say was the most valuable aspect of our collaboration?"
User: "Your attention to detail and clear communication"
AI: "I really appreciate that! Would you be comfortable having this testimonial displayed on my portfolio?"
User: "Yes, absolutely"
AI: "Perfect! May I include your name and company/role?"
User: "Sure, I'm Jane Smith, CTO at TechCorp"
AI: "Wonderful! Would you like to add a profile photo or LinkedIn URL?"
→ Extracts: testimonial_text, author_name, author_role, company, linkedin_url, photo, permission_granted
```

**Schema:**
```typescript
const testimonialSchema = z.object({
  testimonialText: z.string().min(20).max(500),
  authorName: z.string().min(2),
  authorRole: z.string(), // e.g., "CTO", "Frontend Developer"
  companyName: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  email: z.string().email(),
  relationship: z.enum(['client', 'colleague', 'manager', 'other']),
  projectName: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  permissionToPublish: z.boolean().default(false),
  featured: z.boolean().default(false), // Admin sets this
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  submittedAt: z.date().default(() => new Date()),
});
```

**AI Agent Behavior:**
- Start with appreciation and gratitude
- Ask open-ended questions to get detailed responses
- Request specific examples ("What stood out?")
- Always ask for explicit permission to publish
- Offer to anonymize if they prefer
- Suggest adding LinkedIn for credibility

**Approval Workflow:**
1. Testimonial submitted → Status: `pending`
2. Admin reviews in Strapi dashboard
3. Admin can:
   - Approve (status: `approved`, published on site)
   - Request edits (AI follows up with user)
   - Reject (status: `rejected`, not published)
4. Optional: Send thank-you email after approval

**Display:**
```tsx
// Show on TestimonialsSection
<TestimonialCard
  text={testimonial.testimonialText}
  author={testimonial.authorName}
  role={testimonial.authorRole}
  company={testimonial.companyName}
  photo={testimonial.photoUrl}
  rating={testimonial.rating}
/>
```

---

### 5. Bug Report Form 🐛
**Goal:** Allow users to report issues they encounter on the portfolio

**AI Conversation Flow:**
```
User: "The contact form isn't working"
AI: "I'm sorry to hear that! Let me help you report this. What exactly happens when you try to submit the form?"
User: "I click submit and nothing happens"
AI: "Thanks for the details. Which browser are you using?"
User: "Chrome on Mac"
AI: "Got it. Did you see any error messages, or did the page just not respond?"
User: "No error, just nothing happens"
AI: "That's helpful. Can I get your email to follow up when this is fixed?"
→ Extracts: bug_description, steps_to_reproduce, browser, os, expected_behavior, actual_behavior, email
```

**Schema:**
```typescript
const bugReportSchema = z.object({
  title: z.string().min(5), // Auto-generated from description
  description: z.string().min(20),
  stepsToReproduce: z.string(),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string(),
  browser: z.string(),
  browserVersion: z.string().optional(),
  os: z.string(),
  device: z.enum(['desktop', 'tablet', 'mobile']),
  pageUrl: z.string().url(), // Auto-detected
  screenshotUrl: z.string().url().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['open', 'in-progress', 'resolved', 'wontfix']).default('open'),
  reporterEmail: z.string().email().optional(),
  userAgent: z.string(), // Auto-detected
  timestamp: z.date().default(() => new Date()),
});
```

**AI Agent Behavior:**
- Show empathy for frustration
- Ask diagnostic questions (browser, steps, errors)
- Auto-detect page URL, user agent, device type
- Suggest screenshot upload (optional)
- Offer workaround if known issue
- Thank user for reporting

**Integration:**
- Create GitHub issue automatically (via GitHub API)
- Store in Strapi for tracking
- Send notification to admin
- Follow up when resolved

---

### 6. Feature Request Form 💡
**Goal:** Gather ideas for new features or improvements

**AI Conversation Flow:**
```
User: "Would be cool to have a dark mode"
AI: "That's a great suggestion! Dark mode is popular. How would you envision it working?"
User: "Maybe a toggle in the toolbar that switches the whole theme"
AI: "I like that! Would you prefer it to remember your preference across visits?"
User: "Yeah, that would be perfect"
AI: "Awesome! Is there a specific reason you'd use dark mode? (e.g., eye strain, aesthetics)"
User: "I browse late at night, so easier on the eyes"
AI: "Makes total sense. Would you like to be notified when dark mode is implemented?"
→ Extracts: feature_title, description, use_case, priority (inferred), email
```

**Schema:**
```typescript
const featureRequestSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  useCase: z.string(), // Why they want this feature
  problemSolved: z.string().optional(),
  suggestedImplementation: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.enum(['ui', 'content', 'performance', 'accessibility', 'other']),
  votes: z.number().default(1), // User automatically votes for their own request
  status: z.enum(['submitted', 'under-review', 'planned', 'in-progress', 'completed', 'rejected']).default('submitted'),
  requesterEmail: z.string().email().optional(),
  notifyOnImplementation: z.boolean().default(false),
  timestamp: z.date().default(() => new Date()),
});
```

**AI Agent Behavior:**
- Encourage elaboration on the idea
- Ask "why" to understand use case
- Explore edge cases conversationally
- Gauge urgency/importance
- Offer to notify when implemented
- Thank for contributing ideas

**Feature Voting Board:**
```tsx
// Display feature requests publicly
<FeatureRequestBoard>
  {requests.map(request => (
    <FeatureCard
      title={request.title}
      description={request.description}
      votes={request.votes}
      status={request.status}
      onVote={() => voteForFeature(request.id)}
    />
  ))}
</FeatureRequestBoard>
```

**Gamification:**
- Users can upvote existing requests
- Show most-requested features
- Badge for "Top Contributor"
- Notify all voters when feature ships

---

### 7. Collaboration/Partnership Form 🤝
**Goal:** Handle partnership, speaking, and collaboration inquiries

**AI Conversation Flow:**
```
User: "We're organizing a React conference and would love to have you speak"
AI: "That sounds exciting! I'd love to hear more. When and where is the conference?"
User: "June 2025 in San Francisco"
AI: "Great! What topic were you thinking I could speak about?"
User: "Advanced animation techniques with GSAP and Three.js"
AI: "Perfect fit! What's the expected audience size and format (keynote, workshop, panel)?"
User: "About 500 attendees, 45-minute talk"
AI: "Sounds good! What's the compensation structure, or is this a community event?"
User: "We cover travel and offer $2k honorarium"
AI: "Excellent. What's the best email to send my speaker info and availability?"
→ Extracts: opportunity_type, event_name, date, location, topic, format, audience_size, compensation, contact
```

**Schema:**
```typescript
const collaborationSchema = z.object({
  opportunityType: z.enum(['speaking', 'podcast', 'interview', 'partnership', 'guest-post', 'other']),
  organizationName: z.string(),
  contactName: z.string(),
  contactEmail: z.string().email(),
  eventName: z.string().optional(), // For speaking engagements
  proposedDate: z.string().optional(),
  location: z.string().optional(), // "San Francisco" or "Remote"
  topic: z.string().optional(),
  format: z.string().optional(), // "Keynote", "Workshop", "Podcast Interview"
  audienceSize: z.string().optional(),
  duration: z.string().optional(), // "45 minutes", "2 hours"
  compensation: z.string().optional(),
  travelCovered: z.boolean().optional(),
  additionalDetails: z.string(),
  websiteUrl: z.string().url().optional(),
  deadline: z.string().optional(), // "Need response by..."
  status: z.enum(['new', 'interested', 'negotiating', 'confirmed', 'declined']).default('new'),
  timestamp: z.date().default(() => new Date()),
});
```

**AI Agent Behavior:**
- Professional and enthusiastic tone
- Ask logistical questions (dates, format, compensation)
- Clarify expectations upfront
- Request relevant details based on opportunity type
- Offer to send portfolio/media kit
- Set clear next steps

**Automated Actions:**
- Add to calendar (tentative) if date provided
- Send auto-reply with availability
- Create Notion/Trello card for tracking
- Flag high-priority opportunities

---

### 8. Music Feedback Form 🎵
**Goal:** Gather feedback specifically on music compositions

**AI Conversation Flow:**
```
User: "Just listened to your track 'Neon Dreams'"
AI: "Thanks for listening! What did you think?"
User: "The melody is beautiful, but I think the bass could be punchier"
AI: "Appreciate the feedback! What genre or style were you comparing it to in your mind?"
User: "Like synthwave or outrun vibes"
AI: "Got it! Was there a specific moment in the track where you felt the bass was lacking?"
User: "Around the 1:30 mark when the drop happens"
AI: "Super helpful! On a scale of 1-10, how would you rate the track overall?"
User: "I'd say 7/10, definitely has potential"
AI: "Thank you! Would you listen to more if I released similar tracks?"
→ Extracts: track_name, rating, positive_aspects, improvement_areas, genre_preference, timestamp_feedback, would_listen_again
```

**Schema:**
```typescript
const musicFeedbackSchema = z.object({
  compositionId: z.string(), // Links to Strapi Composition
  compositionTitle: z.string(),
  rating: z.number().min(1).max(10),
  positiveFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
  favoriteSection: z.string().optional(), // "Intro", "Drop at 1:30", "Outro"
  genreComparison: z.string().optional(),
  mood: z.enum(['energetic', 'calm', 'dark', 'uplifting', 'emotional', 'other']).optional(),
  wouldListenAgain: z.boolean(),
  wouldShare: z.boolean().optional(),
  listenCount: z.number().default(1),
  listenerEmail: z.string().email().optional(),
  timestamp: z.date().default(() => new Date()),
});
```

**Display:**
- Aggregate ratings per composition
- Show average rating on music player
- Display top-rated tracks
- Use feedback to improve future compositions

---

## Updated Timeline with All Forms

| Phase | Task | Duration |
|-------|------|----------|
| A | Basic Forms (Contact, Feedback, Testimonial, Bug, Feature, Collab, Music) | 3-4 days |
| B.1 | LangGraph State Machine (Multi-Intent) | 3 days |
| B.2 | Intent Classifier (8 intents) | 1-2 days |
| B.3 | Field Extractors (per form type) | 3-4 days |
| B.4 | Conversational UI (Unified) | 2 days |
| B.5 | API Routes & Integrations | 2 days |
| B.6 | Admin Dashboard (Review/Approve) | 2-3 days |

**Total:** 16-20 days (comprehensive implementation)

---

## Multi-Intent Classification

Update classifier to handle all form types:

```typescript
const classifierPrompt = PromptTemplate.fromTemplate(`
Classify the user message into ONE of these categories:

- **contact**: General inquiry or question
- **project**: Project proposal or collaboration request
- **career**: Job opportunity or career-related
- **feedback**: Feedback about the portfolio website
- **testimonial**: Wants to provide a testimonial/review
- **bug**: Reporting a technical issue or bug
- **feature**: Suggesting a new feature or improvement
- **collaboration**: Speaking, podcast, partnership opportunity
- **music-feedback**: Feedback about a specific music composition

User message: {message}

Respond with just the category name.
`);
```

## Timeline

| Phase | Task | Duration |
|-------|------|----------|
| A | Basic Contact Form | 2 days |
| B.1 | LangGraph State Machine | 2 days |
| B.2 | Intent Classifier | 1 day |
| B.3 | Field Extractor | 2 days |
| B.4 | Conversational UI | 1-2 days |
| B.5 | API Route & Integration | 1 day |

**Total:** 7-9 days

## Form Types Summary

| Form Type | Intent | Primary Use | Effort | Storage |
|-----------|--------|-------------|--------|---------|
| **Contact** | General inquiries | Communication | 2 days | Strapi Contact |
| **Project Inquiry** | Project proposals | Business dev | Included | Strapi Project Leads |
| **Career** | Job opportunities | Hiring | Included | Strapi Career Leads |
| **Feedback** 💬 | Portfolio feedback | Improvement | 1 day | Strapi Feedback |
| **Testimonial** ⭐ | Client reviews | Social proof | 1-2 days | Strapi Testimonials |
| **Bug Report** 🐛 | Issue reporting | Quality | 1 day | Strapi + GitHub Issues |
| **Feature Request** 💡 | New ideas | Roadmap | 1 day | Strapi Feature Requests |
| **Collaboration** 🤝 | Speaking/partnerships | Opportunities | 1 day | Strapi Collaborations |
| **Music Feedback** 🎵 | Track reviews | Music improvement | 1 day | Strapi Music Feedback |

**Total Forms:** 9 intelligent conversational forms

---

## Strapi Content Types Needed

```typescript
// apps/cms/src/api/

1. contact-submissions/         // General contact
2. project-leads/               // Project inquiries
3. career-leads/                // Job opportunities
4. feedback/                    // Portfolio feedback
5. testimonials/                // Client testimonials (with approval workflow)
6. bug-reports/                 // Bug tracking
7. feature-requests/            // Feature ideas (with voting)
8. collaborations/              // Speaking/partnership
9. music-feedback/              // Track-specific feedback
```

---

## Admin Dashboard Features

### Feedback Analytics Dashboard
```tsx
<Dashboard>
  <FeedbackOverview>
    <AverageRating value={8.2} />
    <TotalResponses value={247} />
    <TopSuggestions items={['Dark mode', 'Mobile nav', 'Blog search']} />
  </FeedbackOverview>

  <TestimonialQueue>
    <PendingTestimonials count={5} />
    <ApprovedTestimonials count={23} />
  </TestimonialQueue>

  <BugReports>
    <OpenIssues count={3} />
    <InProgress count={2} />
    <Resolved count={18} />
  </BugReports>

  <FeatureVoting>
    <TopRequests items={[
      { title: 'Dark mode', votes: 34 },
      { title: 'RSS feed', votes: 21 },
      { title: 'Search', votes: 18 }
    ]} />
  </FeatureVoting>
</Dashboard>
```

### Testimonial Approval Workflow
```tsx
<TestimonialReview testimonial={pending}>
  <Preview>
    <Text>{testimonial.testimonialText}</Text>
    <Author>{testimonial.authorName} - {testimonial.authorRole}</Author>
    <Rating value={testimonial.rating} />
  </Preview>

  <Actions>
    <Button onClick={approve}>Approve & Publish</Button>
    <Button onClick={requestEdit}>Request Edit</Button>
    <Button onClick={reject}>Decline</Button>
  </Actions>
</TestimonialReview>
```

---

## Success Metrics

### Conversion Metrics
- **Conversion Rate:** AI chat vs traditional form (target: +30%)
- **Field Completion:** Percentage of fully completed forms (target: >85%)
- **User Satisfaction:** Average rating from feedback forms (target: >8/10)
- **Intent Accuracy:** Classifier performance (target: >95%)

### Form-Specific Metrics
- **Testimonials:** Approval rate, average rating
- **Feedback:** Response rate, implementation rate of suggestions
- **Bug Reports:** Time to resolution, severity distribution
- **Feature Requests:** Voting participation, implementation rate
- **Music Feedback:** Average track ratings, improvement trends

### Business Impact
- **Lead Quality:** Project inquiry → conversion rate
- **Collaboration ROI:** Speaking engagement bookings
- **User Engagement:** Return visitor rate after feedback submission

---

## Integration Examples

### Bug Report → GitHub Issue
```typescript
async function createGitHubIssue(bugReport: BugReport) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  await octokit.rest.issues.create({
    owner: 'yourusername',
    repo: 'portfolio',
    title: `[Bug] ${bugReport.title}`,
    body: `
**Reported by:** ${bugReport.reporterEmail || 'Anonymous'}
**Browser:** ${bugReport.browser} (${bugReport.os})
**Page:** ${bugReport.pageUrl}

**Description:**
${bugReport.description}

**Steps to Reproduce:**
${bugReport.stepsToReproduce}

**Expected:**
${bugReport.expectedBehavior}

**Actual:**
${bugReport.actualBehavior}

---
*Submitted via AI-powered bug report form*
    `,
    labels: ['bug', 'user-reported', `severity:${bugReport.severity}`],
  });
}
```

### Feature Request → Notion Board
```typescript
async function addToNotionRoadmap(featureRequest: FeatureRequest) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  await notion.pages.create({
    parent: { database_id: process.env.NOTION_ROADMAP_DB },
    properties: {
      Name: { title: [{ text: { content: featureRequest.title } }] },
      Description: { rich_text: [{ text: { content: featureRequest.description } }] },
      Votes: { number: featureRequest.votes },
      Priority: { select: { name: featureRequest.priority } },
      Status: { select: { name: 'Submitted' } },
      Category: { select: { name: featureRequest.category } },
    },
  });
}
```

---

## Next Steps

### Phase A: Basic Forms (3-4 days)
1. ✅ Create all 9 Strapi content types
2. ✅ Build traditional forms as fallback
3. ✅ Set up email notifications
4. ✅ Create admin dashboard views

### Phase B: AI Integration (12-16 days)
1. ✅ Set up Anthropic API key
2. ✅ Build multi-intent LangGraph state machine
3. ✅ Implement field extractors for each form type
4. ✅ Create unified conversational UI
5. ✅ Build approval workflows (testimonials)
6. ✅ Integrate with external services (GitHub, Notion)
7. ✅ A/B test AI vs traditional forms

### Phase C: Enhancements (Optional, 3-5 days)
1. Add voice input (Web Speech API)
2. Multi-language support
3. File upload support (screenshots for bugs, photos for testimonials)
4. Smart follow-up emails
5. Analytics dashboard with charts

---

**Related Documentation:**
- [ROADMAP.md - Full AI Forms Implementation](../../ROADMAP.md#31-ai-powered-contact--forms-system)
- [Machine Learning Features](./machine-learning.md) - RAG chatbot
- [Logging & Monitoring](./logging-monitoring.md) - Track form submissions
