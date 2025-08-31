import { TAnalyticData, TAnalyticDeliversData, TAnalyticFilter, TAnalyticGraphData, TAssetsData, TProdData, TProdDataFilter } from '../types/analytic-types';
import { HttpService } from '../system/HttpService';
import { TPurchaseItem } from '../types/product-purchase-types';
import { TCheck, TCheckFilter, TSale } from '../types/sales-types';

import { TPageableResponse } from '../utils/types';
import { ErrorResponse, getErrorResponse, TSortParam } from './utils';

// Получение списка чеков
export const getCheckes = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TCheck>[];
        filterParam?: TCheckFilter;
    }): Promise<TPageableResponse<TCheck>> => {
        const response = HttpService.post<TPageableResponse<TCheck>>(
            `/api/check/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

// Получение списка продаж
export const getSales = (param: {
    page: number;
    size: number;
    sortParam?: TSortParam<TSale>[];
    filterParam?: TCheckFilter;
}): Promise<TPageableResponse<TSale>> => {
    const response = HttpService.post<TPageableResponse<TSale>>(
        `/api/sales/filter?page=${param.page}&size=${param.size}&sort=${
            param.sortParam
                ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                .join('&sort=') ?? ''
        }` /* body */,
        param.filterParam ?? { searchCriteria: {} },
    );
    return response;
};

export const getSalesFilter = async (data: TCheckFilter): Promise<TSale[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/sales-return/filter', {
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
    const resp: TSale[] = (await response.json()) as TSale[];
    return resp;
};

export const getCheck = async (
        id: number,
        getCallback: (arg0: TCheck) => void
    ) => {
        await HttpService.get<TCheck>('/api/sale-by-id/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getCheckSales = async (
        id: number,
        getCallback: (arg0: TSale[]) => void
    ) => {
        await HttpService.get<TSale[]>('/api/sales-by-id/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getCheckSalesBySerial = async (
        serialNumber: string | null,
        getCallback: (arg0: TSale) => void
    ) => {
        await HttpService.get<TSale>('/api/sales-by-serial/' + serialNumber)
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getProductBySerial = async (
        serial: string | null | undefined,
        getCallback: (arg0: TPurchaseItem | null) => void
    ) => {
        await HttpService.get<TPurchaseItem>('/api/product-by-serial/' + serial)
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
                getCallback(null);
            });
    };

    interface TCreatedCheck  {
        createdCheck: TCheck;
    }
    type TCheckData = TCheck & {
        body: TSale[];
    };

    // Создание записи
    export const addCheck = async (data: TCheckData): Promise<TCreatedCheck> => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/create-check', {
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
        const resp: TCreatedCheck = (await response.json()) as TCreatedCheck;
        return resp;
    };

// Добавление товаров
export const addCheckSales = async (data: TSale[]): Promise<TSale[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/create-items-check', {
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
    const resp: TSale[] = (await response.json()) as TSale[];
    return resp;
};

// Удаление товаров
export const deleteCheckSales = async (checkId : number | undefined, data: TSale[]): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/check-items-delete/${checkId}`, {
        method: 'DELETE',
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
    return response;
    
};

// Удаление товаров
export const deleteCheck = async (checkId : number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/check-delete/${checkId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorResponse = await getErrorResponse(response);
        throw new ErrorResponse(errorResponse);
    }
    return response;
    
};

export const updateCheck = async (checkId : number | undefined, data : TCheck): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-check/${checkId}`, {
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
    return response;
    
};


    export const getAnalytics = async (data : TAnalyticFilter): Promise<TAnalyticData[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/analytic-by-users', {
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
        const resp: TAnalyticData[] = (await response.json()) as TAnalyticData[];
        return resp;
    };

    export const getAnalyticsGraph = async (data : TAnalyticFilter): Promise<TAnalyticGraphData[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/analytic-graph', {
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
        const resp: TAnalyticGraphData[] = (await response.json()) as TAnalyticGraphData[];
        return resp;
    };

    export const getAnalyticsAssets = async (data : TAnalyticFilter): Promise<TAssetsData> => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/analytic-assets', {
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
        const resp: TAssetsData = (await response.json()) as TAssetsData;
        return resp;
    };

export const getAnalyticsDeliver = async (
    getCallback: (arg0: TAnalyticDeliversData[]) => void
) => {
    await HttpService.get<TAnalyticDeliversData[]>('/api/analytic-delivers')
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};


export const getAnalyticProd = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TProdData>[];
        filterParam?: TProdDataFilter;
    }): Promise<TPageableResponse<TProdData>> => {
        const response = HttpService.post<TPageableResponse<TProdData>>(
            `/api/analytic-prod/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

interface Debt {
    isUnpaid?: number;
    isBooked?: number;
}
export const getDebtSales = async (
        getCallback: (arg0: Debt) => void
    ) => {
        await HttpService.get<Debt>('/api/sales-dept')
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };
