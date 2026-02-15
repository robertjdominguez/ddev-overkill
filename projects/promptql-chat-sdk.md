---
title: "PromptQL Chat SDK"
description: "A flexible React SDK for integrating PromptQL-powered chat interfaces into your applications."
slug: "promptql-chat-sdk"
created_at: "2024-09-01"
image: "/images/learn-supergraph-ddn.webp"
tech_stack: ["TypeScript", "React", "Vite", "CSS"]
url: "https://github.com/hasura/promptql-chat-sdk"
github: "https://github.com/hasura/promptql-chat-sdk"
featured: true
---

A flexible React SDK for integrating PromptQL-powered chat interfaces into your applications. Whether you need a quick drop-in solution, custom component layouts, or complete UI control, this SDK adapts to your integration requirements.

## Three ways to use this thing

**1. Drop-in Component** - Add a complete chat interface, with custom branding, with a single component

**2. Component Library** - Mix and match individual components for custom layouts

**3. Headless Hook** - Build any UI while leveraging our state management and API integration

All integration approaches include SSE-powered real-time responses, thread persistence across sessions, customizable theming, and comprehensive TypeScript support.

## What it actually does

- **Real-time Streaming**: SSE-powered responses for instant feedback
- **Thread Persistence**: Maintain conversation history across sessions
- **Flexible Theming**: Auto-detect system themes or force light/dark modes
- **TypeScript First**: Full type safety and IntelliSense support
- **Multiple Integration Patterns**: From drop-in to headless
- **Docusaurus Integration**: Specialized support for documentation sites

## Usage Examples

### Drop-in Component
```tsx
import { PromptQLChat } from "promptql-chat-sdk";

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <PromptQLChat endpoint="http://localhost:8080" />
    </div>
  );
}
```

### Headless Hook
```tsx
import { usePromptQLChat } from "promptql-chat-sdk";

function CustomChat() {
  const { messages, sendMessage, isLoading } = usePromptQLChat({
    endpoint: "http://localhost:8080"
  });
  
  // Build completely custom UI
}
```

## Tech Stack

- **TypeScript** - Core SDK with comprehensive type definitions
- **React** - Component library and hooks
- **Vite** - Build tool and development server
- **CSS** - Theming system and component styling

This is the thing I built at work that somehow made it to production. It's published to npm and includes comprehensive documentation, examples, and proxy server implementations. You know it's a real enterprise project because it has three different ways to do the same thing.