import { SortOrder } from "../components/global/TableColumnHeader";

export interface THistory {
        id?: number;
        table_name?: string;
        action_type?: string;
        action_time?: string;
        user?: string;
        row_id?: number;
        old_value?: string;
        new_value?: string;
        field?: string;
        remainder_old?: number;
        remainder_new?: number;
        serialNumber?: string;
    }

export type THistoryRow = THistory & {
        rowNumber: number;
        spacer: boolean;
    };


export interface THistoryFilter {
        searchText: string | null;
        table_name: string | null;
        onlyReturn: boolean;
    }



export interface THistorySortFields {
    id: SortOrder;
}


