export interface TPurchaseItem {
        itemBatchId: number | null;
        batchId?: number;
        itemId?: number;
        batchNumber?:number;
        quant: number | null;
        hasSerialNumber: boolean;
        costPrice: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        name: string | null;
        serialNumber?: string | null;
        quantFinal?: number | null;
        remainder?: number | null;
        isSaled?: boolean;
        costDeliver?: number;
        costPriceAll?: number;
        contractorId?: number;
        warehouse?: string | null;
        partner?: string | null;
    }

export interface TProduct {
        itemId?: number;
        batchId?: number;
        batchNumber?:number;
        barcode?: string | null;
        serialNumber?: string | null;
        hasSerialNumber?: boolean;
        costPrice: number | null;
        productPrice: number | null;
        createdAt?: Date | null;
        updatedAt?: Date | null;
        name: string | null;
        productComment?: string | null;
        weight: number | null;
    }

export interface TDeliver {
        deliverId?: number;
        name?: string;
        priceDeliver?:number;
        insurance?:number;
    }

export interface TContractor {
        contractorId: number;
        contractor: string;
    }