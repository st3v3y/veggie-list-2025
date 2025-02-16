import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import { i18n } from '$lib/i18n';
import type { Handle } from "@sveltejs/kit";
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {

  i18n.handle();

  event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  if (event.locals.pb.authStore.isValid) {
      try {
          await event.locals.pb.collection("users").authRefresh();
      } catch {
          event.locals.pb.authStore.clear();
      }
      event.locals.user = structuredClone(event.locals.pb.authStore.model);
  } else {
      event.locals.user = null;
  }

  const response = await resolve(event);
  
  response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ httpOnly: false }));

  return response;
}