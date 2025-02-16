import { currentUser } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';


export const actions = {
    default: async ({ locals }) => {
        locals.pb.authStore.clear();
        locals.user = null;
        currentUser.set(null);
        throw redirect(303, "/login");
    }
}