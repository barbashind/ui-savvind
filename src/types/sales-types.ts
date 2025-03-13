import { SortOrder } from "../components/global/TableColumnHeader";
import { Partner } from "../components/SalesPage/SalesDetailsModal";

export interface TCheck {
        checkId?: number;
        summ: number | null;
        customer?: string;
        isBooking: boolean | null;
        isUnpaid: boolean | null;
        isCancelled: boolean | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        partners?: Partner[];
        isEnding?: boolean;
        seller?:string | null;
        courier?:string | null;
        account?: string;
    }

export interface TSale {
        saleId: number | null;
        checkId?: number;
        itemId?: number;
        customer?: string;
        salePrice: number | null;
        name: string | null;
        serialNumber?: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        quant?: number | null;
        costPrice?: number | null;
        summ?: number | null;
        partner?: string | null;
    }

export type TCheckRow = TCheck & {
        rowNumber: number;
        spacer: boolean;
    };
export type TSaleRow = TSale & {
        rowNumber: number;
        spacer: boolean;
    };

export interface TCheckFilter {
        searchText: string | null;
        dateMin: Date | null;
        dateMax: Date | null;
        customer: string | null;
    }

export interface TProduct {
        itemId?: number;
        batchId?: number;
        batchNumber?:number;
        barcode: string | null;
        serialNumber: string | null;
        hasSerialNumber: boolean;
        costPrice: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        name: string | null;
        productComment: string | null;
    }

export interface TCheckSortFields {
    checkId: SortOrder;
    createdAt: SortOrder;
    summ?: SortOrder;
}


