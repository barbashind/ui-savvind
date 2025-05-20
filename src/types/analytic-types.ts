import { SortOrder } from "../components/global/TableColumnHeader";

export interface TAnalyticFilter {
        users?: (string | undefined)[] | null;
        startDate?: Date | null;
        endDate?: Date | null;
        account?: string | null;
}


export interface TAnalyticData {
        user: string | undefined;
        revenue: number | undefined;
        margProfit: number | undefined;
}

export interface TAssetsData {
        supplies: number | undefined;
        warehouse: number | undefined;
        debit: number | undefined;
        officeAsset: number | undefined;
        revenue: number | undefined;
        margProfit: number | undefined;
}


export interface TAnalyticGraphData {
        user: string | undefined;
        revenue: number | undefined;
        margProfit: number | undefined;
        date: Date;
}

export interface TProdDeliver {
        name: string | undefined;
        quant: number | undefined;
        cost: number | undefined;
}

export interface TAnalyticDeliversData {
        deliver: string | undefined;
        products: TProdDeliver[];
}

export interface TProdData {
        name: string | undefined;
        quantAll: number | undefined;
        quantMy: number | undefined;
        quantPartner: number | undefined;
        revenueAll: number | undefined;
        revenueMy: number | undefined;
        revenuePartner: number | undefined;
        margAll: number | undefined;
        margMy: number | undefined;
        margPartner: number | undefined;
}

export type TProdDataRow = TProdData & {
        rowNumber: number;
        spacer: boolean;
};

export interface TProdDataFilter {
        startDate?: Date | null;
        endDate?: Date | null;
}

export interface TProdDataSortFields {
        quantAll: SortOrder;
        revenueAll: SortOrder;
        margAll: SortOrder;
}
