
export class Veggie  {
    id?: string;
    collectionId?: string;
    name_es!: string;
    name_en!: string;
    price!: number;
    price_unit!: 'unit' | 'libra' | 'kilo' | 'gram';
    image!: string;

    // UI State
    selected: boolean = false;
    amount: number | undefined = undefined;
    order_unit: 'unit' | 'libra' | 'kilo' | 'gram' | 'dollar' = 'unit';
    hasComment: boolean = false;
    comment: string = "";
}
