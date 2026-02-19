# Context Package Documentation

## 📚 DOCUMENTATION_INDEX

Complete reference for the aazucena State Intelligence Orchestrator.

---

## Quick Start

- **[Context Patterns](./context-patterns.md)** - Composition strategies, performance optimization
- **[State Management](./state-management.md)** - When to use each context, combining contexts

---

## Core Contexts

### AnimationContext - Performance_Gatekeeper

Device capability detection, sound settings, performance tier management. Determines whether to render heavy animations (Three.js, PixiJS) based on device capabilities.

### PortfolioContext - Navigation_Engine

Section navigation (0-7), scroll progress tracking, modal/panel state management. Central hub for all portfolio navigation interactions.

### DataContext - CMS_Bridge

CMS data provider with section registry and component mapping. Provides homepage content, portfolio metadata, and dynamic section data throughout the application.

### FormContext - Wizard_Controller

Multi-step form state machine with validation and submission tracking. Manages form progress, data persistence, and step transitions.

### TelemetryContext - Analytics_Gateway

Analytics API configuration for framework-agnostic telemetry ingestion. Enables ClickHouse integration without hardcoding API endpoints.

---

## Documentation Topics

### [Context Patterns](./context-patterns.md) - Composition_Intelligence

- Provider nesting strategies
- Performance optimization (memoization, selective re-renders)
- Context composition patterns
- Testing strategies

### [State Management](./state-management.md) - State_Architecture

- When to use each context
- Combining multiple contexts
- State synchronization patterns
- Local vs global state decisions

---

## Quick Links

- **Main Package**: [README.md](../README.md)
- **Source Code**: [src/](../src/)
- **Types**: [@aazucena/types](../../types/)
- **Hooks**: [@aazucena/hooks](../../hooks/)

---

**LAST_UPDATED:** 2026-02-11
**MAINTAINER:** aazucena_intelligence_engine
