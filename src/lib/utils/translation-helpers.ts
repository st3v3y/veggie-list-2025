import * as m from '$lib/paraglide/messages';

export function getUnitTranslated(unit: "unit" | "libra" | "kilo" | "gram" | "dollar", singular = true) {
  switch (unit) {
    case 'kilo':
      return singular ? m.kilo() : m.kilos();
    case 'unit':
      return singular ? m.unit() : m.units();
    case 'libra':
      return singular ? m.libra(): m.libras();
    case 'gram':
      return singular ? m.gram(): m.grams();
    case 'dollar':
      return singular ? m.dollar(): m.dollars();
    default:
      return unit;
  }
}