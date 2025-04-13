
export interface TAnalyticFilter {
        users?: (string | undefined)[] | null;
        startDate?: Date | null;
        endDate?: Date | null;
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