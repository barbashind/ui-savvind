import { SortOrder } from "../components/global/TableColumnHeader";
import { TCategory } from "./settings-types";

export interface TAccounting {
        id?: number;
        accountFrom?: string;
        accountTo?: string;
        justification?: string;
        form?: string;
        value?: number;
        isDraft?: boolean;
        category?: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        currency?: string;
        author?: string | null;
    }

export type TAccountingRow = TAccounting & {
        rowNumber: number;
        spacer: boolean;
};

export interface TAccountingFilter {
        searchText: string | null;
        accountFrom: string | null;
        accountTo: string | null;
        justification: string | null;
        valueFrom: number | null;
        valueTo: number | null;
        dateFrom: Date | null;
        dateTo: Date | null;
        category: TCategory[] | null;
}
export interface TSumms {
        summRUB: number;
        summUSD: number;
}

export interface TAccountingSortFields {
        id: SortOrder;
        createdAt: SortOrder;
        isDraft: SortOrder;
}
