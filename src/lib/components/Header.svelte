<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
  import { currentUser, pb } from "$lib/pocketbase";
	import { CircleCheck, CircleX, LogOut } from "lucide-svelte";
	import { languageTag, type AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';

  let loading = $state(false);
  let logoUrl = '/veggie-logo.svg';

  interface Props {
    veggiesSelected?: number;
    priceTotal?: string;
    amountMissing?: boolean;
  }

  let { veggiesSelected, priceTotal, amountMissing }: Props = $props();

	// function switchToLanguage(newLanguage: AvailableLanguageTag) {
	// 	const canonicalPath = i18n.route(page.url.pathname);
	// 	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
	// 	goto(localisedPath);
	// }
</script>

<header class="flex justify-between items-center p-4 pr-8 bg-gray-300/30 rounded-xl mx-4 mt-4 backdrop-blur-md">
  <div class="flex items-center">
    <img src={logoUrl} alt="Logo" class="h-10 mr-2" />
    <!-- <h1>{m.hello_world({ name: 'SvelteKit User' })}</h1> -->
  </div>

  {#if $currentUser}
    <div class="flex items-center gap-2">
      {#if amountMissing}
        <CircleX color="red" /> 
      {:else}
        <CircleCheck color="green" />
      {/if}
      <span>{veggiesSelected} / ${priceTotal}</span>
    </div>
  {/if}

  <div class="flex items-center gap-4">
    {#if $currentUser}
      <form method="POST" action="/logout" use:enhance={() => {
        loading = true;
        return async ({result}) => {
            pb.authStore.clear();
            await applyAction(result);
            loading = false;
        }
      }}>
        <button type="submit" class="flex items-center gap-2 cursor-pointer hover:text-gray-500">
            <LogOut size="15" />
            {m.logout()}
        </button>
      </form>
    {/if}

    <div>
      {#if languageTag() !== 'es'}
        <!-- <button onclick={() => switchToLanguage('es')} class="cursor-pointer"><img src="/flags/es.svg" width="30" alt="Español"/></button> -->
        <a 
          href={i18n.route(page.url.pathname)}
          hreflang={"es"}
          aria-current={"es" === languageTag() ? "page" : undefined}
        >
          <img src="/flags/es.svg" width="30" class="rounded" alt="Español"/>
        </a>
      {:else}
        <!-- <button onclick={() => switchToLanguage('en')} class="cursor-pointer"><img src="/flags/en.svg" width="30" alt="English"/></button> -->
        <a 
          href={i18n.route(page.url.pathname)}
          hreflang={"en"}
          aria-current={"en" === languageTag() ? "page" : undefined}
        >
          <img src="/flags/en.svg" width="30" class="rounded" alt="English"/>
        </a>
      {/if}
    </div>
  </div>
</header>
