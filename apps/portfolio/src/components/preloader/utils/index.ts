export function getTransitionClass(type: string): string {
  switch (type) {
    case 'fade':
      return 'animate-in fade-in-0 duration-500';
    case 'slide':
      return 'animate-in slide-in-from-bottom duration-500';
    case 'scale':
      return 'animate-in zoom-in-95 duration-500';
    case 'none':
      return '';
    default:
      return 'animate-in fade-in-0 duration-500';
  }
}
