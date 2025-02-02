export interface TAccount {
        accountId?: number;
        name?: string;
        value?: number;
    }
    
export interface TCategory {
        id?: number;
        name?: string;
    }

export interface TWarehouse {
        warehouseId?: number;
        name?: string;
    }

export interface TUser {
        id ?: number;
        username?: string;
        role?: string;
    }

export interface TContractor {
        contractorId?: number;
        contractor?: string;
        account?: string;
    }

export interface TDeliver {
        deliverId?: number;
        name?: string;
        priceDeliver?: number;
        insurance?: number;
    }
