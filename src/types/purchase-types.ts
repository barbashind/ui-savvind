import { SortOrder } from "../components/global/TableColumnHeader";
import { TPurchaseItem } from "./product-purchase-types";

export interface TPurchase {
    batchId?: number;
    batchNumber?:number;
    sum: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    comment: string | null;
    batchStatus: string | null;
    costDeliver?: number;
    deliver?:number;
    insurance?:number;
    totalQuant?: number | null;
    totalQuantFinal?: number | null;
}

export type TPurchaseData = TPurchase & {
    body: TPurchaseItem[];
};

export type TPurchaseRow = TPurchase & {
    rowNumber: number;
    spacer: boolean;
};

export interface TPurchaseFilter {
        sumMin: number | null;
        sumMax: number | null;
        dateMin: number | null;
        dateMax: number | null;
        batchNumber: number | null;
        batchStatus?: string[];
        product?: {
            itemId: number;
            name: string;
        };
        
}

export interface TPurchaseSortFields {
    batchNumber: SortOrder;
    sum: SortOrder;
    createdAt: SortOrder;
}

export interface TPurchaseItemFilter {
    searchText: string | null;
    warehouse: string | null;
}

export interface TPurchaseItemSortFields {
    itemBatchId: SortOrder;
    remainder: SortOrder;
}

export type TPurchaseItemRow = TPurchaseItem & {
    rowNumber: number;
    spacer: boolean;
};