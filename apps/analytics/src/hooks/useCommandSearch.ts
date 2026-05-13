'use client';

import { useMemo, useEffect, useRef } from 'react';
import { Index } from 'flexsearch';
import {
  Grid,
  Music,
  Terminal,
  ChartBarOne,
  Puzzle,
  Chip,
  Database,
  LayersThree,
  Activity,
  Globe,
  CreditCard,
  Compass,
  Moon,
  Sun,
  Zap,
  Refresh,
  Message,
  Mail,
  Star,
} from '@aazucena/icons';

export interface CommandAction {
  id: string;
  name: string;
  category: 'NAVIGATION' | 'SYSTEM' | 'AI' | 'INTEL';
  icon: any;
  href?: string;
  onSelect?: () => void;
  keywords: string;
}

export function useCommandSearch() {
  const indexRef = useRef<Index | null>(null);

  const actions: CommandAction[] = useMemo(
    () => [
      // --- NAVIGATION ---
      {
        id: 'nav-overview',
        name: 'Node Overview',
        category: 'NAVIGATION',
        icon: Grid,
        href: '/',
        keywords: 'dashboard home node overview',
      },
      {
        id: 'nav-traffic',
        name: 'Traffic Center',
        category: 'NAVIGATION',
        icon: Globe,
        href: '/traffic',
        keywords: 'traffic network globe geo',
      },
      {
        id: 'nav-journey',
        name: 'Journey Explorer',
        category: 'NAVIGATION',
        icon: Compass,
        href: '/journey',
        keywords: 'journey sessions user path',
      },
      {
        id: 'nav-logs',
        name: 'Telemetry Stream',
        category: 'NAVIGATION',
        icon: Terminal,
        href: '/logs',
        keywords: 'logs telemetry stream terminal events',
      },
      {
        id: 'nav-performance',
        name: 'System Integrity',
        category: 'NAVIGATION',
        icon: ChartBarOne,
        href: '/performance',
        keywords: 'performance integrity health metrics',
      },
      {
        id: 'nav-ai',
        name: 'AI Core Terminal',
        category: 'NAVIGATION',
        icon: Puzzle,
        href: '/ai',
        keywords: 'ai core terminal chat brain',
      },
      {
        id: 'nav-prompts',
        name: 'Prompt IDE',
        category: 'NAVIGATION',
        icon: LayersThree,
        href: '/ai/prompts',
        keywords: 'prompts ide engineering models',
      },
      {
        id: 'nav-trajectories',
        name: 'Trajectory Labs',
        category: 'NAVIGATION',
        icon: Chip,
        href: '/ai/trajectories',
        keywords: 'trajectories labs agents decisions',
      },
      {
        id: 'nav-music',
        name: 'Audio Intelligence',
        category: 'NAVIGATION',
        icon: Music,
        href: '/music',
        keywords: 'audio music intelligence sound playback',
      },
      {
        id: 'nav-costs',
        name: 'AI Cost Center',
        category: 'NAVIGATION',
        icon: Database,
        href: '/ai/costs',
        keywords: 'costs ai spending tokens usage',
      },
      {
        id: 'nav-finance',
        name: 'Financial Ledger',
        category: 'NAVIGATION',
        icon: CreditCard,
        href: '/finance',
        keywords: 'finance ledger stripe payments',
      },
      {
        id: 'nav-forms',
        name: 'Comms Inbox',
        category: 'NAVIGATION',
        icon: Mail,
        href: '/forms',
        keywords: 'forms inbox contact submissions reply email communications comms',
      },
      {
        id: 'nav-easter-eggs',
        name: 'Easter Eggs',
        category: 'NAVIGATION',
        icon: Star,
        href: '/easter-eggs',
        keywords: 'easter eggs hidden secrets unlocks achievements konami triggers completions',
      },

      // --- SYSTEM ---
      {
        id: 'sys-sync',
        name: 'Sync Knowledge Base',
        category: 'SYSTEM',
        icon: Refresh,
        keywords: 'sync brain knowledge rag reload',
      },
      {
        id: 'sys-live',
        name: 'Toggle Live Mode',
        category: 'SYSTEM',
        icon: Zap,
        keywords: 'live stream real-time toggle',
      },
      {
        id: 'sys-theme',
        name: 'Toggle Theme',
        category: 'SYSTEM',
        icon: Moon,
        keywords: 'theme dark light mode toggle',
      },

      // --- AI ---
      {
        id: 'ai-think',
        name: 'Ask Brain...',
        category: 'AI',
        icon: Message,
        keywords: 'ask think brain question research',
      },
    ],
    [],
  );

  useEffect(() => {
    // Initialize FlexSearch index
    const index = new Index({
      tokenize: 'forward',
      cache: true,
    });

    // Index all actions
    actions.forEach((action) => {
      index.add(action.id, `${action.name} ${action.keywords} ${action.category}`);
    });

    indexRef.current = index;
  }, [actions]);

  const search = (query: string) => {
    if (!query || !indexRef.current) return actions;

    const results = indexRef.current.search(query, { suggest: true });
    return actions.filter((action) => results.includes(action.id));
  };

  return {
    actions,
    search,
  };
}
