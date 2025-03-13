import { SortOrder } from "../components/global/TableColumnHeader";

export interface TNomenclature {
    itemId?: number;
    name: string | null;
    lastCostPrice: number | null;
    weight: number | null;
    isMessageActive: boolean;
    productType?: string;
    brand: string | null;
    productHeight: number | null | string;
    productWidth: number | null | string;
    productLength: number | null | string;
    createdAt: Date | null;
    updatedAt: Date | null;
    altName: string | null;
    productColor: string | null;
    productPrice: number |null;
    printName: string | null;
    productModel: string | null;
    productMemory: number | null;
    productCountry: string | null;
    productSim: string | null;
    remainsSum: number | null;
    hasSerialNumber: boolean;
    lastCostPriceAll?: number | null;
}

export type TNomenclatureRow = TNomenclature & {
    rowNumber: number;
    spacer: boolean;
};

export interface TNomenclatureFilter {
    searchText: string | null;
    remainsMin: number | null;
    remainsMax: number | null;
    remainsSumMin: number | null;
    remainsSumMax: number | null;
    productType?: string[];
    brand: string | null;
    altName: string | null;
    productColor: string | null;
    productPrice: number | null;
    productModel: string | null;
    productCountry: string | null;
}

export interface TNomenclatureSortFields {
        name: SortOrder;
        lastCostPrice: SortOrder;
        createdAt: SortOrder;
        remainsSum: SortOrder;
}
