import { HttpService } from '../system/HttpService';
import { TAccount, TCategory, TContractor, TDeliver, TUser, TWarehouse } from '../types/settings-types.ts';

import { ErrorResponse, getErrorResponse } from './utils';

export const getAccounts = async (
        getCallback: (arg0: TAccount[]) => void
    ) => {
        await HttpService.get<TAccount[]>('/api/accounts/all')
            .then((response) => {
                getCallback(response);
            })
            .catch(() => {
                console.log('failed');
            });
    };

export const updateAccounts = async (data: TAccount[]): Promise<TAccount[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-accounts`, {
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
    const resp: TAccount[] = (await response.json()) as TAccount[];
    return resp;
};

export const deleteAccount = async (accountId: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/delete-account/${accountId}`, {
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

export const getCategories = async (
    getCallback: (arg0: TCategory[]) => void
) => {
    await HttpService.get<TCategory[]>('/api/categories/all')
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};

export const updateCategories = async (data: TCategory[]): Promise<TCategory[]> => {
    const token = localStorage.getItem('token');
const response = await fetch(`/api/update-categories`, {
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
const resp: TCategory[] = (await response.json()) as TCategory[];
return resp;
};

export const deleteCategory = async (id: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
const response = await fetch(`/api/delete-category/${id}`, {
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

export const getWarehouses = async (
    getCallback: (arg0: TWarehouse[]) => void
) => {
    await HttpService.get<TWarehouse[]>('/api/warehouses/all')
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};

export const updateWarehouses = async (data: TWarehouse[]): Promise<TWarehouse[]> => {
    const token = localStorage.getItem('token');
const response = await fetch(`/api/update-warehouses`, {
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
const resp: TWarehouse[] = (await response.json()) as TWarehouse[];
return resp;
};

export const deleteWarehouse = async (warehouseId: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
const response = await fetch(`/api/delete-warehouse/${warehouseId}`, {
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

export const getUsers = async (
    getCallback: (arg0: TUser[]) => void
) => {
    await HttpService.get<TUser[]>('/api/users/all')
        .then((response) => {
            getCallback(response);
        })
        .catch(() => {
            console.log('failed');
        });
};

export const updateUsers = async (data: TUser[]): Promise<TUser[]> => {
    const token = localStorage.getItem('token');
const response = await fetch(`/api/update-users`, {
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
const resp: TUser[] = (await response.json()) as TUser[];
return resp;
};

export const deleteUser = async (id: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/delete-user/${id}`, {
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

export const updateContractors = async (data: TContractor[]): Promise<TContractor[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/update-contractors`, {
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
    const resp: TContractor[] = (await response.json()) as TContractor[];
    return resp;
    };
    
export const deleteContractor = async (contractorId: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/delete-contractor/${contractorId}`, {
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

    export const updateDelivers = async (data: TDeliver[]): Promise<TDeliver[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/update-delivers`, {
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
        const resp: TDeliver[] = (await response.json()) as TDeliver[];
        return resp;
        };
        
export const deleteDeliver = async (deliverId: number | undefined): Promise<object> => {
    const token = localStorage.getItem('token');
        const response = await fetch(`/api/delete-deliver/${deliverId}`, {
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