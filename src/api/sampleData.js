// Rich fallback and initial curated articles dataset
export const SAMPLE_ARTICLES = [
  {
    id: "local-1",
    source: "Chronicle Staff",
    title: "Building Scalable Frontends: Architecture Patterns for 2026 and Beyond",
    description: "Explore modern component patterns, micro-frontends, fine-grained reactivity, and server-driven UI architecture that power high-traffic applications.",
    category: "Architecture",
    tags: ["architecture", "frontend", "react", "performance"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. Elena Rostova",
      username: "erostova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Principal Frontend Architect",
      bio: "12+ years designing distributed frontend systems, core contributor to open-source UI toolkits."
    },
    publishedAt: "2026-10-18T14:30:00Z",
    readingTime: 6,
    likesCount: 342,
    commentsCount: 28,
    viewsCount: 4820,
    featured: true,
    trending: true,
    content: `
# Building Scalable Frontends: Architecture Patterns for 2026 and Beyond

Modern web applications have evolved far beyond simple documents. Today's web platforms rival native desktop applications in complexity, interactivity, and scale. When building systems meant to support millions of concurrent readers, frontend architecture decisions become paramount.

## 1. Fine-Grained Reactivity and Signals

One of the most consequential shifts in frontend engineering over recent years is the transition toward fine-grained reactivity. Rather than re-evaluating entire component subtrees whenever an update occurs, reactive primitives ensure that only the exact DOM node affected by a state transition updates.

\`\`\`javascript
// Conceptual Fine-Grained Reactive Primitive
const [articles, setArticles] = createSignal([]);
const filteredArticles = createMemo(() => 
  articles().filter(item => item.published)
);
\`\`\`

### Benefits:
- Eliminates unnecessary virtual DOM diffing cycles.
- Lowers memory footprint on constrained mobile viewports.
- Keeps input response latencies consistently under 16 milliseconds.

## 2. Dynamic Component Streaming & Selective Hydration

Instead of shipping a monolithic bundle where the browser must download, parse, and execute every single script before rendering, streaming architecture decouples content delivery:

- Critical shell components load and render instantly.
- Heavy computational blocks (such as interactive charts and rich comment trees) hydrate lazily upon scrolling into view.
- Images and secondary media adaptively load according to network bandwidth conditions.

## 3. The Cohesive Data Normalization Layer

When aggregating disparate endpoints—whether from microservices, third-party publishing APIs, or headless CMS platforms—a resilient client-side normalization layer guarantees UI consistency:

\`\`\`typescript
interface UnifiedArticle {
  id: string;
  source: string;
  title: string;
  category: string;
  readingTime: number;
  publishedAt: string;
}
\`\`\`

By enforcing a strict schema at the API ingestion boundary, the presentation tier remains decoupled from volatile backend schema changes.
    `
  },
  {
    id: "local-2",
    source: "Dev Insights",
    title: "Next-Generation UI/UX: The Science of Perceived Performance and Delight",
    description: "How psychological perception of speed, micro-interactions, and glassmorphic spatial depth transform user engagement in modern web applications.",
    category: "Design",
    tags: ["design", "uiux", "css", "animation"],
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Julian Vance",
      username: "julianvance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Head of Product Design",
      bio: "Specializing in spatial design systems, accessible typography, and cognitive load reduction."
    },
    publishedAt: "2026-10-21T09:15:00Z",
    readingTime: 5,
    likesCount: 289,
    commentsCount: 19,
    viewsCount: 3190,
    featured: false,
    trending: true,
    content: `
# Next-Generation UI/UX: The Science of Perceived Performance and Delight

Real performance and *perceived* performance are two very different metrics. An application that takes 800 milliseconds to fetch data can feel either frustratingly sluggish or remarkably instantaneous depending solely on how state transitions are visualized.

## The Power of Skeleton Screens Over Spinners

Traditional loading spinners draw user attention directly to the waiting period. In contrast, skeleton wireframes shift attention to the anticipated layout, creating the cognitive sensation that the application is already half-rendered.

> "A great user interface does not merely serve content; it guides human attention effortlessly through space and rhythm."

## Spatial Depth and Glassmorphism

Using multi-layered translucent surfaces with backdrop-filters creates clear visual hierarchy without heavy borders. In our Mantine design implementation:
- Cards gently float with subtle elevation on hover.
- Badges highlight categorized topics using balanced tonal saturation.
- Modals provide immersive depth without disconnecting the reader from context.
    `
  },
  {
    id: "local-3",
    source: "AI Frontiers",
    title: "Agentic AI in Production: Autonomous Workflows and LLM Orchestration",
    description: "A deep dive into building reliable multi-agent systems, context caching, tool-use verification, and deterministic guardrails.",
    category: "AI & ML",
    tags: ["ai", "agents", "python", "machinelearning"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Aria Chen",
      username: "ariachen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      role: "Lead AI Research Engineer",
      bio: "Building reasoning engines and autonomous agent architectures at the frontier of machine intelligence."
    },
    publishedAt: "2026-10-23T11:00:00Z",
    readingTime: 8,
    likesCount: 512,
    commentsCount: 45,
    viewsCount: 6410,
    featured: true,
    trending: true,
    content: `
# Agentic AI in Production: Autonomous Workflows and LLM Orchestration

The paradigm of artificial intelligence has moved rapidly from prompt-response dialogs toward autonomous agentic loops capable of reasoning, planning, validating, and interacting with real-world development environments.

## The Anatomy of an Agent Loop

1. **Observation**: Synthesizing contextual inputs from tools, user intent, and filesystem states.
2. **Deliberation**: Evaluating constraints, decomposing high-level objectives into sequential milestones.
3. **Action Execution**: Invoking deterministic external tools with structured parameters.
4. **Self-Correction**: Inspecting execution outputs and rectifying deviations before completion.

\`\`\`mermaid
graph LR
  User[User Intent] --> Planner[Agentic Planner]
  Planner --> Tools[Deterministic Tool Calls]
  Tools --> Feedback[Environment Feedback]
  Feedback --> Reflection[Self-Correction]
  Reflection --> Output[Polished Solution]
\`\`\`

## Context Optimization & Caching

Maintaining comprehensive trajectory memory without saturating token bandwidth requires dynamic context pruning. By separating ephemeral execution logs from persistent project summaries, reasoning agents sustain razor-sharp precision across extended multi-hour programming sessions.
    `
  },
  {
    id: "local-4",
    source: "DevOps Global",
    title: "Zero-Downtime Global Edge Deployments with Modern CDNs",
    description: "Strategies for routing traffic across multi-region serverless edges, distributed caching, and instant cache invalidation at scale.",
    category: "DevOps",
    tags: ["devops", "cloud", "docker", "edge"],
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Marcus Brody",
      username: "mbrody",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Cloud Infrastructure Specialist",
      bio: "Terraform evangelist, Kubernetes survivor, enthusiast of millisecond latencies."
    },
    publishedAt: "2026-10-15T16:45:00Z",
    readingTime: 7,
    likesCount: 198,
    commentsCount: 12,
    viewsCount: 2280,
    featured: false,
    trending: false,
    content: `
# Zero-Downtime Global Edge Deployments with Modern CDNs

In high-concurrency publishing environments, network latency often dominates total load time. Delivering content from centralized origins across continents introduces unavoidable round-trip delays.

## Edge Compute vs Origin Rendering

By moving cache validation and header processing directly to points-of-presence (PoPs) within 10ms of the end reader, Time-To-First-Byte (TTFB) drops from 400ms down to sub-30ms globally.

- **Stale-While-Revalidate**: Serve instant cached snapshots while background workers fetch fresh updates.
- **Micro-caching**: Caching dynamic responses for even 5 to 10 seconds shields origin databases during viral traffic spikes.
    `
  },
  {
    id: "local-5",
    source: "Tech Spectrum",
    title: "Mastering TypeScript 5.8: Type Gymnastics Made Pragmatic",
    description: "Practical type utilities, template literal types, conditional inference, and error branding that catch production bugs before runtime.",
    category: "Development",
    tags: ["typescript", "javascript", "webdev", "programming"],
    coverImage: "https://images.unsplash.com/photo-1516116211227-bbc13c744ef8?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Lin",
      username: "slin_code",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      role: "Senior Staff Engineer",
      bio: "TypeScript author and conference speaker dedicated to bulletproof type safety."
    },
    publishedAt: "2026-10-20T08:20:00Z",
    readingTime: 6,
    likesCount: 421,
    commentsCount: 33,
    viewsCount: 5120,
    featured: false,
    trending: true,
    content: `
# Mastering TypeScript: Type Gymnastics Made Pragmatic

Type systems exist to protect engineers against cognitive overload and unexpected null pointers. Yet, complex nested type gymnastics can sometimes hinder rather than help developer velocity if applied haphazardly.

## Pragmatic Brand Types

\`\`\`typescript
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

type ArticleId = Brand<string, 'ArticleId'>;
type UserId = Brand<string, 'UserId'>;

function getArticleById(id: ArticleId) {
  // Guarantees at compile time that an arbitrary string or UserId cannot be passed by mistake
}
\`\`\`

By introducing minimal compile-time branding, you prevent accidental parameter swaps with zero runtime overhead.
    `
  },
  {
    id: "local-6",
    source: "Web Performance Guild",
    title: "Web Core Vitals in 2026: INP, LCP, and Memory Leak Remediation",
    description: "Diagnosing long tasks, interaction to next paint (INP) bottlenecks, and DOM bloat to achieve perfect 100 Lighthouse scores.",
    category: "Performance",
    tags: ["performance", "webvitals", "optimization", "lighthouse"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Kenji Sato",
      username: "kenjisato",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Web Performance Lead",
      bio: "Obsessed with frame rates, memory profiles, and eliminating JavaScript bloat."
    },
    publishedAt: "2026-10-19T17:05:00Z",
    readingTime: 7,
    likesCount: 310,
    commentsCount: 22,
    viewsCount: 3940,
    featured: false,
    trending: false,
    content: `
# Web Core Vitals: INP, LCP, and Memory Leak Remediation

Search engines and readers alike prioritize websites that respond instantaneously to tactile feedback. Interaction to Next Paint (INP) has cemented itself as the definitive metric for user-perceived responsiveness.

## Key Performance Techniques Applied in Chronicle:
1. **Debouncing live search**: Reduces input latency to zero by waiting for natural pauses before filtering.
2. **In-Memory Cache with TTL**: Prevents re-fetching already retrieved articles.
3. **Virtual Component Rendering**: Limits rendered elements to those within the viewport.
4. **CSS Hardware Acceleration**: Ensures transform and opacity animations run on GPU threads.
    `
  }
];

export const CATEGORIES = [
  "All",
  "Architecture",
  "AI & ML",
  "Design",
  "Development",
  "DevOps",
  "Performance"
];
