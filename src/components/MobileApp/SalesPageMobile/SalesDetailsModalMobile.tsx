import React, { useEffect, useRef, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { Combobox } from '@consta/uikit/Combobox';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { IconClose } from '@consta/icons/IconClose';
import { IconAllDone } from '@consta/icons/IconAllDone';

import { IconAdd } from "@consta/icons/IconAdd";
import { TProduct } from "../../../types/product-purchase-types";
import { TNomenclature } from "../../../types/nomenclature-types";
import { TCheck, TSale } from "../../../types/sales-types";
import { IconTrash } from "@consta/icons/IconTrash";
import { TCaption } from "../../../utils/types";
import { addCheck, addCheckSales, deleteCheck, deleteCheckSales, getCheck, getCheckSales, getProductBySerial, updateCheck } from "../../../services/SalesService";
import { getNomenclatures } from "../../../services/PurchaseService";
import { getUserInfo } from "../../../services/AuthorizationService";
import { TAccount, TUser } from "../../../types/settings-types";
import { getAccounts, getUsers } from "../../../services/SettingsService";
import { Select } from "@consta/uikit/Select";
import { Tooltip } from "../../global/Tooltip";
import { Direction, Position } from "@consta/uikit/Popover";
import { SnackBar } from '@consta/uikit/SnackBar';

import errorAudio from '../../../assets/Audio/errorSignal.mp3';
import checkProductAudio from '../../../assets/Audio/checkProduct.mp3';
import { formatNumber } from "../../../utils/formatNumber";

interface TSalesDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        checkId: number | undefined;
        setCheckId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }
export type Partner = {
        partner: string;
        summPartner: number;
}

