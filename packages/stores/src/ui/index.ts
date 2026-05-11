import { atom } from 'nanostores';

/**
 * Common UI State
 */

export const isSidebarOpenStore = atom<boolean>(false);
export const activeModalStore = atom<string | null>(null);

export function toggleSidebar() {
  isSidebarOpenStore.set(!isSidebarOpenStore.get());
}

export function openModal(id: string) {
  activeModalStore.set(id);
}

export function closeModal() {
  activeModalStore.set(null);
}
