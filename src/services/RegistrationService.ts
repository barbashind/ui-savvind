import { HttpService } from '../system/HttpService';
import { TNomenclature } from '../types/nomenclature-types';
import { TPurchaseReg, TPurchaseRegFilter, TPurchaseRegItem } from '../types/registration-types';

import { TPageableResponse } from '../utils/types';
import { TSortParam } from './utils';

// Получение списка заказов
export const getPurchasesReg = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<TPurchaseReg>[];
        filterParam?: TPurchaseRegFilter;
    }): Promise<TPageableResponse<TPurchaseReg>> => {
        const response = HttpService.post<TPageableResponse<TPurchaseReg>>(
            `/api/purchase-reg/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

export const getPurchaseReg = async (
        id: number,
        getCallback: (arg0: TPurchaseReg) => void
    ) => {
        await HttpService.get<TPurchaseReg>('/api/purchase-reg-by-id/' + id.toString())
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const getPurchaseRegItems = async (
        id: number,
        getCallback: (arg0: TPurchaseRegItem[]) => void
    ) => {
        await HttpService.get<TPurchaseRegItem[]>('/api/items-purchase-reg/' + id.toString())
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