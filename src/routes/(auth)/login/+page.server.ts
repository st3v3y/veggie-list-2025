import { fail, redirect } from "@sveltejs/kit";
import * as m from '$lib/paraglide/messages';
import { i18n } from "$lib/i18n";
import { languageTag } from '$lib/paraglide/runtime';

export const load = async ({ locals, url, depends }) => {
    depends("paraglide:lang") 

    if (locals.pb?.authStore?.model) {
        throw redirect(303, i18n.resolveRoute("/", languageTag()));
    }

    const fail = url.searchParams.get("fail") === "true";

    return { fail };
}

export const actions = {
    login: async ({ locals, request  }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData) as {
            email: string;
            password: string;
        };
        try {
            await locals.pb.collection("users").authWithPassword(data.email.toLowerCase(), data.password);
        } catch {
            return fail(400, { error: m.incorrect_credentials()});
        }

        throw redirect(303, "/");
    }
}