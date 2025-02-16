<script lang="ts">
	import Veggie from '$lib/components/Veggie.svelte';
	import * as m from '$lib/paraglide/messages';
	import { languageTag } from '$lib/paraglide/runtime';
	import { getUnitTranslated } from '$lib/utils/translation-helpers.js';
	import Clipboard from 'svelte-clipboard';
	import { Toaster, toast } from 'svelte-sonner';
	import { Clipboard as ClipboardIcon} from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();
	const { veggies } = data;

	let veggieList = $state([...veggies.items]);
	let veggiesWithoutAmount = $derived(veggieList.filter((x) => x.selected === true && !x.amount));

	let totalAmount = $derived(() => {
		return veggieList
			.filter(x => x.selected === true && x.amount !== undefined)
			.map(x => {
				if (x.amount === undefined) {
					console.error("Could not calculate price for veggie, no amount given", x);
					return 0;
				}

				// "order_unit" is the user selected unit
				// "price_unit" is the unit of the price set on the server

				console.log("----- Calculating price for veggie", x.name_en, x.amount, x.order_unit, x.price, x.price_unit);

				// if the user selects "dollar" -> this is the price we want to add up
				if (x.order_unit == 'dollar') {
					return x.amount;
				}

				// if the "server price unit" is the same as the user selected unit,
				// we can simply multiply the price defined on the server with the amount
				if (x.order_unit == x.price_unit) {
					return x.amount * x.price;
				}

				// now the user selected a different unit than defined on the server
				// - if it is "unit": we can't do much, as we can not convert it
				// - if it is a weight unit (libra, kilo or gram), we can convert the server price to the selected one
				if ((x.order_unit === 'libra' || x.order_unit === 'kilo' || x.order_unit === 'gram') 
					&& (x.price_unit === 'libra' || x.price_unit === 'kilo' || x.price_unit === 'gram')) {
					let gramPrice = x.price; // default to gram
					if (x.price_unit == 'kilo') {
						gramPrice = x.price / 1000; // 1 kilo = 1000 grams
					} else if (x.price_unit == 'libra') {
						gramPrice = x.price / 453.592; // 1 libra = 453,592 grams
					}

					if (x.order_unit === 'libra') {
						return x.amount * gramPrice * 453.592;
					} else if (x.order_unit === 'kilo') {
						return x.amount * gramPrice * 1000;
					} else if (x.order_unit === 'gram') {
						return x.amount * gramPrice;
					}

				} else {
					// Here the user selected "unit" but we can't calculate the price
				}

				console.error("Could not calculate price for veggie", x.name_en, x.amount, x.order_unit, x.price, x.price_unit);
				return 0;
			})
			.reduce((acc, x) => acc! + x!, 0)
			.toFixed(2);
	});

	let orderText = $derived(() => {
		let text = "";
		if (!veggieList || veggieList.length == 0) {
			return "";
		}
		veggieList.filter(x => x.selected === true).forEach((x) => {
			const veggieName = languageTag() == "es" ? x.name_es : x.name_en;
			if (!x.amount || !x.order_unit) {
				text = text + `- ${veggieName}\r\n`;
			} else {
				const constant = getUnitTranslated(x.order_unit, x.amount == 1).toLowerCase();
				const comment = x.hasComment ? ' (' + x.comment + ')' : '';
				text = text + `- ${x.name_es}, ${x.amount} ${constant}${comment}\r\n`;
			}
		});
		return text;
	});
</script>

<div class="sticky top-2 z-50">
	<Header veggiesSelected={veggieList.filter(x => x.selected == true).length} priceTotal={totalAmount()} amountMissing={veggiesWithoutAmount.length > 0} />
</div>

<section class="w-full px-4 mt-8">
	<h1 class="text-3xl mb-5 text-center">{m.veggies_title()}  <span class="text-slate-500">({veggieList.length})</span></h1>
	<div class="flex flex-col justify-center w-full max-w-xl mx-auto gap-4">
		{#each Array(veggieList.length) as _, index}
			<Veggie bind:veggie={veggieList[index]} />
		{/each}
	</div>
</section>

<section class="flex flex-col mt-10 items-center w-full px-4">
	<div class="max-w-xl mx-auto w-full ">
		{#if veggiesWithoutAmount.length > 0 } 
			<div class="mb-10 bg-red-100/50 p-4 rounded-lg">
				<h3 class="text-md font-bold text-red-500">
					{veggiesWithoutAmount.length}
					{m.missing_amounts()}
				</h3>
				<ul>
					{#each veggiesWithoutAmount as veggie (veggie.id)}
						<li class="text-red-500">- {languageTag() == "es" ? veggie.name_es : veggie.name_en}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="mb-10 bg-green-100/50 p-4 rounded-lg">
				<h3 class="text-md font-bold text-green-500">
					{m.all_veggies_have_amounts()}
				</h3>
			</div>
		{/if}

		<textarea value={orderText()} readonly class="form-input rounded-lg px-4 py-3 border border-slate-400 w-full min-h-[300px]"/>
		<Clipboard
			text={orderText()}
			let:copy
			on:copy={() => toast.success(m.text_copied())}
		>
			<button class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 cursor-pointer disabled:opacity-50 items-center gap-2 h-12 mt-3" disabled={veggiesWithoutAmount.length > 0} onclick={copy}>
				<ClipboardIcon size="16" />
				{m.copy_button()}
			</button>
		</Clipboard>
	</div>
</section>

<Toaster position="bottom-right" />