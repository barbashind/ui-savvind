/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { IconSendMessage } from '@consta/icons/IconSendMessage';
import { IconArrowUndone } from '@consta/icons/IconArrowUndone';

import { IconAdd } from "@consta/icons/IconAdd";
import { TProduct, TDeliver, TContractor, TPurchaseItem } from "../../types/product-purchase-types";
import { IconTrash } from "@consta/icons/IconTrash";
import { TCaption } from "../../utils/types";
import { TNomenclature } from "../../types/nomenclature-types";
import { addPurchase, addPurchaseItems, deletePurchaseItem, getContractors, getDelivers, getNomenclatures, getPurchase, getPurchaseItems, getPurchases, updatePurchase, updatePurchaseItems } from "../../services/PurchaseService";
import { TPurchase } from "../../types/purchase-types";
import { TAccount } from "../../types/settings-types";
import { getAccounts } from "../../services/SettingsService";
import NumberMaskTextField from "../../utils/NumberMaskTextField";
import { Tooltip } from "../global/Tooltip";
import { Direction, Position } from "@consta/uikit/__internal__/src/components/Popover/Popover";
import { formatNumber } from "../../utils/formatNumber";




interface TProductPurchaseDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        batchId: number | undefined;
        setBatchId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ProductPurchaseDetailsModal = ({isOpen, setIsOpen, batchId, setBatchId,  setUpdateFlag} : TProductPurchaseDetailsModalProps) => {
        const defaultData : TPurchase = {
                batchId: undefined,
                comment: null,
                sum: null,
                batchNumber: undefined,
                createdAt: null,
                updatedAt: null,
                batchStatus: null,
                costDeliver: undefined,
        }
        const defaultItem : TPurchaseItem = {
                itemBatchId: null,
                batchId: undefined,
                itemId: undefined,
                costPrice: null,
                batchNumber: undefined,
                name: null,
                hasSerialNumber: false,
                quant: null,
                costDeliver: undefined,
                createdAt: null,
                updatedAt: null,
                contractorId: undefined,
        }

        const closeWindow = () => {
                setData(defaultData);
                setItemsBatch([defaultItem]);
                setIsOpen(false);
                setBatchId(undefined);
                setCaptionList([]);
                setRate(null);
        }
        const [data, setData] = useState<TPurchase>(defaultData);
        const [productList, setProductList] = useState<TProduct[]>([]);
        const [deliversList, setDeliversList] = useState<TDeliver[]>([]);
        const [contractors, setContractors] = useState<TContractor[]>([]);
        const [itemsBatch, setItemsBatch] = useState<TPurchaseItem[]>([defaultItem]);
        const [isLoading, setIsLoading] = useState<boolean>(batchId ? true : false);
        const [captionList, setCaptionList] = useState<TCaption[]>([]);
        const [accounts, setAccounts] = useState<TAccount[]>([]);
        const [rate, setRate] = useState<number | null>(null);
        useEffect(() => {
                if (batchId) {
                        setIsLoading(true);
                } else {
                        setIsLoading(false);
                }
        }, [batchId, isOpen, setIsLoading]);

        useEffect(() => {
                if (data.batchStatus === 'CREATED' || !data.batchStatus)
                setItemsBatch(prev => prev?.map(item => ({
                        ...item,
                        costDeliver: Math.round((((deliversList?.find(el=> el?.deliverId === data?.deliver)?.priceDeliver ?? 0)  * (productList?.find(elem => (elem?.itemId === item?.itemId))?.weight ?? 0)) + ((item?.costPrice  ?? 0)) * ((deliversList?.find(el=> el?.deliverId === data?.deliver)?.insurance ?? 0) / 100)) * (rate || 1) * 100 )  / 100,
                        costPriceAll:  Math.round((Number((((deliversList?.find(el=> el?.deliverId === data?.deliver)?.priceDeliver ?? 0 ) * (productList?.find(elem => elem?.itemId === item?.itemId)?.weight ?? 0) + ((item?.costPrice  ?? 0)) * ((deliversList?.find(el=> el?.deliverId === data?.deliver)?.insurance ?? 0) / 100)) * 100 * (rate || 1)) / 100) + (item?.costPrice ?? 0) * (rate || 1)) * 100) / 100}
                        ))) 
        }, [data?.batchStatus, data?.deliver, itemsBatch.length, deliversList, productList, rate]);

        // Инициализация данных
        useEffect(() => {
                const getAutoBatchNumer = async () => {
                        const response = await getPurchases({page: 0, size: 10});
                        if (response.content?.length > 0) {
                                setData(prev  => ({
                                        ...prev,
                                        batchNumber:  Number(response.totalElements + 1),
                                }))  
                        }
                }
                const getData = async (batchId : number) => {
                        await getPurchase(batchId, (resp) => {
                                setData(resp);
                                setRate(resp?.rate ?? null);
                            });
                }

                const getItems = async (batchId : number) => {
                        await getPurchaseItems(batchId, (resp) => {
                                setItemsBatch(resp);
                            });
                        }
                
                const getProducts = async () => {
                        await  getNomenclatures((resp) => {
                                setProductList(resp.map((item : TNomenclature) => ({name: item.name, hasSerialNumber: item.hasSerialNumber, itemId: item.itemId, costPrice: item.lastCostPrice, weight: item.weight, productPrice: item.productPrice})));
                                if (!batchId) {
                                        setIsLoading(false);
                                }
                                
                            });
                        }
                const getDeliversData = async () => {
                        await getDelivers((resp) => {
                                setDeliversList(resp)
                        });
                        }
                const getContractorsData = async () => {
                        await getContractors((resp) => {
                                setContractors(resp.map((item : TContractor) => ({contractorId: item.contractorId, contractor: item.contractor})))
                        });
                        }
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
                                
                        })
                }

                if (batchId) {
                        setIsLoading(true);
                        getData(batchId).then(
                                () => {
                                getItems(batchId)     
                        }
                   ).then(()=> {
                                       setIsLoading(false); 
                                });
                }
                if (!batchId) {
                        getAutoBatchNumer();
                }
                getProducts();
                getDeliversData();
                getContractorsData();
                getAccountsData()
                
            }, [batchId, setData, isOpen]);

        const createBatch  = async (e: any) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0);
                const body = itemsBatch;
                try {
                        await addPurchase({
                        comment: data.comment,
                        sum: totalSum,
                        batchNumber: data.batchNumber,
                        batchStatus: 'CREATED',
                        deliver: data.deliver,
                        costDeliver: data.costDeliver,
                        insurance: data.insurance,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        rate: rate,
                        body: body,
                        }).then(async(resp) => {

                                
                                // Создаем новый массив с обновленным batchId
                                const updatedItemsBatch = itemsBatch?.map(product => ({
                                ...product,
                                batchId: resp.createdBatch.batchId,
                                batchNumber: data.batchNumber
                                }));

                                // Теперь отправляем обновленный массив с batchId
                                const body = updatedItemsBatch;
                               
                                await addPurchaseItems(body).then(()=>{
                                        setData(resp.createdBatch);
                                        setBatchId(resp.createdBatch.batchId)    
                        });
                                setItemsBatch(updatedItemsBatch);
                                setIsLoading(false);
                                setUpdateFlag(true); 
                        })

                } catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.data?.errors)
                        setIsLoading(false);
                }
        }

        const updateBatch = async (e : any, id : number) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0);
                const body = itemsBatch;
                try {
                        await updatePurchase( id ,{
                                comment: data.comment,
                                sum: totalSum,
                                batchId: batchId,
                                batchNumber: data.batchNumber,
                                batchStatus: 'CREATED',
                                deliver: data.deliver,
                                costDeliver: data.costDeliver,
                                insurance: data.insurance,
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                rate: rate,
                                body: body,

                        }).then(async(resp) => {
                                const body = itemsBatch?.map(product => ({
                                        ...product,
                                        batchNumber: data.batchNumber,
                                        createdAt: null,
                                        updatedAt: null,
                                        }));;
                                await updatePurchaseItems( id , body)
                                        .then(() => { 
                                                setData(resp.updatedBatch);
                                                setUpdateFlag(true);
                                                setIsLoading(false);
                                })
                        })
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors)
                        setIsLoading(false);
                }
        }

        const sentBatch = async (e : any, id : any) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0);
                const body = itemsBatch;
                try {
                        await updatePurchase(id ,{
                                comment: data.comment,
                                sum: totalSum,
                                batchId: batchId,
                                batchNumber: data.batchNumber,
                                batchStatus: 'REGISTRATION',
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                body: body,

                        }).then((resp) => { 
                                        setData(resp.updatedBatch);
                                        setUpdateFlag(true);
                                        setIsLoading(false);
                                })
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors)
                        setIsLoading(false);
                }
        }

        const returnBatch = async (e : any, id : any) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0);
                const body = itemsBatch;
                try {
                        await updatePurchase(id , {
                                comment: data.comment,
                                sum: totalSum,
                                batchId: batchId,
                                batchNumber: data.batchNumber,
                                batchStatus: 'CREATED',
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                body: body,

                        }).then((resp) => { 
                                setData(resp.updatedBatch);
                                setUpdateFlag(true);
                                setIsLoading(false);
                        })
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors)
                }
        }

        const deleteItem = async (e: React.MouseEvent<Element, MouseEvent>, id : number) => {
                setIsLoading(true);
                e.preventDefault();
                try {
                        await deletePurchaseItem(id).then(async() => {
                                setIsLoading(false);
                               })
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors)
                }
        }

        const [tooltipPosition, setTooltipPosition] = useState<Position>(undefined);
        const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);
        const [arrowDir, setArrowDir] = useState<Direction>('upLeft');
        
        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onEsc={() => {
                                closeWindow();
                        }}
                        style={{width: '85%'}}
                >
                        {!isLoading && (
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xl' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Layout direction="row" >
                                                <Text size="xl" view="brand" style={{width: '100%'}} className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                        {batchId ? 'Партия ' +  data.batchNumber?.toString() : 'Новая партия'}
                                                </Text>
                                                {!batchId && (<TextField 
                                                        size="s" 
                                                        placeholder="Введите номер партии"
                                                        value={data?.batchNumber ? data?.batchNumber?.toString() : ''}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                batchNumber:  Number(value),
                                                                        }))     
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                batchNumber:  undefined,
                                                                        }))
                                                                }
                                                        }}
                                                        onFocus={()=>{setCaptionList(prev => prev?.filter(capt => capt.state !== "batchNumber" ))}}
                                                        style={{minWidth: '200px'}}
                                                        caption={ captionList?.length > 0 && captionList?.find(item=>(item.state === "batchNumber")) ? captionList?.find(item=>(item.state === "batchNumber"))?.caption : undefined}
                                                        status={captionList?.length > 0 && captionList?.find(item=>(item.state === "batchNumber")) ? "alert" : undefined}
                                                        className={cnMixSpace({ mL:'2xs' })}
                                                />
                                                )}
                                                <Layout direction="row" style={{ minWidth: '200px' }}>
                                                        {data.batchStatus === 'CREATED' && (
                                                        <Text size="m" weight="medium" view="link" className={cnMixSpace({mL:'s', mT: 'xs'})}>
                                                                (Создан)
                                                        </Text>)}
                                                        {data.batchStatus === 'REGISTRATION' && (<Text size="m" weight="medium" view="caution" className={cnMixSpace({mL:'s', mT: 'xs'})}>
                                                                (На оприходовании)
                                                        </Text>)}
                                                        {data.batchStatus === 'COMPLETE' && (<Text size="m" weight="medium" view="success" className={cnMixSpace({mL:'s', mT: 'xs'})}>
                                                                (Принят)
                                                        </Text>)}
                                                </Layout>
                                        </Layout>
                                        
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        setIsOpen(false);
                                                        setIsLoading(true);
                                                        setData(defaultData);
                                                        setBatchId(undefined);
                                                        setItemsBatch([defaultItem]);
                                                        setRate(null);
                                                }}
                                        />
                                </Layout>

                                {/* Шапка */}
                                <Text size="m" weight="semibold" className={cnMixSpace({ mT:'xl' })}>{`Список товаров партии (${itemsBatch?.length?.toString() ?? 0}):`}</Text>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })} >
                                        <div style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mR:'m' })}/>
                                        <Text size="s" style={{ width: '100%', minWidth:'200px',}} className={cnMixSpace({  pL:'s' })}>Наименование</Text>
                                        <Text size="s" style={{minWidth:'200px', maxWidth:'200px'}} className={cnMixSpace({ mL:'m' })} align="center">Поставщик</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Количество</Text>
                                        <Text size="s" style={{minWidth:'110px', maxWidth:'110px'}} className={cnMixSpace({ mL:'m' })}>Цена закупки $</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })}>Доставка</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })}>Итог. цена</Text>
                                        <Text size="s" style={{minWidth:'130px', maxWidth:'130px'}} className={cnMixSpace({ mL:'m' })}>Общая стоимость</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Сер. номер</Text>
                                        <Text size="s" style={{minWidth:'170px', maxWidth:'170px'}} className={cnMixSpace({ mL:'m' })} align="center">Контрагент</Text>
                                        <div style={{minWidth:'38px', maxWidth:'38px'}} className={cnMixSpace({ mR:'m' })}/>
                                </Layout>
                                <Layout direction="column">
                                {itemsBatch?.filter(el => !el.serialNumber)?.map(itemBatch => (
                                                                <Layout key={itemsBatch.indexOf(itemBatch).toString()} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(itemsBatch.indexOf(itemBatch) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <div style={{ width: '100%', minWidth:'200px' }}>
                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && (
                                                                                                <Combobox
                                                                                                        items={productList?.map(element => ({id: element.itemId ?? 0, label: element.name ?? ''}))}
                                                                                                        size="s"
                                                                                                        getItemKey={item => item.id}
                                                                                                        getItemLabel={item => item.label}
                                                                                                        placeholder="Введите для поиска и выберите товар"
                                                                                                        value={itemBatch.name && itemBatch.itemId ? {id: itemBatch.itemId, label: itemBatch.name} : undefined} 
                                                                                                        style={{ width: '100%'}}
                                                                                                        onChange={(value)=>{
                                                                                                                if (value) {
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                                        { ...product, 
                                                                                                                                        itemId: value.id, 
                                                                                                                                        name: value.label,
                                                                                                                                        costPrice: productList.find(el => (el.itemId === value.id))?.costPrice ?? null,
                                                                                                                                        hasSerialNumber: productList.find(el => (el.itemId === value.id))?.hasSerialNumber ?? false,
                                                                                                                                        caption: null
                                                                                                                                        } : product
                                                                                                                                )
                                                                                                                                );
                                                                                                                } else {
                                                                                                                        setItemsBatch(prevProducts => 
                                                                                                                                prevProducts.map(product => 
                                                                                                                                        (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? { ...product, productId: undefined, name: null, itemId: undefined, costPrice: 0, hasSerialNumber: false, caption: null } : product
                                                                                                                                )
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
                                                                                                        caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "itemId") && (item.index === itemsBatch.indexOf(itemBatch)))) ? captionList?.find(item=>((item.state === "itemId") && (item.index === itemsBatch.indexOf(itemBatch))))?.caption : undefined}
                                                                                                        status={captionList?.length > 0 && captionList?.find(item=>((item.state === "itemId") && (item.index === itemsBatch.indexOf(itemBatch)))) ? "alert" : undefined}
                                                                                                        onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "itemId") && (capt.index !== itemsBatch.indexOf(itemBatch)) ))}}
                                                                                                        onMouseMove={(event) => {
                                                                                                                const target = event.target as HTMLElement;
                                                                                                                const rect = target.getBoundingClientRect();
                                                                                                                if (target.classList.contains('Select-Input')) {
                                                                                                                        setTooltipPosition({
                                                                                                                        x: rect.right - (target.clientWidth * 0.5),
                                                                                                                        y: rect.top,
                                                                                                                    });
                                                                                                                    setTooltipText(itemBatch?.name ?? undefined)
                                                                                                                    setArrowDir('upCenter')
                                                                                                                }
                                                                                                                    
                                                                                                            }}
                                                                                                        onMouseLeave={() => {
                                                                                                        setTooltipPosition(undefined);
                                                                                                        setTooltipText(undefined)
                                                                                                        }}
                                                                                                        renderItem = {(item) => 
                                                                                                                (
                                                                                                                <Layout  
                                                                                                                        className='comboboxItemArea'
                                                                                                                        onClick={() => {
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                        prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                itemId: item.item.id, 
                                                                                                                                                name: item.item.label,
                                                                                                                                                costPrice: productList.find(el => (el.itemId === item.item.id))?.costPrice ?? null,
                                                                                                                                                hasSerialNumber: productList.find(el => (el.itemId === item.item.id))?.hasSerialNumber ?? false,
                                                                                                                                                caption: null
                                                                                                                                                } : product
                                                                                                                                        )
                                                                                                                                        );
                                                                                                                        }}
                                                                                                                        >
                                                                                                                        <Text size='s' className={cnMixSpace({mV:'xs', mL:'xs'}) + ' comboboxItem'}>{item.item.label}</Text>
                                                                                                                </Layout>
                                                                                                        )}
                                                                                                /> 
                                                                                        )}
                                                                                        {(data.batchStatus !== 'CREATED' && data.batchStatus) && (
                                                                                                <div style={{ width: '100%', minWidth:'200px'}}>
                                                                                                        <Text size="s" style={{ width: '100%', minWidth:'200px'}} className={cnMixSpace({mT: '2xs' })}>
                                                                                                                {itemBatch?.name && itemBatch?.itemId ? itemBatch.name : ''}
                                                                                                        </Text>
                                                                                                </div>
                                                                                                
                                                                                        )}
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
                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && (
                                                                                                <Combobox
                                                                                                        items={contractors?.map(element => ({id: element.contractorId, label: element.contractor}))}
                                                                                                        size="s"
                                                                                                        placeholder="Поставщик"
                                                                                                        value={(itemBatch.contractorId !== undefined ) ? {id: itemBatch.contractorId, label: (contractors?.find(el => (el.contractorId === itemBatch.contractorId))?.contractor ?? '')} : undefined} 
                                                                                                        style={{minWidth:'200px', maxWidth:'200px'}}
                                                                                                        onClick={()=>console.log(itemBatch)}
                                                                                                        onChange={(value)=>{
                                                                                                                if (value) {
                                                                                                                                console.log(value);
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                                        { ...product,
                                                                                                                                                contractorId: value.id
                                                                                                                                        } : product
                                                                                                                                )
                                                                                                                                );
                                                                                                                } else {
                                                                                                                        setItemsBatch(prevProducts => 
                                                                                                                                prevProducts.map(product => 
                                                                                                                                        (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? { ...product, contractorId: undefined } : product
                                                                                                                                )
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
                                                                                                        className={cnMixSpace({mL:'m'})}
                                                                                                /> 
                                                                                        )}
                                                                                        {(data.batchStatus !== 'CREATED' && data.batchStatus) && (
                                                                                                <Text size="s" style={{minWidth:'200px', maxWidth:'200px'}} align="center"  className={cnMixSpace({mT: '2xs' })}>
                                                                                                        {contractors?.find(el => (el.contractorId === itemBatch.contractorId))?.contractor ?? '-'}
                                                                                                </Text>
                                                                                        )}
                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && ( 
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemBatch.quant?.toString()}
                                                                                                type='number'
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setItemsBatch(prev => 
                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                        { ...product, 
                                                                                                                                quant: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setItemsBatch(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? { ...product, quant:  null } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                style={{minWidth:'100px', maxWidth:'100px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === itemsBatch.indexOf(itemBatch)))) ? captionList?.find(item=>((item.state === "quant") && (item.index === itemsBatch.indexOf(itemBatch))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === itemsBatch.indexOf(itemBatch)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "quant") && (capt.index !== itemsBatch.indexOf(itemBatch)) ))}}
                                                                                        />
                                                                                        )}
                                                                                        
                                                                                        {(data.batchStatus !== 'CREATED' && data.batchStatus) && (
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs' })}>
                                                                                                        {itemBatch?.quant?.toString() + ' шт'}
                                                                                                </Text>
                                                                                        )}

                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && ( 
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemBatch.costPrice?.toString()}
                                                                                                type='number'
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setItemsBatch(prev => 
                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                        { ...product, 
                                                                                                                                costPrice: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setItemsBatch(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? { ...product, costPrice:  null } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                style={{minWidth:'110px', maxWidth:'110px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                        />
                                                                                        )}
                                                                                        {(data.batchStatus !== 'CREATED' && data.batchStatus) && (
                                                                                                <Text size="s" style={{minWidth:'110px', maxWidth:'110px'}} className={cnMixSpace({  mT: '2xs' })}>
                                                                                                        {(itemBatch?.costPrice ? (itemBatch?.costPrice)?.toString() : '-') + ' $'}
                                                                                                </Text>
                                                                                        )}
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs', mL: 'm' })} onClick={() => console.log(itemBatch)}>
                                                                                                        {(itemBatch.costDeliver?.toString() ?? 0) + ' руб'}
                                                                                                </Text>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs', mL: 'm' })}>
                                                                                                        {(itemBatch.costPriceAll ?? 0) + ' руб'}
                                                                                                </Text>
                                                                                                <Text size="s"  style={{minWidth:'130px', maxWidth:'130px'}} className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                                                                {formatNumber(((itemBatch.costPriceAll ?? 0) * (itemBatch.quant ?? 0)).toFixed(2)) + ' руб' }
                                                                                                </Text>
                                                                                        {itemBatch.itemId && (
                                                                                                <Layout  style={{minWidth:'100px', maxWidth:'100px', justifyContent: 'center'}} className={cnMixSpace({ mL:'m' })}>
                                                                                                        {itemBatch.hasSerialNumber ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : (<IconClose view="alert" style={{alignSelf: 'center'}}/>)}
                                                                                                </Layout>
                                                                                        )}
                                                                                        {!itemBatch.itemId && (
                                                                                        <div  style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })}/>
                                                                                        )}
                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && ( 
                                                                                        <Combobox 
                                                                                                size="s" 
                                                                                                items={accounts}
                                                                                                getItemKey={item => item.accountId || 0}
                                                                                                getItemLabel={item => item.name || ''}
                                                                                                value={itemBatch.partner ? {accountId: accounts.find(item => item.name === itemBatch?.partner)?.accountId, name: itemBatch.partner ?? ''} : null}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setItemsBatch(prev => 
                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                        { ...product, 
                                                                                                                                partner: value.name, 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setItemsBatch(prev => 
                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                        { ...product, 
                                                                                                                                partner: null, 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                }
                                                                                                }}
                                                                                                style={{minWidth:'170px', maxWidth:'170px'}} 
                                                                                                className={cnMixSpace({ mL:'m' })}
                                                                                        />
                                                                                        )}
                                                                                        {(data.batchStatus !== 'CREATED' && data.batchStatus) && (
                                                                                                <Text size="s" style={{minWidth:'170px', maxWidth:'170px'}} className={cnMixSpace({  mT: '2xs' })}>
                                                                                                        {itemBatch?.partner}
                                                                                                </Text>
                                                                                        )}

                                                                                        {(data.batchStatus === 'CREATED' || !data.batchStatus) && ( 
                                                                                        <div>
                                                                                                <Button 
                                                                                                        view='clear' 
                                                                                                        iconLeft={IconTrash} 
                                                                                                        onClick={ (e) => {
                                                                                                                setItemsBatch(itemsBatch?.filter(item=>(itemsBatch.indexOf(item) !== itemsBatch.indexOf(itemBatch))));
                                                                                                                if (itemBatch.itemBatchId) {
                                                                                                                        void deleteItem(e, itemBatch.itemBatchId)
                                                                                                                }
                                                                                                        }}
                                                                                                        size="s"
                                                                                                        />
                                                                                        </div>
                                                                                        )}
                                                                                        {data.batchStatus !== 'CREATED' && data.batchStatus && (
                                                                                                <div>
                                                                                                        <Button 
                                                                                                                view='clear' 
                                                                                                                disabled 
                                                                                                                iconLeft={IconTrash} 
                                                                                                                onClick={()=>{
                                                                                                                        setItemsBatch(itemsBatch?.filter(item=>(itemsBatch.indexOf(item) !== itemsBatch.indexOf(itemBatch))))}}
                                                                                                                size="s"
                                                                                                        />
                                                                                                </div>
                                                                                        )}
                                                                                        
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
                                        <Layout direction="row" style={{justifyContent: 'center'}}>
                                                {(!data.batchStatus || data.batchStatus === 'CREATED') && (<Button 
                                                        label={'Добавить товар'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        size="s"
                                                        disabled={!!data.deliver}
                                                        title={!data.deliver ? '' : 'Удалите доставщика для добавления'}
                                                        className={cnMixSpace({ mV:'m' })}
                                                        onClick={()=>{
                                                                setItemsBatch(prev => [...prev, 
                                                                        {
                                                                                batchId: data.batchId ?? undefined,
                                                                                itemId: undefined,
                                                                                costPrice: null,
                                                                                batchNumber: undefined,
                                                                                name: null,
                                                                                hasSerialNumber: false,
                                                                                quant: null,
                                                                                rowNumber: (itemsBatch.length + 1),
                                                                                createdAt: null,
                                                                                updatedAt: null,
                                                                                caption: null,
                                                                                itemBatchId: null,
                                                                                productPrice: null,
                                                                        }
                                                                ]);
                                                        }}
                                                />
                                                )}
                                        </Layout>
                                </Layout>

                                <Layout direction="row" className={cnMixSpace({ mT:'xl', mB:'xs' })} style={{alignItems: 'end'}}>
                                <Layout direction="column" className={cnMixSpace({  mR: 'm'  })} flex={3}>
                                                <Text size="s"  >Доставщик:</Text>
                                                        <Combobox 
                                                                size="s"
                                                                placeholder="Выберите доставщика"
                                                                items={deliversList}
                                                                value={{deliverId: data?.deliver, name: deliversList?.find(el=> el.deliverId === data?.deliver)?.name}}
                                                                getItemLabel={(item)=> item.name ?? ''}
                                                                getItemKey={(item)=> item.deliverId ?? ''}
                                                                onChange={(value) => { 
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                                ...prev,
                                                                                deliver:  value?.deliverId,
                                                                                }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        deliver:  undefined,
                                                                                        }))    
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({ mT:'2xs' })}
                                                                onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "deliver")))}}
                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "deliver"))) ? captionList?.find(item=>((item.state === "deliver")))?.caption : undefined}
                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "deliver"))) ? "alert" : undefined}
                                                                style={{width: '100%'}}
                                                                onBlur={()=>{
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                insurance:  deliversList?.find(el=> el.deliverId === data?.deliver)?.insurance,
                                                                                costDeliver: deliversList?.find(el=> el.deliverId === data?.deliver)?.priceDeliver,
                                                                                }))
                                                                }}
                                                        />        
                                        </Layout>
                                        <Layout direction="column" flex={1} className={cnMixSpace({ pR:'m' })}>
                                                <Text size="s"  >Цена доставки за кг ($):</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="number"
                                                                incrementButtons={false}
                                                                placeholder="-"
                                                                value={data?.costDeliver?.toString()}
                                                                className={cnMixSpace({ mT:'2xs'})}
                                                                style={{width: '100%'}}
                                                                disabled
                                                        />        
                                        </Layout>
                                        <Layout direction="column" flex={1} className={cnMixSpace({ pR:'m' })}>
                                                <Text size="s" onClick={()=>{console.log(rate?.toString())}} >Курс $:</Text>
                                                        <NumberMaskTextField 
                                                                size="s"
                                                                placeholder="Введите курс доллара"
                                                                value={rate?.toString()}
                                                                onChange={(value : string | null) => {
                                                                        if (value) {
                                                                                setRate(Number(value))
                                                                        } else {
                                                                                setRate(null)
                                                                        }
                                                                }}
                                                                className={cnMixSpace({ mT:'2xs'})}
                                                                style={{width: '100%'}}
                                                        />        
                                        </Layout>
                                        <Layout direction="column" flex={1}>
                                                <Text size="s"  >Страховка:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="number"
                                                                incrementButtons={false}
                                                                placeholder="-"
                                                                value={data?.insurance?.toString()}
                                                                className={cnMixSpace({ mT:'2xs' })}
                                                                style={{width: '100%'}}
                                                                disabled
                                                        />        
                                        </Layout>
                                        
                                        
                                                        
                                                        
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl', mB:'xs' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({   mB:'xs'  })} >Комментарий:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                placeholder="При необходимости введите комментарий к партии"
                                                                rows={1}
                                                                value={data?.comment}
                                                                onChange={(value) => { setData(prev => ({
                                                                        ...prev,
                                                                        comment:  value,
                                                                        }))
                                                                }}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />        
                                        </Layout>
                                
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'end'}}  flex={1} className={cnMixSpace({ mT:'l' })}>
                                        <Layout direction="row" style={{justifyContent: 'left'}}>
                                                        <Text size="m" style={{minWidth: '110px'}} weight='semibold' view="brand"  className={cnMixSpace({ mT:'2xs' })}>Общая сумма:</Text> 
                                                        <Text size="m" style={{minWidth: '110px'}} weight='semibold' view="brand" className={cnMixSpace({ mT:'2xs', mL:'xs' })}>{formatNumber(itemsBatch.reduce((acc, item) => acc + (item.quant ?? 0) * Number(item.costPriceAll ?? 0) , 0)?.toFixed(2)) + ' руб'}</Text>  
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
                                                { (data.batchStatus === 'CREATED' || !data.batchStatus) && 
                                                        <Button 
                                                                label={'Сохранить'}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (batchId) {
                                                                                updateBatch(e, batchId);
                                                                        } else {
                                                                                createBatch(e); 
                                                                        }
                                                                }}
                                                        />
                                                }     
                                                { (data.batchStatus === 'CREATED') && 
                                                        <Button 
                                                                label={'Отправить на оприходование'}
                                                                view="primary"
                                                                iconLeft={IconSendMessage}
                                                                style={{backgroundColor: '#09b37b'}}
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (batchId) {
                                                                                sentBatch(e, batchId);
                                                                        }
                                                                }}
                                                        />
                                                }   
                                                { (data.batchStatus === 'REGISTRATION') && 
                                                        <Button 
                                                                label={'Вернуть в редактирование'}
                                                                iconLeft={IconArrowUndone}
                                                                style={{backgroundColor: '#ffa10a'}}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (batchId) {
                                                                                returnBatch(e, batchId);
                                                                        }
                                                                }}
                                                        />
                                                }   



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
export default ProductPurchaseDetailsModal