const SalesDetailsModalMobile = ({isOpen, setIsOpen, checkId, setCheckId,  setUpdateFlag} : TSalesDetailsModalProps) => {
        const defaultData : TCheck = {
                checkId: undefined,
                summ: null,
                isBooking: null,
                isUnpaid: null,
                account: 'Деньги в офисе',
                customer: undefined,
                createdAt: null,
                updatedAt: null,
                isCancelled: null,
                seller: null,
                courier: null,
        }
        const defaultItem : TSale = {
                saleId: null,
                checkId: undefined,
                itemId: undefined,
                customer: undefined,
                salePrice: null,
                name: null,
                serialNumber: null,
                createdAt: null,
                updatedAt: null,
        }

        const closeWindow = () => {
                setData(defaultData);
                setSales([defaultItem]);
                setIsOpen(false);
                setCheckId(undefined);
        }
        const [data, setData] = useState<TCheck>(defaultData);
        const [productList, setProductList] = useState<TProduct[]>([]);
        const [sales, setSales] = useState<TSale[]>([defaultItem]);
        const [salesDef, setSalesDef] = useState<TSale[]>([defaultItem]);
        const [isLoading, setIsLoading] = useState<boolean>(checkId ? true : false);
        const [captionList, setCaptionList] = useState<TCaption[]>([]);

        const [role, setRole] = useState<string | undefined>(undefined);
        const serialRef = useRef<HTMLInputElement>(null);
    
    // Преобразование при получении данных
    const transformFromResponse = (response: TSale[]): TSale[] => {
        const groupedRecords: { [key: string]: TSale } = {};
    
        response.filter(item => !item.serialNumber)?.forEach(record => {
            const key = record.itemId ?? 1; // Используйте уникальное поле для группировки, например, по имени
            if (!groupedRecords[key]) {
                groupedRecords[key] = { ...record, quant: 0 };
            }
            if (groupedRecords[key]?.quant !== undefined && groupedRecords[key]?.quant !== null) {
                        groupedRecords[key].quant += 1
            }
        });
        const finalRecords = Object.values(groupedRecords).concat(
                response.filter(item => item.serialNumber)
            );
        
        return finalRecords;
    };
        
        // Инициализация данных
        useEffect(() => {
                if (checkId) {
                        setIsLoading(true);
                } else {
                        setIsLoading(false);
                }
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setRole(resp.role);
                        })
                };
                
                void getUserInfoData();
        }, [checkId, isOpen, setIsLoading]);

        useEffect(() => {
                const getData = async (id : number) => {
                        await getCheck(id, ((resp) => {
                                setData(resp)
                        }))
                }
                const getItems = async (id : number) => {
                        await getCheckSales(id, ((resp) => {
                                setSales(transformFromResponse(resp));
                        }))
                }

                const getItemsDef = async (id : number) => {
                        await getCheckSales(id, ((resp) => {
                                setSalesDef(resp);
                        }))
                }

                const getProducts = async () => {
                                        await  getNomenclatures((resp) => {
                                                setProductList(resp.map((item : TNomenclature) => ({name: item.name, hasSerialNumber: item.hasSerialNumber, itemId: item.itemId, costPrice: item.lastCostPrice, weight: item.weight, productPrice: item.productPrice})));
                                                setIsLoading(false);
                                            });
                                        }

                if (checkId) {
                        getItems(checkId);  
                        getItemsDef(checkId);
                        getData(checkId).then(
                                () => {
                                setIsLoading(false);
                        });
                }
                if (serialRef.current) {
                        const inputSerial = serialRef.current?.getElementsByTagName('input');
                        if (inputSerial) {
                                inputSerial[0].focus();
                        }
                    }
                getProducts();
                
            }, [checkId, setData, isOpen]);

        
        useEffect(() => {
                if (serialRef.current) {
                        const inputSerial = serialRef.current?.getElementsByTagName('input');
                        if (inputSerial && sales?.length) {
                                inputSerial[0].focus();
                        }
                    }
        }, [sales?.length])
        

        const getProduct = async (e: React.FocusEvent<HTMLElement, Element> , item: TSale) => {
                e.preventDefault();
                        await getProductBySerial(item.serialNumber, (resp) => {
                                if (resp && !resp.isSaled && sales.filter((elem)=> (elem.serialNumber === item.serialNumber))?.length === 1) {

                                        const audio = new Audio(checkProductAudio);
                                        audio.play(); 
                                        setSales(prev => 
                                                prev.map(product => (sales.indexOf(product) === sales.indexOf(item)) ? 
                                                        { ...product, 
                                                        itemId: resp.itemId, 
                                                        name: resp.name,
                                                        partner: resp.partner,
                                                        caption: null,
                                                        salePrice: productList.find(el => (el.itemId === resp.itemId))?.productPrice ?? 0,
                                                        } : product
                                                )
                                                );
                                        if (sales?.indexOf(item) === (sales?.length - 1)) {
                                                setSales(prev => [...prev, 
                                                defaultItem
                                        ]);
                                        }
                                        
                                } else {
                                        const audio = new Audio(errorAudio);
                                        audio.play();  
                                        if (sales.filter((elem)=> (elem.serialNumber === item.serialNumber))?.length > 1) {
                                                setSales(prevProducts => 
                                                        prevProducts.map(product => 
                                                                (sales?.indexOf(product) === sales?.indexOf(item)) ? { ...product, serialNumber:  null } : product
                                                        )
                                                );
                                                setCaptionList((prev) => [...prev, {state: "serialNumber", index : sales.indexOf(item), caption: 'Сер. ном. уже использовался'}])
                                        }
                                }
                        });
                               
                }
        
        const getPartners = (sales: TSale[]): Partner[] => {
                return Object.values(
                            sales.reduce((acc, sale) => {
                                // Пропускаем пустые партнеры
                                if (!sale.partner) return acc;
                    
                                // Если партнер уже существует, суммируем salePrice
                                if (acc[sale.partner]) {
                                    acc[sale.partner].summPartner += Number(sale.salePrice ?? 0);
                                } else {
                                    // Создаем новый объект для уникального партнера
                                    acc[sale.partner] = {
                                        partner: sale.partner,
                                        summPartner: Number(sale.salePrice ?? 0),
                                    };
                                }
                    
                                return acc;
                            }, {} as Record<string, Partner>)
                        );
                    };
        
        
        const createCheck  = async (e: React.MouseEvent<Element, MouseEvent>) => {
                setIsLoading(true);
                e.preventDefault();
                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0);
                                const partners = getPartners(sales);
                                const body = sales?.filter((item => (!!item.itemId)));
                                try {
                                        await addCheck({
                                                customer: data.customer ?? '-',
                                                summ: totalSum,
                                                isBooking: data.isBooking,
                                                isUnpaid: data.isUnpaid,
                                                createdAt: data.createdAt,
                                                updatedAt: data.updatedAt,
                                                body: body,
                                                partners: partners,
                                                isCancelled: null,
                                                seller: data.seller,
                                                courier: data.courier,
                                                account: data.account,
                                        }).then(async(resp) => {
                
                                                
                                                // Создаем новый массив с обновленным checkId
                                                const transformedRecords: TSale[] = [];
    
                                                sales?.filter((item => (!!item.itemId)))?.forEach(record => {
                                                const quantity = record.quant || 1; // Если quant пустой, то по умолчанию 1
                                                for (let i = 0; i < quantity; i++) {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { quant, ...rest } = record; // Удаляем поле quant
                                                        transformedRecords.push(rest);
                                                }
                                                });

                                                const updatedItemsCheck = transformedRecords?.map(product => ({
                                                ...product,
                                                checkId: resp.createdCheck.checkId,
                                                customer: resp.createdCheck.customer,
                                                }));
                
                                                // Теперь отправляем обновленный массив с checkId
                                                const body = updatedItemsCheck;
                                                await addCheckSales(body).then(()=>{
                                                                setData(resp.createdCheck);
                                                                setUpdateFlag(true);     
                                                                setCheckId(resp.createdCheck.checkId)   
                                                });
                                                setIsLoading(false);
                                        })
                
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } catch (error : any) {
                                        console.error('Ошибка при создании партий или элементов:', error);
                                        setCaptionList(error?.response?.errors)
                                        setIsLoading(false);
                                }
                        }
                        
        const createBooking  = async (e: React.MouseEvent<Element, MouseEvent>) => {
                                setIsLoading(true);
                                e.preventDefault();
                                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0);
                                                const body = sales?.filter((item => (!!item.itemId)));
                                                // const partners = getPartners(sales);
                                                try {
                                                        await addCheck({
                                                                customer: data.customer ?? '-',
                                                                summ: totalSum,
                                                                isBooking: true,
                                                                isUnpaid: data.isUnpaid,
                                                                createdAt: data.createdAt,
                                                                updatedAt: data.updatedAt,
                                                                body: body,
                                                                isCancelled: null,
                                                                seller: data.seller,
                                                                courier: data.courier,
                                                                account: data.account,
                                                                // partners: partners,
                                                        }).then(async(resp) => {
                                
                                                                
                                                                // Создаем новый массив с обновленным checkId
                                                                const transformedRecords: TSale[] = [];
                    
                                                                sales?.filter((item => (item.itemId)))?.forEach(record => {
                                                                const quantity = record.quant || 1; // Если quant пустой, то по умолчанию 1
                                                                for (let i = 0; i < quantity; i++) {
                                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                                        const { quant, ...rest } = record; // Удаляем поле quant
                                                                        transformedRecords.push(rest);
                                                                }
                                                                });
                
                                                                const updatedItemsCheck = transformedRecords?.map(product => ({
                                                                ...product,
                                                                checkId: resp.createdCheck.checkId,
                                                                customer: resp.createdCheck.customer,
                                                                }));
                                
                                                                // Теперь отправляем обновленный массив с checkId
                                                                const body = updatedItemsCheck;
                                                                await addCheckSales(body).then(()=>{
                                                                                setData(resp.createdCheck);
                                                                                setUpdateFlag(true);     
                                                                                setCheckId(resp.createdCheck.checkId)   
                                                                });
                                                                setIsLoading(false);
                                                        })
                                
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                } catch (error : any) {
                                                        console.error('Ошибка при создании партий или элементов:', error);
                                                        setCaptionList(error?.response?.errors)
                                                        setIsLoading(false);
                                                }
        }
        
        const createUnpaid  = async (e: React.MouseEvent<Element, MouseEvent>) => {
                setIsLoading(true);
                e.preventDefault();
                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0);
                                const body = sales?.filter((item => (!!item.itemId)));
                                // const partners = getPartners(sales);
                                try {
                                        await addCheck({
                                                customer: data.customer ?? '-',
                                                summ: totalSum,
                                                isBooking: data.isBooking,
                                                isUnpaid: true,
                                                createdAt: data.createdAt,
                                                updatedAt: data.updatedAt,
                                                body: body,
                                                isCancelled: null,
                                                seller: data.seller,
                                                courier: data.courier,
                                                account: data.account,
                                                // partners: partners
                                        }).then(async(resp) => {
                
                                                
                                                // Создаем новый массив с обновленным checkId
                                                const transformedRecords: TSale[] = [];
    
                                                sales?.filter((item => (item.itemId)))?.forEach(record => {
                                                const quantity = record.quant || 1; // Если quant пустой, то по умолчанию 1
                                                for (let i = 0; i < quantity; i++) {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { quant, ...rest } = record; // Удаляем поле quant
                                                        transformedRecords.push(rest);
                                                }
                                                });

                                                const updatedItemsCheck = transformedRecords?.map(product => ({
                                                ...product,
                                                checkId: resp.createdCheck.checkId,
                                                customer: resp.createdCheck.customer,
                                                }));
                
                                                // Теперь отправляем обновленный массив с checkId
                                                const body = updatedItemsCheck;
                                                await addCheckSales(body).then(()=>{
                                                                setData(resp.createdCheck);
                                                                setUpdateFlag(true);     
                                                                setCheckId(resp.createdCheck.checkId)   
                                                });
                                                setIsLoading(false);
                                        })
                
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } catch (error : any) {
                                        console.error('Ошибка при создании партий или элементов:', error);
                                        setCaptionList(error?.response?.errors)
                                        setIsLoading(false);
                                }
}



