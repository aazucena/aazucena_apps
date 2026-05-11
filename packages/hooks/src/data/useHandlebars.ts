import Handlebars from 'handlebars';
import { useMemo } from 'react';

export function useHandlebars<T = Record<string, string>>(templateString: string) {
  return useMemo(() => Handlebars.compile<T>(templateString, {}), [templateString]);
}
