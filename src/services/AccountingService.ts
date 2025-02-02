import { HttpService } from '../system/HttpService';
import { TAccounting, TAccountingFilter } from '../types/accounting-types.ts';

import { TPageableResponse } from '../utils/types';
import { ErrorResponse, getErrorResponse, TSortParam } from './utils';

export const getAccountings = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TAccounting>[];
        filterParam?: TAccountingFilter;
    }): Promise<TPageableResponse<TAccounting>> => {
        const response = HttpService.post<TPageableResponse<TAccounting>>(
            `/api/accounting/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

export const getAccounting = async (
        id: number,
        getCallback: (arg0: TAccounting) => void
    ) => {
        await HttpService.get<TAccounting>('/api/accounting/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const addAccounting = async (data: object): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch('/api/create-accounting', {
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
        const resp: object = (await response.json()) as Promise<object>;
        return resp;
    };

export const updateAccounting = async (id : number | undefined, data: object): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch(`/api/update-accounting/${id}`, {
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
        const resp: object = (await response.json()) as Promise<object>;
        return resp;
    };

export const deleteAccounting = async (id : number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch(`/api/delete-accounting/${id}`, {
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
        const resp: object = (await response.json()) as Promise<object>;
        return resp;
    };