const deleteCheckData = async (checkId: number | undefined, sales : TSale[]) => {
        setIsLoading(true);
        await deleteCheckSales(checkId, sales).then(()=>{
                deleteCheck(checkId).then(()=> {
                        setUpdateFlag(true);
                        setIsOpen(false);
                        setIsLoading(false);
                });
                
        })
}

const updateCheckUnpaidData = async (checkId : number | undefined, isEnding : boolean | undefined) => {
        try {
                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0);
                const partners = getPartners(salesDef);
                await updateCheck(checkId, {
                        customer: data.customer ?? '-',
                        summ: totalSum,
                        isBooking: false,
                        isUnpaid: true,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        isCancelled: null,
                        partners: partners,
                        isEnding: isEnding,
                        seller: data.seller,
                        courier: data.courier,
                        account: data.account,
        }).then(() => {
                setUpdateFlag(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })} catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.errors)
                        setIsLoading(false);
        }
        
}

const updateCheckData = async (checkId : number | undefined, isEnding : boolean | undefined) => {
        try {
                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0);
                const partners = getPartners(salesDef);
                await updateCheck(checkId, {
                        customer: data.customer ?? '-',
                        summ: totalSum,
                        isBooking: false,
                        isUnpaid: false,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        isCancelled: null,
                        partners: partners,
                        isEnding: isEnding,
                        seller: data.seller,
                        courier: data.courier,
                        account: data.account,
        }).then(() => {
                setUpdateFlag(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })} catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.errors)
                        setIsLoading(false);
        }
        
}

