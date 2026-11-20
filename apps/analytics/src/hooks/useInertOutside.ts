import { useEffect, type RefObject } from 'react';

/**
 * While `active`, marks every direct child of `document.body` except the one
 * containing `ref` as `inert`, removing it from tab order and the accessibility tree.
 * On cleanup, removes only the `inert` attributes this hook added.
 */
export function useInertOutside(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    const added: Element[] = [];
    for (const el of Array.from(document.body.children)) {
      if (el === root || el.contains(root) || el.hasAttribute('inert')) continue;
      el.setAttribute('inert', '');
      added.push(el);
    }
    return () => {
      for (const el of added) el.removeAttribute('inert');
    };
  }, [ref, active]);
}
