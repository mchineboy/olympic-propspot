import { session } from '$lib/session';
import { redirect } from '@sveltejs/kit';
import { type UserProfile } from '$lib/users';

export function load() {
  let currentUser: UserProfile | undefined | null = undefined;

  session.subscribe(value => {
    currentUser = value.user;
  });

  if (!currentUser || !(currentUser as UserProfile).administrator) {
    throw redirect(303, '/dashboard');
  }

  return {};
}