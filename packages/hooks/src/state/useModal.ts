/**
 * useModal Hook
 * Manages modal state with keyboard handling and optional GSAP animations
 */

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface ModalOptions {
  animationDuration?: number;
  closeOnEscape?: boolean;
}

export function useModal<T = unknown>({
  animationDuration = 0.3,
  closeOnEscape = true,
}: ModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const open = (modalData?: T) => {
    setIsOpen(true);
    if (modalData !== undefined) {
      setData(modalData as T);
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: animationDuration,
          ease: 'power2.out',
          clearProps: 'transform',
        },
      );
    }
  }, [isOpen, animationDuration]);

  // Keyboard handling
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  return {
    isOpen,
    data,
    open,
    close,
    modalRef,
  };
}
