import { useEffect, type RefObject } from 'react';

/**
 * While `active`, marks every direct child of `document.body` except the one
 * containing `ref` as `inert`, removing it from tab order and the accessibility tree.
 * Children added to the body later (portals such as the command palette) are marked too.
 * On cleanup, removes only the `inert` attributes this hook added.
 */
export function useInertOutside(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    const added = new Set<Element>();
    const mark = (el: Element) => {
      if (el === root || el.contains(root) || el.hasAttribute('inert')) return;
      el.setAttribute('inert', '');
      added.add(el);
    };
    for (const el of Array.from(document.body.children)) mark(el);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element && node.parentNode === document.body) mark(node);
        });
      }
    });
    observer.observe(document.body, { childList: true });

    return () => {
      observer.disconnect();
      for (const el of added) el.removeAttribute('inert');
    };
  }, [ref, active]);
}
