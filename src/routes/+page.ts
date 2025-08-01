import type { PageData } from './$types';

export type PageData = {
  user: {
    id: string;
    username: string;
  } | null;
  session: any;
};
