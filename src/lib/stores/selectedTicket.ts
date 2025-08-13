import { writable } from 'svelte/store';

export const selectedTicket = writable<{ id: string; title: string } | null>(null);
