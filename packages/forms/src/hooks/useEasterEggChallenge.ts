import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import * as Stores from '@aazucena/stores';

const interactionsStore = (Stores as any).interactionsStore || {};
const setActiveChallengeTarget = (Stores as any).setActiveChallengeTarget || (() => {});

export interface Challenge {
  id: string;
  label: string;
  hint: string;
  category: 'visual' | 'technical' | 'logic';
}

const POTENTIAL_CHALLENGES: Challenge[] = [
  // --- Visual/3D Challenges (Atmospheric Layers) ---
  {
    id: 'bird',
    category: 'visual',
    label: 'Flying High',
    hint: 'Find the bird soaring in the Troposphere',
  },
  {
    id: 'blimp',
    category: 'visual',
    label: 'Airship Sight',
    hint: 'Locate the slow-moving blimp in the Stratosphere',
  },
  {
    id: 'drone',
    category: 'visual',
    label: 'Spy in the Sky',
    hint: 'Catch the tactical drone patrolling the Mesosphere',
  },
  {
    id: 'iss',
    category: 'visual',
    label: 'Orbital View',
    hint: 'Locate the ISS in the Thermosphere',
  },
  {
    id: 'astronaut',
    category: 'visual',
    label: 'Lost in Space',
    hint: 'Find the astronaut floating in the Exosphere',
  },
  {
    id: 'ufo',
    category: 'visual',
    label: 'Close Encounter',
    hint: 'Catch a glimpse of the UFO in the deep Mesosphere',
  },
  {
    id: 'satellite',
    category: 'visual',
    label: 'Data Stream',
    hint: 'Find the communication satellite in the Exosphere',
  },
  {
    id: 'meteor',
    category: 'visual',
    label: 'Falling Star',
    hint: 'Track the meteor streaking through the Mesosphere',
  },

  // --- Technical: Engine & Game State (Stockfish / Engine) ---
  {
    id: 'qsearch',
    category: 'technical',
    label: 'Quiescence Verification',
    hint: 'Analyze a tactical position until QSEARCH stabilizes',
  },
  {
    id: 'probcut',
    category: 'technical',
    label: 'ProbCut Threshold',
    hint: 'Trigger a PROBCUT prune during a deep search',
  },
  {
    id: 'eval_gate',
    category: 'technical',
    label: 'Evaluation Delta',
    hint: 'Identify a position with an EVAL_DIFF > 2.5',
  },
  {
    id: 'depth_check',
    category: 'technical',
    label: 'Computation Depth',
    hint: 'Achieve a search DEPTH_MAX of 24',
  },

  // --- Technical: AI Pipeline (Based on your ProcessStep snippet) ---
  {
    id: 'MODEL_DOWNLOAD',
    category: 'technical',
    label: 'Weight Retrieval',
    hint: 'Initiate the MODEL_DOWNLOAD sequence from HuggingFace',
  },
  {
    id: 'GGUF_CONVERSION',
    category: 'technical',
    label: 'Quantization Gate',
    hint: 'Complete a 4-bit GGUF_CONVERSION of the current model',
  },
  {
    id: 'UPLOAD_HF',
    category: 'technical',
    label: 'Model Deployment',
    hint: 'Trigger the UPLOAD_HF phase to the community hub',
  },
  {
    id: 'CONVERT_MODEL',
    category: 'technical',
    label: 'Format Translation',
    hint: 'Run the CONVERT_MODEL script to Safetensors',
  },
  {
    id: 'MERGE_WEIGHTS',
    category: 'technical',
    label: 'Architecture Fusion',
    hint: 'Complete the MERGE_WEIGHTS process for the base model',
  },
  {
    id: 'CHUNK_EMBEDDING',
    category: 'technical',
    label: 'Semantic Indexing',
    hint: 'Finalize CHUNK_EMBEDDING generation for the knowledge base',
  },

  // --- Logic & Secret Challenges ---
  {
    id: 'konami',
    category: 'logic',
    label: 'Legacy Access',
    hint: 'Input the traditional sequence (Konami Code) on any card',
  },
  {
    id: 'secret_slug',
    category: 'logic',
    label: 'Off-Roading',
    hint: 'Navigate to a hidden sub-route defined in the manifest',
  },
  {
    id: 'integrity',
    category: 'logic',
    label: 'System Health',
    hint: 'Check the real-time IntegrityBadge until it pulses Green',
  },
];

/**
 * Hook to manage the Easter Egg engagement challenge.
 * Requires the user to interact with a specific target before form submission.
 */
export function useEasterEggChallenge() {
  const [activeChallenge, setChallenge] = useState<Challenge | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const interactions = useStore(interactionsStore);

  const generateChallenge = useCallback(() => {
    const random = POTENTIAL_CHALLENGES[Math.floor(Math.random() * POTENTIAL_CHALLENGES.length)];
    if (random) {
      setChallenge(random);
      setActiveChallengeTarget(random.id);
    }
  }, []);

  const isCompleted = activeChallenge ? !!interactions[activeChallenge.id] : false;

  useEffect(() => {
    if (!activeChallenge) {
      generateChallenge();
    }
    setIsInitializing(false);

    return () => {
      setActiveChallengeTarget(null);
    };
  }, [activeChallenge, generateChallenge]);

  return {
    activeChallenge,
    isCompleted,
    generateChallenge,
    isInitializing,
  };
}
