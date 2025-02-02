import React, { useEffect, useState } from "react"

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
import { TProduct } from "../../types/product-purchase-types";
import { TNomenclature } from "../../types/nomenclature-types";
import { TCheck, TSale } from "../../types/sales-types";
import { IconTrash } from "@consta/icons/IconTrash";
import { TCaption } from "../../utils/types";
import { addCheck, addCheckSales, deleteCheck, deleteCheckSales, getCheck, getCheckSales, getProductBySerial, updateCheck } from "../../services/SalesService";
import { getNomenclatures } from "../../services/PurchaseService";
import { getUserInfo } from "../../services/AuthorizationService";

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

const SalesDetailsModal = ({isOpen, setIsOpen, checkId, setCheckId,  setUpdateFlag} : TSalesDetailsModalProps) => {
        const defaultData : TCheck = {
                checkId: undefined,
                summ: null,
                isBooking: null,
                isUnpaid: null,

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
                                setData(prev => ({
                                        ...prev, seller: resp.username
                                }));
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
                getProducts();
                
            }, [checkId, setData, isOpen]);

        

        const getProduct = async (e: React.FocusEvent<HTMLElement, Element> , item: TSale) => {
                e.preventDefault();
                        await getProductBySerial(item.serialNumber, (resp) => {
                                if (resp && !resp.isSaled) {
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
                                    acc[sale.partner].summPartner += sale.salePrice ?? 0;
                                } else {
                                    // Создаем новый объект для уникального партнера
                                    acc[sale.partner] = {
                                        partner: sale.partner,
                                        summPartner: sale.salePrice ?? 0,
                                    };
                                }
                    
                                return acc;
                            }, {} as Record<string, Partner>)
                        );
                    };
        
        
        const createCheck  = async (e: React.MouseEvent<Element, MouseEvent>) => {
                setIsLoading(true);
                e.preventDefault();
                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (item.salePrice ?? 0), 0);
                                const partners = getPartners(sales);
                                const body = sales;
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
                                                courier: data.courier
                                        }).then(async(resp) => {
                
                                                
                                                // Создаем новый массив с обновленным checkId
                                                const transformedRecords: TSale[] = [];
    
                                                sales.forEach(record => {
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
                                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (item.salePrice ?? 0), 0);
                                                const body = sales;
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
                                                                courier: data.courier
                                                                // partners: partners,
                                                        }).then(async(resp) => {
                                
                                                                
                                                                // Создаем новый массив с обновленным checkId
                                                                const transformedRecords: TSale[] = [];
                    
                                                                sales.forEach(record => {
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
                                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (item.salePrice ?? 0), 0);
                                const body = sales;
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
                                                courier: data.courier
                                                // partners: partners
                                        }).then(async(resp) => {
                
                                                
                                                // Создаем новый массив с обновленным checkId
                                                const transformedRecords: TSale[] = [];
    
                                                sales.forEach(record => {
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

const updateCheckData = async (checkId : number | undefined, isEnding : boolean | undefined) => {
        try {
                const totalSum = sales.reduce((acc, item) => acc + (item.quant ?? 1) * (item.salePrice ?? 0), 0);
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
                        courier: data.courier
        }).then(() => {
                setUpdateFlag(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })} catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.errors)
                        setIsLoading(false);
        }
        
}

                
        

        
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
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xl' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Layout direction="row" >
                                                <Text size="xl" view="brand" style={{width: '100%'}} className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                        {checkId ? 'Чек № ' +  data.checkId?.toString() + (data.isBooking ? ' (Бронь)' : data.isUnpaid ? ' (Не оплачен)' : '') : 'Формирование чека'}
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
                                <Text size="m" weight="semibold" className={cnMixSpace({ mT:'xl' })}>{`Список товаров чека (${sales?.length?.toString() ?? 0}):`}</Text>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })} >
                                        <div style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mR:'m' })}/>
                                        <Text size="s" style={{ width: '100%'}} className={cnMixSpace({  pH:'s' })}>Наименование</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mR:'m' })} align="center">Сер. номер</Text>
                                        <Text size="s" style={{minWidth:'38px', maxWidth:'38px'}} className={cnMixSpace({ mR:'m' })} align="center"></Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mR:'m' })} align="center">Количество</Text>
                                        <Text size="s" style={{minWidth:'150px', maxWidth:'150px'}} className={cnMixSpace({ mR:'m' })}>Цена продажи</Text>
                                        <div style={{minWidth:'38px', maxWidth:'38px'}} className={cnMixSpace({ mR:'m' })}/>
                                </Layout>
                                <Layout direction="column">
                                {sales?.length > 0 && !checkId && sales?.map(itemCheck => (
                                                                <Layout key={sales.indexOf(itemCheck).toString()} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(sales.indexOf(itemCheck) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                                <Combobox
                                                                                                        items={productList?.map(element => ({id: element.itemId ?? 0, label: element.name ?? ''}))}
                                                                                                        size="s"
                                                                                                        placeholder="Введите для поиска и выберите товар"
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
                                                                                                /> 
                                                                                        </div>      

                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.serialNumber ?? null}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setSales(prev => 
                                                                                                                prev.map(product => (sales.indexOf(product) === sales.indexOf(itemCheck)) ? 
                                                                                                                        { ...product, 
                                                                                                                                serialNumber: value, 
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
                                                                                                style={{minWidth:'100px', maxWidth:'100px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                                onBlur={(e)=>{
                                                                                                        if (itemCheck.serialNumber) {
                                                                                                                getProduct(e, itemCheck)
                                                                                                        }
                                                                                                }}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck)))) ? captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "serialNumber") && (item.index === sales.indexOf(itemCheck)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "serialNumber") && (capt.index !== sales.indexOf(itemCheck)) ))}}
                                                                                        />  

                                                                                        <Layout  style={{minWidth:'38px', maxWidth:'38px', justifyContent: 'center'}} className={cnMixSpace({ mL:'m' })}>
                                                                                                        {!!itemCheck.serialNumber && itemCheck.itemId ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : !!itemCheck.serialNumber && !itemCheck.itemId ?  (<IconClose view="alert" style={{alignSelf: 'center'}}/>) : <></>}
                                                                                        </Layout>
                                                                                        
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.quant?.toString()}
                                                                                                type='number'
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
                                                                                                style={{minWidth:'100px', maxWidth:'100px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck)))) ? captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === sales.indexOf(itemCheck)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{
                                                                                                        setCaptionList(prev => prev?.filter(capt => ((capt.state !== "quant") || (capt.index !== sales.indexOf(itemCheck))) ))
                                                                                                }}
                                                                                        />
                                                                                        

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
                                                                                                style={{minWidth:'150px', maxWidth:'150px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                        />
                                                                                        <Button 
                                                                                                view='clear' 
                                                                                                iconLeft={IconTrash} 
                                                                                                onClick={()=>{
                                                                                                setSales(sales?.filter(item=>(sales.indexOf(item) !== sales.indexOf(itemCheck))))}}
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                        /> 
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
                                                {sales?.length > 0 && checkId && sales?.map(itemCheck => (
                                                                <Layout direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(sales.indexOf(itemCheck) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <Text style={{ width: '100%', alignContent: 'center' }} size="xs">{itemCheck.name && itemCheck.itemId ? itemCheck?.name : ''}</Text>
                                                                                        <Text style={{minWidth:'100px', maxWidth:'100px' , alignContent: 'center'}} className={cnMixSpace({ mL:'m' })}>{itemCheck?.serialNumber ?? null}</Text>
                                                                                        <Layout  style={{minWidth:'38px', maxWidth:'38px', justifyContent: 'center', alignContent: 'center'}} className={cnMixSpace({ mL:'m' })}>
                                                                                                        {!!itemCheck.serialNumber && itemCheck.itemId ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : !!itemCheck.serialNumber && !itemCheck.itemId ?  (<IconClose view="alert" style={{alignSelf: 'center'}}/>) : <></>}
                                                                                        </Layout>
                                                                                        <Text style={{minWidth:'100px', maxWidth:'100px', alignContent: 'center'}} className={cnMixSpace({ mL:'m' })}>{itemCheck?.quant ?? null}</Text>
                                                                                        <Layout direction="column"  style={{minWidth:'204px', maxWidth:'204px'}}>
                                                                                                <Text style={{minWidth:'204px', maxWidth:'204px'}} size='s'>{'Цена: ' +(itemCheck?.salePrice ?? null) + ' руб'}</Text>
                                                                                                <Text style={{minWidth:'204px', maxWidth:'204px'}} view="secondary" size='xs' className={cnMixSpace({ mT:'xs' })}>{'Закуп. цена: ' + (itemCheck?.costPrice ?? '0') + ' руб'}</Text>
                                                                                                <Text style={{minWidth:'204px', maxWidth:'204px'}} view="secondary" size='xs' className={cnMixSpace({ mT:'xs' })}>{'Прибыль с поз.: ' + Number((Number(itemCheck.salePrice) - Number(itemCheck.costPrice)) * Number(itemCheck.quant ?? 1)).toString()  + ' руб'}</Text>
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

                                <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Покупатель:</Text>
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
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />        
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Продавец:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={data?.seller}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                        ...prev,
                                                                        seller:  value,
                                                                        }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        seller:  undefined,
                                                                                        }))       
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />        
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Курьер:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={data?.courier}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                        ...prev,
                                                                        courier:  value,
                                                                        }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        courier:  undefined,
                                                                                        }))       
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />        
                                        </Layout>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'end'}}  flex={1} className={cnMixSpace({ mT:'l' })}>
                                        <Layout direction="row" style={{justifyContent: 'left'}}>
                                                        <Text size="m" style={{minWidth: '110px'}} weight='semibold' view="brand"  className={cnMixSpace({ mT:'2xs' })} onClick={() => {console.log(sales)}}>Общая сумма:</Text> 
                                                        <Text size="m" style={{minWidth: '110px'}} weight='semibold' view="brand" className={cnMixSpace({ mT:'2xs', mL:'xs' })}>{(sales?.length > 0 ? sales.reduce((acc, item) => acc + (item.quant ?? 1) * (item.salePrice ?? 0), 0).toString() : 0) + ' руб'}</Text>  
                                        </Layout>
                                        <Layout direction="row" style={{justifyContent: 'right'}}>
                                                <Button 
                                                        label={'Закрыть'}
                                                        view="secondary"
                                                        size="s"
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={()=>{
                                                                closeWindow();
                                                        }}
                                                />
                                                {!checkId && (
                                                        <Button 
                                                                label={'Забронировать товар'}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (checkId) {
                                                                                // updateBatch(e, checkId);
                                                                        } else {
                                                                                createBooking(e);
                                                                        }
                                                                }}
                                                        />
                                                )}
                                                {!checkId && (
                                                        <Button 
                                                                label={'Отсрочка оплаты'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#f38b00'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (checkId) {
                                                                                // updateBatch(e, checkId);
                                                                        } else {
                                                                                createUnpaid(e)
                                                                        }
                                                                }}
                                                        />
                                                )}
                                                {checkId && data.isBooking && (
                                                        <Button 
                                                                label={'Завершить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                updateCheckData(checkId, true);
                                                                                closeWindow();
                                                                        }
                                                                }}
                                                        />
                                                )}
                                                {checkId && data.isBooking && (
                                                        <Button 
                                                                label={'Отменить бронь'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#eb5757'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                deleteCheckData(checkId, salesDef)
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
                                                                style={{backgroundColor: '#22c38e'}}
                                                                className={cnMixSpace({ mL:'m' })}
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
                                                {!checkId && (
                                                        <Button 
                                                                label={'Завершить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                                createCheck(e);
                                                                }}
                                                        />
                                                )}

                                                {checkId && !data.isBooking && !data.isUnpaid && (role ==='ADM') && (
                                                        <Button 
                                                                label={'Удалить продажу'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#eb5757'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={()=>{
                                                                        if (checkId) {
                                                                                deleteCheckData(checkId, salesDef)
                                                                                closeWindow();
                                                                        } 
                                                                }}
                                                        />
                                                )}

                                        </Layout>
                                        
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
export default SalesDetailsModal