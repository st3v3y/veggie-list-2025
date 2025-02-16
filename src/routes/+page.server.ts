import type { Veggie } from "$lib/models";
import { redirect } from "@sveltejs/kit";
import type { ListResult } from "pocketbase";

export const load = async ({ locals }) => {
  if (!locals.pb.authStore.isValid) {
      throw redirect(303, "/login");
  }

  let veggies = { items: [] } as unknown as ListResult<Veggie>;

  try {
    veggies = await locals.pb.collection('veggies').getList(1, 100, {
      sort: 'name_es',
    }) as ListResult<Veggie>;
  } catch (e) {
    console.error(e);
  }

  return {
    veggies 
  }
}