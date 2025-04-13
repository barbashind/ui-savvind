export interface TRouteTarget {
        main: string;
        nomenclature: string;
        sales: string;
        product_registration: string;
        product_purchase: string;
        product_warehouse: string;
        accounting: string;
        login: string;
        settings: string;
        analytics: string;
    }

export const routeTarget: TRouteTarget = {
       
        main: '/gorbushka',
        nomenclature: 'nomenclature',
        sales: 'sales',
        product_registration: 'registration',
        product_purchase: 'purchase',
        product_warehouse: 'warehouse',
        accounting: 'accounting',
        login: 'login',
        settings: 'settings',
        analytics: 'analytics',
    };