import type { PageServerLoad } from './$types';
import type { User } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  console.log(locals);
  return {
    user: locals.user,
    session: locals.session
  };
};