const updateCheckExtraData = async (checkId : number | undefined) => {
        try {
                await updateCheck(checkId, {
                        customer: data.customer ?? '-',
                        summ: data.summ,
                        isBooking: data.isBooking,
                        isUnpaid: data.isUnpaid,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        isCancelled: data.isCancelled,
                        partners: data.partners,
                        isEnding: data.isEnding,
                        seller: data.seller,
                        courier: data.courier,
                        account: data.account,
        }).then(() => {
                setUpdateFlag(true)
                setTextInfo('Данные успешно обновлены')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })} catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.errors)
                        setIsLoading(false);
        }
        
}

                
const ruToEnMap: Record<string, string> = {
        а: 'F', б: ',', в: 'D', г: 'U', д: 'L', е: 'T', ё: '`', ж: ';', з: 'P',
        и: 'B', й: 'Q', к: 'R', л: 'K', м: 'V', н: 'Y', о: 'J', п: 'G', р: 'H',
        с: 'C', т: 'N', у: 'E', ф: 'A', х: '[', ц: 'W', ч: 'X', ш: 'I', щ: 'O',
        ы: 'S', э: '\'', ь: 'M', ю: '.', я: 'Z',
        А: 'F', Б: ',', В: 'D', Г: 'U', Д: 'L', Е: 'T', Ё: '`', Ж: ';', З: 'P',
        И: 'B', Й: 'Q', К: 'R', Л: 'K', М: 'V', Н: 'Y', О: 'J', П: 'G', Р: 'H',
        С: 'C', Т: 'N', У: 'E', Ф: 'A', Х: '[', Ц: 'W', Ч: 'X', Ш: 'I', Щ: 'O',
        Ы: 'S', Э: '\'', Ь: 'M', Ю: '.', Я: 'Z',
    };
        
const convertRuToEn = (value : string) => {
        return value.split('').map(char => ruToEnMap[char] || char).join('').toUpperCase();
        };        

const [users, setUsers] = useState<TUser[]>([]);

useEffect(() => {
        const getUsersData = async () => {
                await getUsers((resp) => {
                        setUsers(resp.map((item : TUser) => ({
                                id: item.id, 
                                username: item.username, 
                                role: item.role, 
                        })))
                });
        }
        void getUsersData().then(()=>{
                setIsLoading(false);
        });
}, [])

const [accounts, setAccounts] = useState<TAccount[]>([]);
useEffect(() => {
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, currency: item.currency})))
                        })
                }
                
                void getAccountsData();
}, [])

const [tooltipPosition, setTooltipPosition] = useState<Position>(undefined);
const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);
const [arrowDir, setArrowDir] = useState<Direction>('upLeft');

const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);
        return formattedDate;
    };

