<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
	import type { Veggie } from "$lib/models";
  import { languageTag } from "$lib/paraglide/runtime";
	import { Check, TriangleAlert } from "lucide-svelte";
	import { fade, scale } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';
	import { getUnitTranslated } from "$lib/utils/translation-helpers";
	import Alert from "./Alert.svelte";
  
  interface Props {
    veggie: Veggie;
  }

  let { veggie = $bindable() }: Props = $props();
</script>

<div class="flex justify-between rounded-xl px-6 py-6 {veggie.selected ? "bg-white border border-gray-200": "bg-slate-100"}">
  <div class="flex items-start gap-4">
    <div>
      <img 
        transition:scale
        src="{`${PUBLIC_POCKETBASE_URL}/api/files/${veggie.collectionId}/${veggie.id}/${veggie.image}`}" 
        alt="{languageTag() == "es" ? veggie.name_es : veggie.name_en}" 
        class="{veggie.selected ? "h-24 w-24 max-w-24 max-h-24" : "h-16 w-16 grayscale-50"} object-cover rounded-full" 
        />
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex items-baseline gap-4 {!veggie.selected && "mt-4"}">
        <h2 class="text-2xl font-bold">
          {#if languageTag() !== 'es'}
            {veggie.name_en}
          {:else}
            {veggie.name_es}
          {/if}
        </h2>
        <span class="text-[#AAA]">${veggie.price} / {getUnitTranslated(veggie.price_unit)}</span>
      </div>
      {#if veggie.selected}
        <div class="flex justify-start items-center flex-wrap md:flex-nowrap w-full gap-4 pr-4">
          <input name="amount" type="number" bind:value={veggie.amount} class="form-input w-full px-4 py-3 rounded-lg border border-slate-400 h-12" aria-label="Amount" placeholder={m.amount_placeholder()}  /> /
          <div class="flex w-full gap-4">
            <div class="grow min-w-[120px] h-12">
              <select name="order_unit" bind:value={veggie.order_unit} class="form-input w-full px-3 py-3 rounded-lg border border-slate-400">\
                  <option value="unit">{m.unit()}</option>
                  <option value="dollar">{m.dollar()}</option>
                  <option value="libra">{m.libra()}</option>
                  <option value="kilo">{m.kilo()}</option>
                  <option value="gram">{m.gram()}</option>
              </select>
            </div>
            
            <div class="flex items-center">
              <button onclick={() => veggie = {...veggie, hasComment: true}} disabled={veggie.hasComment}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={veggie.hasComment ? "#dbdbdb" : "#aaa"} stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          </div>
        </div>
        {#if veggie.hasComment}
          <div transition:fade class="flex flex-col">
            <label for="comment" class="text-slate-500 text-sm">{m.comment_label()}</label>
            <div class="flex gap-4">
              <input name="comment" bind:value={veggie.comment} class="form-input w-full px-4 py-3 rounded-lg border border-slate-400" aria-label="Amount" placeholder={m.comment_placeholder()}  />
              <button onclick={() => veggie = {...veggie, hasComment : false}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        {/if}

        {#if veggie.order_unit === 'unit' && veggie.price_unit !== 'unit'}
          <div class="flex items-start gap-2">
            <TriangleAlert size={14} color="orange" /> <span class="text-xs">{m.price_warning_unit()}</span>
          </div>
        {:else if (veggie.order_unit === 'libra' || veggie.order_unit === 'kilo' || veggie.order_unit === 'gram') && veggie.price_unit === 'unit'}
          <div class="flex items-start gap-2">
            <TriangleAlert size={14} color="orange" /> <span class="text-xs">{m.price_warning_weight()} </span>
          </div>
        {/if}
      {/if}
    </div>
  </div>
  <div class="flex items-start mt-5">
    {#if veggie.selected}
      <button class="bg-green-400 hover:bg-green-300 text-white p-1 rounded-full cursor-pointer" onclick={() => veggie = { ...veggie, selected: false }} ><Check size={20} /></button>
    {:else}
      <button class="bg-gray-400 hover:bg-gray-300 text-white p-1 rounded-full cursor-pointer" onclick={() => veggie = { ...veggie, selected: true }} ><Check size={20} /></button>
    {/if}
  </div>
</div>
