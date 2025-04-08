import { HttpService } from '../system/HttpService';
import { TNomenclature } from '../types/nomenclature-types';
import { TContractor, TDeliver, TPurchaseItem } from '../types/product-purchase-types';
import { TPurchase, TPurchaseData, TPurchaseFilter, TPurchaseItemFilter } from '../types/purchase-types';

import { TPageableResponse } from '../utils/types';
import { ErrorResponse, getErrorResponse, TSortParam } from './utils';

// Получение списка заказов
export const getPurchases = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TPurchase>[];
        filterParam?: TPurchaseFilter;
    }): Promise<TPageableResponse<TPurchase>> => {
        const response = HttpService.post<TPageableResponse<TPurchase>>(
            `/api/purchase/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

export const getItemsPurchase = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TPurchaseItem>[];
        filterParam?: TPurchaseItemFilter;
    }): Promise<TPageableResponse<TPurchaseItem>> => {
        const response = HttpService.post<TPageableResponse<TPurchaseItem>>(
            `/api/items-batch/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

export const getPurchase = async (
        id: number,
        getCallback: (arg0: TPurchase) => void
    ) => {
        await HttpService.get<TPurchase>('/api/purchase/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getPurchaseItems = async (
        id: number,
        getCallback: (arg0: TPurchaseItem[]) => void
    ) => {
        await HttpService.get<TPurchaseItem[]>('/api/items-batch/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getNomenclatures = async (
        getCallback: (arg0: TNomenclature[]) => void
    ) => {
        await HttpService.get<TNomenclature[]>('/api/nomenclature/all')
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getDelivers = async (
        getCallback: (arg0: TDeliver[]) => void
    ) => {
        await HttpService.get<TDeliver[]>('/api/delivers/filter')
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getContractors = async (
        getCallback: (arg0: TContractor[]) => void
    ) => {
        await HttpService.get<TContractor[]>('/api/contractors/filter')
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };    

interface TCreatedPurchase  {
    createdBatch: TPurchase;
}
// Создание записи
export const addPurchase = async (data: TPurchaseData): Promise<TCreatedPurchase> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/create-purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    const resp: TCreatedPurchase = (await response.json()) as TCreatedPurchase;
    return resp;
};

// Добавление товаров
export const addPurchaseItems = async (data: TPurchaseItem[]): Promise<TPurchaseItem[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/create-items-batch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    const resp: TPurchaseItem[] = (await response.json()) as TPurchaseItem[];
    return resp;
};

interface TUpdatedPurchase  {
    updatedBatch: TPurchase;
}
// Обновление записи
export const updatePurchase = async (id: number, data: TPurchaseData): Promise<TUpdatedPurchase> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-purchase/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    const resp: TUpdatedPurchase = (await response.json()) as TUpdatedPurchase;
    return resp;
};

// Обновление списка товаров
export const updatePurchaseItems = async (id: number, data: TPurchaseItem[]): Promise<TPurchaseItem[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-items-batch/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    const resp: TPurchaseItem[] = (await response.json()) as TPurchaseItem[];
    return resp;
};

export const getItemsPurchaseReturn = (param: {
    filterParam?: TPurchaseItemFilter;
}): Promise<TPurchaseItem[]> => {
    const response = HttpService.post<TPurchaseItem[]>(
        `/api/items-batch-return`,
        param.filterParam ?? { searchCriteria: {} }
    );
    return response;
};


// Удаление записи
export const deletePurchase = async (id: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch(`/api/delete-purchase/${id} `, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorResponse = await getErrorResponse(response);
            throw new ErrorResponse(errorResponse);
        }
        return response;
    };

// Удаление товара
export const deletePurchaseItem = async (id: number | null): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/delete-item-batch/${id} `, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    return response;
};

// Удаление товара
export const returnPurchaseItem = async (id: number | null): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/return-item-batch/${id} `, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    return response;
};
    

// Смена склада с серийником
export const changeWarehouseBySerial = async (warehouse: string | undefined, serialNumbers: string[] | null): Promise<object> => {
    const token = localStorage.getItem('token');
    const body = {warehouse, serialNumbers}
    const response = await fetch('/api/change-warehouse-by-serial-num', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    },
);
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    return response;
};

// Смена склада без серийника
export const changeWarehouseByName = async (warehouse: string | undefined, itemBatchId: number | null | undefined, quant: number | null): Promise<object> => {
    const token = localStorage.getItem('token');
    const body = {warehouse, itemBatchId, quant}
    const response = await fetch('/api/change-warehouse-by-name', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    },
);
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    return response;
};