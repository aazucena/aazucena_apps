'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Microphone, StopCircle, Refresh, Danger } from '@aazucena/icons';
import { Button } from './button';

// Local Web Speech API type declarations (not universally in lib.dom.d.ts)
interface SpeechRecognitionAlternative {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const speechInputVariants = cva(
  'flex items-center gap-2 rounded-md border p-2 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface SpeechInputProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof speechInputVariants> {
  onResult: (text: string) => void;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  placeholder?: string;
}

const SpeechInput = React.forwardRef<HTMLDivElement, SpeechInputProps>(
  (
    {
      className,
      variant,
      onResult,
      lang = 'en-US',
      continuous = false,
      interimResults = false,
      placeholder = 'Start speaking...',
      ...props
    },
    ref,
  ) => {
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const recognitionRef = React.useRef<SpeechRecognitionInstance | null>(null);

    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as WindowWithSpeech).SpeechRecognition ||
        (window as WindowWithSpeech).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Speech Recognition not supported by your browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i]!;
          const transcriptPart = result[0]!.transcript;
          if (result.isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);

        if (finalTranscript) {
          onResult(finalTranscript);
          setTranscript('');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, [continuous, interimResults, lang, onResult]);

    const startListening = () => {
      setError(null);
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e: unknown) {
          console.error('Error starting speech recognition:', e);
          setError('Microphone access denied or already in use.');
          setIsListening(false);
        }
      }
    };

    const stopListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

    return (
      <div ref={ref} className={cn(speechInputVariants({ variant }), className)} {...props}>
        {error ? (
          <div className="flex items-center gap-2 text-sm text-rose-500">
            <Danger className="size-4" />
            <span className="truncate">{error}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-6"
              onClick={() => setError(null)}
            >
              <Refresh className="size-3" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="outline"
              size="icon"
              className={cn(
                'size-8 shrink-0',
                isListening && 'animate-pulse border-rose-500/20 text-rose-500',
                variant === 'cyber' && 'border-cyan-500/30 text-cyan-400',
                variant === 'glass' && 'glass border-input/20 text-foreground',
              )}
            >
              {isListening ? <StopCircle className="size-4" /> : <Microphone className="size-4" />}
            </Button>
            <span
              className={cn(
                'flex-grow truncate text-sm',
                transcript ? 'text-foreground' : 'text-muted-foreground italic',
                variant === 'cyber' && 'font-mono text-xs',
              )}
            >
              {transcript || placeholder}
            </span>
            {isListening && <Refresh className="text-primary size-4 shrink-0 animate-spin" />}
          </>
        )}
      </div>
    );
  },
);
SpeechInput.displayName = 'SpeechInput';

export { SpeechInput, speechInputVariants };
