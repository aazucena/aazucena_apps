import { Moon, Refresh, Message, Compass } from '@aazucena/icons';
import type { CommandAction } from '@aazucena/hooks';

/**
 * GLOBAL_COMMANDS: Actions available in every application.
 */
export const GLOBAL_COMMANDS: CommandAction[] = [
  {
    id: 'sys-theme',
    name: 'Toggle Theme',
    category: 'SYSTEM',
    icon: Moon,
    keywords: 'theme dark light mode toggle appearance',
  },
  {
    id: 'sys-help',
    name: 'Command Help',
    category: 'SYSTEM',
    icon: Compass,
    keywords: 'help commands shortcuts keyboard',
  },
];

/**
 * INTELLIGENCE_COMMANDS: Shared AI-related actions.
 */
export const INTELLIGENCE_COMMANDS: CommandAction[] = [
  {
    id: 'ai-think',
    name: 'Ask Brain...',
    category: 'AI',
    icon: Message,
    keywords: 'ask think brain question research intelligence',
  },
  {
    id: 'sys-sync',
    name: 'Sync Knowledge Base',
    category: 'SYSTEM',
    icon: Refresh,
    keywords: 'sync brain knowledge rag reload refresh',
  },
];
