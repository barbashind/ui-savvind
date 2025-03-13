import { SortOrder } from "../components/global/TableColumnHeader";
import { TPurchaseItem } from "./product-purchase-types";

export interface TPurchaseReg {
    batchId?: number;
    batchNumber?:number;
    createdAt: Date | null;
    updatedAt: Date | null;
    comment: string | null;
    batchStatus: string | null;
}

export interface TPurchaseRegItem {
    itemBatchId: number | null;
    batchId?: number;
    itemId?: number;
    batchNumber?:number;
    quant: number | null;
    hasSerialNumber: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    name: string | null;
    serialNumber?: string | null;
    quantFinal?: number | null;
}


export type TPurchaseRegData = TPurchaseReg & {
    body: TPurchaseItem[];
};

export type TPurchaseRegRow = TPurchaseReg & {
    rowNumber: number;
    spacer: boolean;
};

export interface TPurchaseRegFilter {
        batchStatus?: string[];
        
}

export interface TPurchaseRegSortFields {
    updatedAt: SortOrder;
    batchId?: number;
}
