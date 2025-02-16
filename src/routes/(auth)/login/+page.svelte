<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import Alert from "$lib/components/Alert.svelte";
    import { pb } from "$lib/pocketbase";
	import * as m from '$lib/paraglide/messages';
	import Header from "$lib/components/Header.svelte";

    let { data, form } = $props();

    let loading = $state(false);
</script>

<Header />

<div class="border border-gray-200 rounded-xl px-12 py-10 max-w-md mx-auto mt-20" >
    <h1 class="text-2xl mb-8">{m.login_title()}</h1>

    {#if form?.error}
        <Alert message={form.error} type={"error"} />
    {/if}

    <form method="POST" action="?/login" class="space-y-6" use:enhance={() => {
        loading = true;
        return async ({result}) => { 
            pb.authStore.loadFromCookie(document.cookie);
            await applyAction(result);
            loading = false;
        }
    }}>
        <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">{m.email()}</label>
            <input type="email" name="email" placeholder={m.email()} required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"/>
        </div>

        <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">{m.password()}</label>
            <input type="password" name="password" placeholder={m.password()} id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6">
        </div>
        
        <div>
            <button type="submit" disabled={loading} class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 cursor-pointer">
                {#if loading}
                    <span class="loading loading-spinner"></span>
                {/if}
                Iniciar sesión
            </button>
        </div>
    </form>

</div>