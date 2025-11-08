import { HttpService } from '../system/HttpService';

import { TPageableResponse } from '../utils/types';
import { TSortParam } from './utils';
import { THistory, THistoryFilter } from 'types/history-types';

// Получение списка чеков
export const getHistory = (param: {
        page: number;
        size: number;
        sortParam?: TSortParam<THistory>[];
        filterParam?: THistoryFilter;
    }): Promise<TPageableResponse<THistory>> => {
        const response = HttpService.post<TPageableResponse<THistory>>(
            `/api/history/filter?page=${param.page}&size=${param.size}&sort=${
                param.sortParam
                    ?.map(sort => `${sort.fieldname},${sort.isAsc ? 'ASC' : 'DESC'}`)
                    .join('&sort=') ?? ''
            }` /* body */,
    
            param.filterParam ?? { searchCriteria: {} }
        );
        return response;
    };

