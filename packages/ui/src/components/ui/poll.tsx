'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from './button';
import { Progress } from './progress';

const pollVariants = cva('flex flex-col gap-4 rounded-md border p-6 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pollVariants> {
  question: string;
  options: PollOption[];
  onVote?: (optionId: string) => void;
  hasVoted?: boolean; // Simulate whether the user has already voted
  initialVotes?: Record<string, number>; // For Storybook or initial setup
}

const Poll = React.forwardRef<HTMLDivElement, PollProps>(
  (
    {
      className,
      variant,
      question,
      options: initialOptions,
      onVote,
      hasVoted: initialHasVoted = false,
      initialVotes,
      ...props
    },
    ref,
  ) => {
    const [options, setOptions] = React.useState<PollOption[]>(() => {
      if (initialVotes) {
        return initialOptions.map((opt) => ({
          ...opt,
          votes: initialVotes[opt.id] !== undefined ? initialVotes[opt.id]! : opt.votes,
        }));
      }
      return initialOptions;
    });
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    const [hasVoted, setHasVoted] = React.useState(initialHasVoted);

    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

    const handleVote = () => {
      if (selectedOption && !hasVoted) {
        setOptions((prevOptions) =>
          prevOptions.map((opt) =>
            opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt,
          ),
        );
        setHasVoted(true);
        onVote?.(selectedOption);
      }
    };

    return (
      <div ref={ref} className={cn(pollVariants({ variant }), className)} {...props}>
        <h3 className="text-lg font-semibold">{question}</h3>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <div key={option.id} className="flex flex-col gap-1">
              {!hasVoted ? (
                <label
                  htmlFor={`option-${option.id}`}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors',
                    selectedOption === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-input hover:bg-muted/50',
                  )}
                >
                  <span className="flex-grow">{option.text}</span>
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    className="sr-only"
                    disabled={hasVoted}
                  />
                </label>
              ) : (
                <div
                  className={cn(
                    'flex flex-col gap-1 rounded-md border p-3 text-sm',
                    selectedOption === option.id ||
                      (initialHasVoted && selectedOption === option.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-input',
                  )}
                >
                  <div className="flex justify-between font-medium">
                    <span>{option.text}</span>
                    <span>
                      {totalVotes > 0
                        ? `${((option.votes / totalVotes) * 100).toFixed(1)}%`
                        : '0.0%'}{' '}
                      ({option.votes})
                    </span>
                  </div>
                  <Progress
                    value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}
                    className="h-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {!hasVoted && (
          <Button onClick={handleVote} disabled={!selectedOption}>
            Vote
          </Button>
        )}
        {hasVoted && (
          <p className="text-muted-foreground text-center text-sm">
            You have already voted. Total votes: {totalVotes}
          </p>
        )}
      </div>
    );
  },
);
Poll.displayName = 'Poll';

export { Poll, pollVariants };