const [textInfo, setTextInfo] = useState<string | null>(null);

        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onEsc={() => {
                                closeWindow();
                        }}
                        style={{width: '75%'}}
                >
                        {!isLoading && (
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xs' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Layout direction="row" >
                                                <Text size="s" view="brand" style={{width: '100%'}} className={cnMixSpace({ mL:'xs', })}>
                                                        {checkId ? 'Чек № ' +  data.checkId?.toString() + (data.isBooking ? ' (Бронь)' : data.isUnpaid ? ' (Не оплачен)' : '') : 'Оформление чека'}
                                                </Text>
                                        </Layout>
                                        
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        setIsOpen(false);
                                                        setIsLoading(true);
                                                        setData(defaultData);
                                                        setCheckId(undefined);
                                                        setSales([defaultItem]);
                                                }}
                                        />
                                </Layout>

                                {/* Шапка */}
                                
                                <Layout direction="column">
                                {sales?.length > 0 && !checkId && sales?.map(itemCheck => (
                                                                <Layout key={sales.indexOf(itemCheck).toString()} direction="row" style={{alignItems: 'center'}} className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({  mH:'s' })}>{(sales.indexOf(itemCheck) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                                <Combobox
                                                                                                        items={productList?.filter(el => (!el.hasSerialNumber))?.map(element => ({id: element.itemId ?? 0, label: element.name ?? ''}))}
                                                                                                        size="s"
                                                                                                        placeholder="Товар"
                                                                                                        value={itemCheck.name && itemCheck.itemId ? {id: itemCheck.itemId, label: itemCheck.name} : undefined} 
                                                                                                        style={{ width: '100%'}}
                                                                                                        onChange={(value)=>{
                                                                                                                if (value) {
                                                                                                                                setSales(prev => 
                                                                                                                                prev.map(product => (sales.indexOf(product) === sales.indexOf(itemCheck)) ? 
                                                                                                                                        { ...product, 
                                                                                                                                        itemId: value.id, 
                                                                                                                                        name: value.label,
                                                                                                                                        hasSerialNumber: productList.find(el => (el.itemId === value.id))?.hasSerialNumber ?? false,
                                                                                                                                        caption: null,
                                                                                                                                        salePrice: productList.find(el => (el.itemId === value.id))?.productPrice ?? 0,
                                                                                                                                        } : product
                                                                                                                                )
                                                                                                                                );
                                                                                                                } else {
                                                                                                                        setSales(prevProducts => 
                                                                                                                                prevProducts.map(product => 
                                                                                                                                        (sales.indexOf(product) === sales.indexOf(itemCheck)) ? { ...product, productId: undefined, name: null, itemId: undefined, costPrice: 0, hasSerialNumber: false, caption: null } : product
                                                                                                                                )
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
                                                                                                        disabled = {!!itemCheck.serialNumber}
                                                                                                        onMouseMove={(event) => {
                                                                                                                const target = event.target as HTMLElement;
                                                                                                                const rect = target.getBoundingClientRect();
                                                                                                                if (target.classList.contains('Select-Input')) {
                                                                                                                        setTooltipPosition({
                                                                                                                        x: rect.right - (target.clientWidth * 0.5),
                                                                                                                        y: rect.top,
                                                                                                                    });
                                                                                                                    setTooltipText(itemCheck?.name ?? undefined)
                                                                                                                    setArrowDir('upCenter')
                                                                                                                }
                                                                                                            }}
                                                                                                        onMouseLeave={() => {
                                                                                                        setTooltipPosition(undefined);
                                                                                                        setTooltipText(undefined)
                                                                                                        }}

                                                                                                /> 
                                                                                                <Tooltip
                                                                                                        direction={arrowDir ?? 'upCenter'}
                                                                                                        spareDirection={arrowDir ?? 'upCenter'}
                                                                                                        position={tooltipPosition}
                                                                                                        className="tooltip"
                                                                                                        classNameArrow="tooltipArrow"
                                                                                                >
                                                                                                        <Text
                                                                                                                size="xs"
                                                                                                                style={{zoom: 'var(--zoom)', maxWidth: '238px'}}
                                                                                                        >
                                                                                                                {tooltipText}
                                                                                                        </Text>
                                                                                                </Tooltip> 
                                                                                        </div>      

                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                id={`serialNumber ${sales.indexOf(itemCheck)}`}
                                                                                                value={itemCheck.serialNumber ?? null}
                                                                                                placeholder="Серийный номер"
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                const convertedValue = convertRuToEn(value);
                                                                                                                const filteredValue = convertedValue.replace(/[^a-zA-Z0-9-]/g, '');
                                                                                                                setSales(prev => 
                                                                                                                        prev.map(product => (sales.indexOf(product) === sales.indexOf(itemCheck)) ? 
                                                                                                                                { ...product, 
                                                                                                                                        serialNumber: filteredValue, 
                                                                                                                                } : product
                                                                                                                        )
                                                                                                                        );
                                                                                                        } else {
                                                                                                                setSales(prevProducts => 
                                                                                                                        prevProducts.map(product => 
                                                                                                                                (sales?.indexOf(product) === sales?.indexOf(itemCheck)) ? { ...product, serialNumber:  null } : product
                                                                                                                        )
                                                                                                                );
                                                                                                        }
                                                                                                }}
                                                                                                // style={{minWidth:'100px', maxWidth:'100px'}} 
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                                onBlur={(e)=>{
                                                                                                        if (itemCheck.serialNumber) {
                                                                                                                getProduct(e, itemCheck);
                                                                                                        }
                                                                                                }}
                                                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                                                onKeyPress={async (event: any) => {
                                                                                                        if (event.key === 'Enter') {
                                                                                                                if (itemCheck.serialNumber) {
                                                                                                                        getProduct(event, itemCheck);
                                                                                                                        
                                                                                                                        
                                                                                                                        if (sales.filter((elem)=> (elem.serialNumber === itemCheck.serialNumber))?.length > 1) {
                                                                                                                                setSales(prevProducts => 
                                                                                                                                        prevProducts.map(product => 
                                                                                                                                                (sales?.indexOf(product) === sales?.indexOf(itemCheck)) ? { ...product, serialNumber:  null } : product
                                                                                                                                        )
                                                                                                                                );
                                                                                                                                setCaptionList((prev) => [...prev, {state: "serialNumber", index : sales.indexOf(itemCheck), caption: 'Сер. ном. уже использовался'}])
                                                                                                                        }
                                                                                                        }
                                                                                                }}}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck)))) ? captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "serialNumber") || (capt.index !== sales.indexOf(itemCheck))))}}
                                                                                                ref={serialRef}
                                                                                                disabled={!!itemCheck.itemId}
                                                                                        />  

                                                                                        <Layout  style={{minWidth:'38px', maxWidth:'38px', justifyContent: 'center'}} className={cnMixSpace({ mL:'m' })}>
                                                                                                        {!!itemCheck.serialNumber && itemCheck.itemId ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : !!itemCheck.serialNumber && !itemCheck.itemId ?  (<IconClose view="alert" style={{alignSelf: 'center'}}/>) : <></>}
                                                                                        </Layout>
                                                                                        
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.quant?.toString()}
                                                                                                type='number'
                                                                                                placeholder="Кол-во"
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setSales(prev => 
                                                                                                                prev.map(product => (sales.indexOf(product) === sales.indexOf(itemCheck)) ? 
                                                                                                                        { ...product, 
                                                                                                                                quant: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setSales(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (sales?.indexOf(product) === sales?.indexOf(itemCheck)) ? { ...product, quant:  null } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck)))) ? captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{
                                                                                                        setCaptionList(prev => prev?.filter(capt => ((capt.state !== "quant") || (capt.index !== sales.indexOf(itemCheck))) ))
                                                                                                }}
                                                                                                disabled={!!itemCheck.serialNumber}
                                                                                        />
                                                                                        
                                                                                        <Layout direction="row" style={{alignItems: 'center'}} className={cnMixSpace({ mT:'xs' })}>
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.salePrice?.toString()}
                                                                                                type='number'
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setSales(prev => 
                                                                                                                prev.map(product => (sales.indexOf(product) === sales.indexOf(itemCheck)) ? 
                                                                                                                        { ...product, 
                                                                                                                                salePrice: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setSales(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (sales.indexOf(product) === sales.indexOf(itemCheck)) ? { ...product, salePrice:  null } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                onBlur={()=> {
                                                                                                        setSales(prev => 
                                                                                                                prev.map(product => (product.itemId === itemCheck.itemId && !product.salePrice) ? 
                                                                                                                        { ...product, 
                                                                                                                                salePrice: itemCheck.salePrice, 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                }}
                                                                                                placeholder="Цена"
                                                                                        />
                                                                                        <Text size="s" className={cnMixSpace({ mL:'xs' })}>
                                                                                                руб
                                                                                        </Text>
                                                                                        </Layout>
                                                                                        <Layout direction="row" style={{justifyContent: 'center'}}>
                                                                                                <Button 
                                                                                                        view='secondary'
                                                                                                        label={'Убрать позицию'}
                                                                                                        iconLeft={IconTrash} 
                                                                                                        style={{color: '#D42A2A', borderColor: '#D42A2A'}}
                                                                                                        onClick={()=>{
                                                                                                        setSales(sales?.filter(item=>(sales.indexOf(item) !== sales.indexOf(itemCheck))))}}
                                                                                                        className={cnMixSpace({ mT:'m' })}
                                                                                                        size="s"
                                                                                                /> 
                                                                                        </Layout>
                                                                                        
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
                                                {sales?.length > 0 && checkId && sales?.map(itemCheck => (
                                                                <Layout direction="row" className={cnMixSpace({ mT:'s' })} style={{alignItems:'center'}}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({  mH:'m' })}>{(sales.indexOf(itemCheck) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <Text  style={{ width: '100%' }} weight="bold" size="xs">{itemCheck.name && itemCheck.itemId ? itemCheck?.name : ''}</Text>
                                                                                        <Text className={cnMixSpace({ mT:'2xs' })} style={{alignContent: 'center'}}  truncate size="xs">{itemCheck?.serialNumber ?? null}</Text>
                                                                                        <Text className={cnMixSpace({ mT:'2xs' })} style={{minWidth:'100px', maxWidth:'100px', alignContent: 'center'}} >{itemCheck?.quant ?? null}</Text>
                                                                                        <Layout direction="column"  style={{minWidth:'204px', maxWidth:'204px'}}>
                                                                                                <Text size='s'>{'Цена: ' + formatNumber(itemCheck?.salePrice ?? 0) + ' руб'}</Text>
                                                                                                {role !== 'KUR' && (<Text  view="secondary" size='xs' className={cnMixSpace({ mT:'2xs' })}>{'Закуп.цена: ' + formatNumber(itemCheck?.costPrice ?? '0') + ' руб'}</Text>)}
                                                                                                {role !== 'KUR' && (<Text view="secondary" size='xs' className={cnMixSpace({ mT:'2xs' })}>{'Прибыль: ' + formatNumber(Number((Number(itemCheck.salePrice) - Number(itemCheck.costPrice)) * Number(itemCheck.quant ?? 1)).toFixed(2))  + ' руб' + ' (' + Number(Number((Number(itemCheck.salePrice) - Number(itemCheck.costPrice)) * Number(itemCheck.quant ?? 1)) * 100 / Number(itemCheck.costPrice)).toFixed(2) + '%)' }</Text>)}
                                                                                        </Layout>
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
                                        {!checkId && (<Layout direction="row" style={{justifyContent: 'center'}}>
                                                <Button 
                                                        label={'Добавить товар'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        size="s"
                                                        className={cnMixSpace({ mV:'m' })}
                                                        onClick={()=>{
                                                                setSales(prev => [...prev, 
                                                                        defaultItem
                                                                ]);
                                                        }}
                                                />
                                        </Layout>
                                        )}
                                </Layout>

                                <Layout direction="row" style={{justifyContent: 'left'}}>
                                                <Text size="m"  weight='semibold' view="brand"  className={cnMixSpace({ mT:'2xs' })}>Общая сумма:</Text> 
                                                <Text size="m"  weight='semibold' view="brand" className={cnMixSpace({ mT:'2xs', mL:'xs' })}>{(sales?.length > 0 ? sales.reduce((acc, item) => acc + (item.quant ?? 1) * (Number(item.salePrice ?? 0)), 0).toString() : 0) + ' руб'}</Text>  
                                </Layout> 

                                <Layout direction="column" className={cnMixSpace({ mT:'xl' })} >
                                                        <Text size="s" className={cnMixSpace({ mB:'2xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Покупатель:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={data?.customer}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                                ...prev,
                                                                                customer:  value,
                                                                                }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        customer:  undefined,
                                                                                        }))       
                                                                        }
                                                                        
                                                                }}
                                                        />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mT:'s' })} >
                                                        <Text size="s" className={cnMixSpace({ mB:'2xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Продавец:</Text>
                                                        <Select 
                                                                size="s"
                                                                items={users?.filter(item => (item.role === 'SLR'))}
                                                                value={users?.find(item => (item.username === data.seller))}
                                                                getItemKey={item => item.id ?? '' }
                                                                getItemLabel={item => item.username ?? ''}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                        ...prev,
                                                                        seller:  value.username,
                                                                        }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        seller:  undefined,
                                                                                        }))       
                                                                        }
                                                                }}
                                                        />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mT:'s' })} >
                                                        <Text size="s" className={cnMixSpace({ mB:'2xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Курьер:</Text>
                                                        <Select
                                                                items={users?.filter(item => (item.role === 'KUR'))} 
                                                                size="s"
                                                                getItemKey={item => item.id ?? '' }
                                                                getItemLabel={item => item.username ?? ''}
                                                                value={users?.find(item => (item.username === data.courier))}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                        ...prev,
                                                                        courier:  value.username,
                                                                        }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        courier:  undefined,
                                                                                        }))       
                                                                        }
                                                                        
                                                                }}
                                                        />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mT:'s' })}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })}>Счет начисления:</Text>
                                                        <Combobox
                                                                items={accounts}
                                                                getItemLabel={(item)=> (item.name ?? '')}
                                                                getItemKey={(item) => (item.accountId ?? 0)}
                                                                value={accounts.find(el => (el.name === data?.account))}
                                                                size="s"
                                                                placeholder="Выберите счет"
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                                setData(prev => ({...prev, account: value?.name}))
                                                                        } else {
                                                                                setData(prev => ({...prev, account: undefined}))
                                                                        }
                                                                }}
                                                                className={cnMixSpace({mR:'m'})}
                                                        />       
                                        </Layout>
                                {textInfo && (
                                                <Layout direction="row" style={{justifyContent: 'right', alignItems: 'end'}}>
                                                        <SnackBar
                                                                items={ [{key: 1, message: textInfo, status: 'success', progressMode: "line"}] }
                                                                getItemAutoClose={() => (3)}
                                                                onItemAutoClose={()=> {setTextInfo(null)}}
                                                                getItemShowProgress = {(item) => item.progressMode === "line" ? item.progressMode : 'timer'}
                                                                onItemClose={() => {setTextInfo(null)}}
                                                                style={{position:'absolute'}}
                                                        />
                                                </Layout>
                                )}
                                                                       
                                        <Layout direction="column" className={cnMixSpace({ mT:'m' })} style={{alignItems: 'center'}}>
                                                
                                                {!checkId && (
                                                        <Button 
                                                                label={'Забронировать товар'}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mT:'m' })}
                                                                style={{width: '100%'}}
                                                                onClick={(e)=>{
                                                                        if (checkId) {
                                                                                // updateBatch(e, checkId);
                                                                        } else {
                                                                                createBooking(e);
                                                                        }
                                                                }}
                                                                disabled={!data.seller}
                                                                title={!data.seller ? "Укажите продавца" : ''}
                                                        />
                                                )}
                                                {!checkId && (
                                                        <Button 
                                                                label={'Отсрочка оплаты'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#f38b00', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={(e)=>{
                                                                        if (checkId) {
                                                                                // updateBatch(e, checkId);
                                                                        } else {
                                                                                createUnpaid(e)
                                                                        }
                                                                }}
                                                                disabled={!data.seller}
                                                                title={!data.seller ? "Укажите продавца" : ''}
                                                        />
                                                )}
                                                {checkId && data.isBooking && (
                                                        <Button 
                                                                label={'Завершить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                updateCheckData(checkId, true);
                                                                                closeWindow();
                                                                        }
                                                                }}
                                                                disabled={!data.seller}
                                                                title={!data.seller ? "Укажите продавца" : ''}
                                                        />
                                                )}
                                                {checkId && data.isBooking && (
                                                        <Button 
                                                                label={'Отменить бронь'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#eb5757', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                deleteCheckData(checkId, salesDef)
                                                                                closeWindow();
                                                                        } 
                                                                }}
                                                        />
                                                )}
                                                {checkId && data.isBooking && (
                                                        <Button 
                                                                label={'Отсрочка оплаты (при брони)'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#f38b00', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                updateCheckUnpaidData(checkId, false);
                                                                                closeWindow();
                                                                        }
                                                                }}
                                                        />
                                                )}
                                                {checkId && data.isUnpaid && (
                                                        <Button 
                                                                label={'Оплата внесена'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                updateCheckData(checkId, true);
                                                                                closeWindow();
                                                                        } else {
                                                                                // createUnpaid(e)
                                                                        }
                                                                }}
                                                        />
                                                )}
                                                 {checkId && data.isUnpaid && (
                                                        <Button 
                                                                label={'Отменить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#eb5757', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                deleteCheckData(checkId, salesDef)
                                                                                closeWindow();
                                                                        } 
                                                                }}
                                                        />
                                                )}
                                                {!checkId && (
                                                        <Button 
                                                                label={'Завершить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={(e)=>{
                                                                                createCheck(e);
                                                                }}
                                                                disabled={!data.seller}
                                                                title={!data.seller ? "Укажите продавца" : ''}
                                                        />
                                                )}
                                                {checkId && !data.isBooking && !data.isUnpaid &&
                                                 (role ==='ADM' || (role === 'SLR' && formatDate(new Date()) === data.createdAt?.toString()))
                                                  && (
                                                        <Button 
                                                                label={'Удалить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#eb5757', width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                deleteCheckData(checkId, salesDef)
                                                                                closeWindow();
                                                                        } 
                                                                }}
                                                        />
                                                )}

                                                {checkId && 
                                                 (role ==='ADM' || (role === 'SLR' && formatDate(new Date()) === data.createdAt?.toString()))
                                                  && (
                                                        <Button 
                                                                label={'Скорректировать доп.данные'}
                                                                view="primary"
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                className={cnMixSpace({ mT:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                updateCheckExtraData(checkId);
                                                                        } 
                                                                }}
                                                        />
                                                )}

                                        </Layout>
                                </Layout>
                        )}
                        {isLoading && (
                                <Layout style={{ minHeight: '450px', alignItems: 'center', justifyContent: 'center'}}>
                                        <Loader size="m" />
                                </Layout>
                        )}
                </Modal>
        )
}
export default SalesDetailsModalMobile