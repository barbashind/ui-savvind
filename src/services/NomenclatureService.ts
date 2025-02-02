import { HttpService } from '../system/HttpService';
import { TNomenclature, TNomenclatureFilter } from '../types/nomenclature-types';

import { IdLabel, TPageableResponse } from '../utils/types';
import { ErrorResponse, getErrorResponse, TSortParam } from './utils';

// Получение списка товаров
export const getNomenclatures = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TNomenclature>[];
        filterParam?: TNomenclatureFilter;
    }): Promise<TPageableResponse<TNomenclature>> => {
        const response = HttpService.post<TPageableResponse<TNomenclature>>(
            `/api/nomenclature/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

export const getNomenclature = async (
        id: number,
        getCallback: (arg0: TNomenclature) => void
    ) => {
        await HttpService.get<TNomenclature>('/api/nomenclature/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const addNomenclature = async (data: object): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch('/api/create-nomenclature', {
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

// Обновление записи
export const updateNomenclature = async (id: number | undefined, data: object): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-nomenclature/${id?.toString()}`, {
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

// Удаление записи
export const deleteNomenclature = async (id: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/delete-nomenclature/${id} `, {
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


// Получение типа продукта по наименованию
export const getProductType = async (
    label: string | undefined,
    getCallback: (arg0: IdLabel) => void
) => {
    await HttpService.get<IdLabel>('/api/productType/' + label)
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};

// Получение списка типов продукта 
export const getProductTypes = async (
    getCallback: (arg0: IdLabel[]) => void
) => {
    await HttpService.get<IdLabel[]>('/api/productType/all')
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};