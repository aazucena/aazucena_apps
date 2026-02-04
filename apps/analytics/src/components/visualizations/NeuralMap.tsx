'use client';

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity as Sparkles, Search, Message, Terminal, Database, Components, Globe, ChartBar, ClockCircle, HardDrive, CreditCard, CheckCircle } from '@mynaui/icons-react';

import { cn } from '@/lib/utils';

interface NodeProps {
  type: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isFailed?: boolean;
}

const Node = ({ type, label, isActive, isCompleted, isFailed }: NodeProps) => {
  // Map icons based on node name or type
  const getIcon = () => {
    const t = type.toLowerCase();
    if (t.includes('intent')) return Components;
    if (t.includes('shades') || t.includes('librarian')) return Database;
    if (t.includes('insights') || t.includes('sage')) return ChartBar;
    if (t.includes('architect')) return Terminal;
    if (t.includes('chronicler') || t.includes('history')) return ClockCircle;
    if (t.includes('auditor') || t.includes('codebase')) return HardDrive;
    if (t.includes('fiscal') || t.includes('spend')) return CreditCard;
    if (t.includes('navigator') || t.includes('route') || t.includes('dispatcher')) return Globe;
    if (t.includes('retrieve') || t.includes('knowledge')) return Search;
    if (t.includes('generate') || t.includes('response')) return Message;
    if (t.includes('validate') || t.includes('check')) return CheckCircle;
    return Sparkles;
  };

  const Icon = getIcon();
  
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <motion.div 
        animate={{ 
          scale: isActive ? 1.1 : 1,
          borderColor: isActive ? 'var(--primary-500)' : isFailed ? 'var(--color-rose-500)' : isCompleted ? 'var(--color-emerald-500)' : 'currentColor'
        }}
        className={cn(
          "w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors shadow-xl",
          isActive ? "bg-primary-500/10 border-primary-500 shadow-primary-500/20" : 
          isFailed ? "bg-rose-500/10 border-rose-500 shadow-rose-500/20" :
          isCompleted ? "bg-emerald-500/10 border-emerald-500" : 
          "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-800"
        )}
      >
        <Icon 
          size={20} 
          className={isActive ? 'text-primary-500' : isFailed ? 'text-rose-500' : isCompleted ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-600'} 
        />
      </motion.div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-widest text-center max-w-[80px] leading-tight",
        isActive ? "text-primary-500" : isFailed ? "text-rose-500" : "text-zinc-500"
      )}>
        {label.replace('_', ' ')}
      </span>
    </div>
  );
};

export const NeuralMap = ({ steps, currentStepIndex }: { steps: any[], currentStepIndex: number }) => {
  const [graphData, setGraphData] = useState<{ nodes: any[], edges: any[] }>({
    nodes: [],
    edges: []
  });

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch('/api/brain/schema');
        const data = await res.json();
        setGraphData(data);
      } catch (err) {
        console.error('Failed to fetch brain schema:', err);
      }
    };
    fetchSchema();
  }, []);

  // Map the abstract steps to our known nodes
  const nodes = useMemo(() => {
    if (graphData.nodes.length > 0) return graphData.nodes;
    
    // Static fallback if API fails
    return [
      { id: 'analyze_intent', label: 'Intent_Analysis' },
      { id: 'expert_dispatcher', label: 'Expert_Dispatcher' },
      { id: 'retrieve_knowledge', label: 'Knowledge_RAG' },
      { id: 'generate_response', label: 'Cognitive_Gen' },
      { id: 'validate_response', label: 'Truth_Validator' },
    ];
  }, [graphData.nodes]);

  return (
    <div className="relative w-full h-full flex items-center justify-start sm:justify-center gap-4 lg:gap-8 p-6 overflow-x-auto overflow-y-hidden scrollbar-none">
      {/* BACKGROUND GRID (Theme-Adaptive) */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none sticky left-0" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="flex items-center gap-4 lg:gap-8 min-w-max px-4">
        {nodes.map((node, i) => {
          const isActive = i === currentStepIndex;
          const isCompleted = i < currentStepIndex;
          
          // Determine failure if the step associated with this node had a negative reward
          const stepData = steps[i];
          const isFailed = stepData && stepData.reward < 0;
          
          return (
            <React.Fragment key={node.id}>
              <Node 
                type={node.id} 
                label={node.label} 
                isActive={isActive}
                isCompleted={isCompleted}
                isFailed={isFailed}
              />
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center shrink-0">
                  <ArrowRight 
                    size={16} 
                    className={isFailed ? 'text-rose-500' : i < currentStepIndex ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-800'} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
