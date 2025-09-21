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

import { IconAdd } from "@consta/icons/IconAdd";
import { TProduct, TPurchaseItem } from "../../../types/product-purchase-types";
import { TNomenclature } from "../../../types/nomenclature-types";
import { IconTrash } from "@consta/icons/IconTrash";
import { TCaption } from "../../../utils/types";
import { addPurchase, addPurchaseItems, getNomenclatures } from "../../../services/PurchaseService";
import { getUserInfo, UserInfo } from "../../../services/AuthorizationService";
import { Tooltip } from "../../global/Tooltip";
import { Direction, Position } from "@consta/uikit/Popover";
import { TPurchase } from "../../../types/purchase-types";
import { Tag } from "@consta/uikit/Tag";
import { getProductBySerial } from "../../../services/SalesService";

import errorAudio from '../../../assets/Audio/errorSignal.mp3';
import checkProductAudio from '../../../assets/Audio/checkProduct.mp3';
import { TWarehouse } from "../../../types/settings-types";
import { getWarehouses } from "../../../services/SettingsService";
import { IconAllDone } from "@consta/icons/IconAllDone";
import { addAccounting } from "../../../services/AccountingService";


interface TPurchaseModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
export type Partner = {
        partner: string;
        summPartner: number;
}

const PurchaseModalMobile = ({isOpen, setIsOpen} : TPurchaseModalProps) => {
        const defaultData : TPurchase = {
                batchId: undefined,
                comment: null,
                sum: null,
                batchNumber: undefined,
                createdAt: null,
                updatedAt: null,
                batchStatus: null,
                author: undefined,
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
                serialNumber: null,
                quantFinal: null,
                createdAt: null,
                updatedAt: null,
                costPriceAll: undefined,
        }

        const closeWindow = () => {
                setData(defaultData);
                setPurchases([defaultItem]);
                setIsOpen(false);
        }
        const [data, setData] = useState<TPurchase>(defaultData);
        const [productList, setProductList] = useState<TProduct[]>([]);
        const [purchases, setPurchases] = useState<TPurchaseItem[]>([defaultItem]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [captionList, setCaptionList] = useState<TCaption[]>([]);

         const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);

        const [user, setUser] = useState<UserInfo | undefined>(undefined);
        const serialRef = useRef<HTMLInputElement>(null);
    
        // Инициализация данных
        useEffect(() => {
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp);
                        })
                };
                const getWarehousesData = async () => {
                        await getWarehouses((resp) => {
                                setWarehouses(resp.map((item : TWarehouse) => ({
                                        warehouseId: item.warehouseId, 
                                        name: item.name, 
                                })))
                        });
                }
                void getUserInfoData();
                void getWarehousesData();
        }, [isOpen, setIsLoading]);

        useEffect(() => {
                const getProducts = async () => {
                        await  getNomenclatures((resp) => {
                                setProductList(resp.map((item : TNomenclature) => ({name: item.name, hasSerialNumber: item.hasSerialNumber, itemId: item.itemId, costPrice: item.lastCostPrice, weight: item.weight, productPrice: item.productPrice})));
                                setIsLoading(false);
                                });
                        }
                getProducts();
            }, [isOpen]);
        
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

        const [tooltipPosition, setTooltipPosition] = useState<Position>(undefined);
        const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);
        const [arrowDir, setArrowDir] = useState<Direction>('upLeft');
        const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
        const [serialNumber, setSerialNumber] = useState<string | null>(null);
        const [serialCaption, setSerialCaption] = useState<string | null>(null);
        const [seller, setSeller] = useState<string | null>(null);

const checkSerialNumberExists = async (serialNumber: string | null) => {
        if (!serialNumber) {
                setSerialCaption('Введите не пустое значение');
                return false;
        }
        
        // Проверка на уникальность в текущем массиве itemsBatch
        if (purchases.find(item => item.serialNumber === serialNumber)) {
                setSerialCaption('Значение повторяется');
                return false;
        }

        let checked = false
        
        // Проверка на уникальность с помощью API
        await getProductBySerial(serialNumber, (resp)=>{
                if (resp) {
                        setSerialCaption('Значение уже есть');
                        checked = false   
                } else {
                        checked = true
                }
        })

        return checked;
        }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBatch  = async (e: any) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = purchases?.filter(elem =>(!elem.serialNumber)).reduce((acc, item) => acc + (item.quantFinal ?? 0) * (item.costPriceAll ?? 0), 0);
                const body = purchases?.filter(elem =>(elem.itemId)).map(product => ({
                        ...product,
                        quant: product.quantFinal ?? 0,
                        remainder: product.quantFinal ?? 0,
                        }));
                try {
                        await addPurchase({
                        comment: data.comment,
                        sum: totalSum,
                        batchNumber: 0,
                        batchStatus: 'COMPLETED',
                        deliver: 0,
                        costDeliver: 0,
                        insurance: 0,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        rate: 0,
                        body: body,
                        author: user?.username,
                        }).then(async(resp) => {
                                // Создаем новый массив с обновленным batchId
                                const updatedItemsBatch = purchases?.map(product => ({
                                ...product,
                                batchId: resp.createdBatch.batchId,
                                batchNumber: 0,
                                quant: product.quantFinal ?? 0,
                                remainder: product.quantFinal ?? 0,
                                }));

                                // Теперь отправляем обновленный массив с batchId
                                const body = updatedItemsBatch;
                               
                                await addPurchaseItems(body).then(()=>{
                                        setData(resp.createdBatch);
                                        setPurchases(updatedItemsBatch)
                                            
                        });
                                setIsLoading(false);
                        }).then( async () => {
                                const updatedData = {
                                        id: undefined,
                                        accountFrom: 'Деньги в офисе',
                                        accountTo: undefined,
                                        justification: data.comment,
                                        form: undefined,
                                        isDraft: undefined,
                                        value: totalSum,
                                        category: 'Разовая закупка',
                                        createdAt: null,
                                        updatedAt: null,
                                        author: user?.username}
                                await addAccounting(updatedData)
                        })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error : any) {
                        console.error('Ошибка при создании партий или элементов:', error);
                        setCaptionList(error?.response?.data?.errors)
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
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'s' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Layout direction="row" >
                                                <Text size="xl" view="brand" style={{width: '100%'}} className={cnMixSpace({mT: '2xs' })}>
                                                       Разовая закупка
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
                                                        setPurchases([defaultItem]);
                                                }}
                                        />
                                </Layout>

                                {/* Шапка */}
                                
                                {!data?.batchId && (
                                        <Layout direction="column">
                                        {purchases?.length > 0 && purchases?.filter(elem => (!elem.serialNumber)).map(itemCheck => (
                                                                <Layout key={purchases.indexOf(itemCheck).toString()} style={{alignItems: 'center'}} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mH:'xs' })}>{(purchases.indexOf(itemCheck) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({p:'s'})}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                                <Combobox
                                                                                                        items={productList?.map(element => ({id: element.itemId ?? 0, label: element.name ?? ''}))}
                                                                                                        size="s"
                                                                                                        placeholder="Товар"
                                                                                                        value={itemCheck.name && itemCheck.itemId ? {id: itemCheck.itemId, label: itemCheck.name} : undefined} 
                                                                                                        style={{ width: '100%'}}
                                                                                                        onChange={(value)=>{
                                                                                                                if (value) {
                                                                                                                        setPurchases(prev => 
                                                                                                                        prev.map(product => (purchases.indexOf(product) === purchases.indexOf(itemCheck)) ? 
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
                                                                                                                        setPurchases(prevProducts => 
                                                                                                                                prevProducts.map(product => 
                                                                                                                                        (purchases.indexOf(product) === purchases.indexOf(itemCheck)) ? { ...product, productId: undefined, name: null, itemId: undefined, costPrice: 0, hasSerialNumber: false, caption: null } : product
                                                                                                                                )
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
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
                                                                                                id={`serialNumber ${purchases.indexOf(itemCheck)}`}
                                                                                                placeholder="Серийный номер"
                                                                                                value={(focusedIndex === purchases.indexOf(itemCheck)) ? serialNumber : null}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                const convertedValue = convertRuToEn(value);
                                                                                                                const filteredValue = convertedValue.replace(/[^a-zA-Z0-9-]/g, '');
                                                                                                                setSerialNumber(filteredValue);
                                                                                                        } else {
                                                                                                                setSerialNumber(null);
                                                                                                        }
                                                                                                }}
                                                                                                style={{ width: '100%'}}
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                                
                                                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                                                onKeyPress={async (event: any) => {
                                                                                                        if (event.key === 'Enter') {
                                                                                                                const isUnique = await checkSerialNumberExists(serialNumber);

                                                                                                                                if (!isUnique) {
                                                                                                                                        setSerialNumber(null)
                                                                                                                                        const audio = new Audio(errorAudio);
                                                                                                                                        audio.play();
                                                                                                                                return; // Если серийный номер не уникален, прекращаем выполнение
                                                                                                                                } else {
                                                                                                                                
                                                                                                                                const audio = new Audio(checkProductAudio);
                                                                                                                                audio.play(); 
                                                                                                                                setPurchases(prev => ([...prev, {
                                                                                                                                        itemBatchId: null,
                                                                                                                                        batchId: itemCheck.batchId,
                                                                                                                                        itemId: itemCheck.itemId,
                                                                                                                                        costPrice: itemCheck.costPrice,
                                                                                                                                        costPriceAll: itemCheck.costPriceAll,
                                                                                                                                        costDeliver: itemCheck.costDeliver,
                                                                                                                                        batchNumber: itemCheck.batchNumber,
                                                                                                                                        name: itemCheck.name,
                                                                                                                                        hasSerialNumber: itemCheck.hasSerialNumber,
                                                                                                                                        quant: itemCheck.quant,
                                                                                                                                        serialNumber: serialNumber,
                                                                                                                                        warehouse: itemCheck.warehouse,
                                                                                                                                        partner: itemCheck.partner,
                                                                                                                                        quantFinal: 1,
                                                                                                                                        createdAt: null,
                                                                                                                                        updatedAt: null,  
                                                                                                                                }]));
                                                                                                                                setSerialCaption(null)
                                                                                                                                setSerialNumber(null);
                                                                                                                                setPurchases(prev => 
                                                                                                                                        prev.map(product => (product.itemId === itemCheck.itemId &&  !product.serialNumber && (product.partner === itemCheck.partner)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                quantFinal: (product?.quantFinal ?? 0 ) + 1, 
                                                                                                                                                } : product
                                                                                                                                        ));
                                                                                                                                }
                                                                                                }}}
                                                                                                onBlur={async () => {
                                                                                                        if (serialNumber) {
                                                                                                                const isUnique = await checkSerialNumberExists(serialNumber);

                                                                                                                                if (!isUnique) {
                                                                                                                                        setSerialNumber(null)
                                                                                                                                        const audio = new Audio(errorAudio);
                                                                                                                                        audio.play();
                                                                                                                                return; // Если серийный номер не уникален, прекращаем выполнение
                                                                                                                                } else {
                                                                                                                                
                                                                                                                                const audio = new Audio(checkProductAudio);
                                                                                                                                audio.play(); 
                                                                                                                                setPurchases(prev => ([...prev, {
                                                                                                                                        itemBatchId: null,
                                                                                                                                        batchId: itemCheck.batchId,
                                                                                                                                        itemId: itemCheck.itemId,
                                                                                                                                        costPrice: itemCheck.costPrice,
                                                                                                                                        costPriceAll: itemCheck.costPriceAll,
                                                                                                                                        costDeliver: itemCheck.costDeliver,
                                                                                                                                        batchNumber: itemCheck.batchNumber,
                                                                                                                                        name: itemCheck.name,
                                                                                                                                        hasSerialNumber: itemCheck.hasSerialNumber,
                                                                                                                                        quant: itemCheck.quant,
                                                                                                                                        serialNumber: serialNumber,
                                                                                                                                        warehouse: itemCheck.warehouse,
                                                                                                                                        partner: itemCheck.partner,
                                                                                                                                        quantFinal: 1,
                                                                                                                                        createdAt: null,
                                                                                                                                        updatedAt: null,  
                                                                                                                                }]));
                                                                                                                                setSerialCaption(null)
                                                                                                                                setSerialNumber(null);
                                                                                                                                setPurchases(prev => 
                                                                                                                                        prev.map(product => (product.itemId === itemCheck.itemId &&  !product.serialNumber && (product.partner === itemCheck.partner)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                quantFinal: (product?.quantFinal ?? 0 ) + 1, 
                                                                                                                                                } : product
                                                                                                                                        ));
                                                                                                                                }
                                                                                                }
                                                                                                }}
                                                                                                caption={(focusedIndex === purchases.indexOf(itemCheck)) ? (serialCaption ?? undefined) : undefined}
                                                                                                status={(serialCaption && (focusedIndex === purchases.indexOf(itemCheck))) ? 'alert' : undefined}
                                                                                                onFocus={()=>{
                                                                                                        setSerialCaption(null)
                                                                                                        setFocusedIndex(purchases.indexOf(itemCheck));
                                                                                                }}
                                                                                                ref={serialRef}
                                                                                                disabled={!itemCheck.itemId || !itemCheck.hasSerialNumber}
                                                                                        />  

                                                                                        
                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.quantFinal?.toString()}
                                                                                                type='number'
                                                                                                placeholder="Кол-во"
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setPurchases(prev => 
                                                                                                                prev.map(product => (purchases.indexOf(product) === purchases.indexOf(itemCheck)) ? 
                                                                                                                        { ...product, 
                                                                                                                                quantFinal: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setPurchases(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (purchases?.indexOf(product) === purchases?.indexOf(itemCheck)) ? { ...product, quantFinal:  null } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                style={{ width: '100%'}}
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === purchases.indexOf(itemCheck)))) ? captionList?.find(item=>((item.state === "quant") && (item.index === purchases.indexOf(itemCheck))))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "quant") && (item.index === purchases.indexOf(itemCheck)))) ? "alert" : undefined}
                                                                                                onFocus={()=>{
                                                                                                        setCaptionList(prev => prev?.filter(capt => ((capt.state !== "quant") || (capt.index !== purchases.indexOf(itemCheck))) ))
                                                                                                }}
                                                                                                disabled={itemCheck.hasSerialNumber}
                                                                                        />
                                                                                        

                                                                                        <TextField 
                                                                                                size="s" 
                                                                                                value={itemCheck.costPriceAll?.toString()}
                                                                                                type='number'
                                                                                                placeholder="Цена закупки"
                                                                                                incrementButtons={false}
                                                                                                onChange={(value)=>{
                                                                                                        if (value) {
                                                                                                                setPurchases(prev => 
                                                                                                                prev.map(product => (product.itemId === itemCheck.itemId) ? 
                                                                                                                        { ...product, 
                                                                                                                                costPriceAll: Number(value), 
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                } else {
                                                                                                        setPurchases(prevProducts => 
                                                                                                                prevProducts.map(product => 
                                                                                                                        (product.itemId === itemCheck.itemId) ? { ...product, costPriceAll:  undefined } : product
                                                                                                                )
                                                                                                        );
                                                                                                }
                                                                                                }}
                                                                                                style={{ width: '100%'}}
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                        />
                                                                                        <Combobox 
                                                                                                items={warehouses}
                                                                                                getItemKey={item => item.warehouseId ?? 0}
                                                                                                getItemLabel={item => item.name ?? ''}
                                                                                                placeholder="Выберите склад"
                                                                                                value={itemCheck?.warehouse ? {warehouseId: warehouses?.find(item => (item.name === itemCheck?.warehouse))?.warehouseId, name: itemCheck?.warehouse} : null} 
                                                                                                onChange={(value)=> {
                                                                                                if (value) {
                                                                                                        setPurchases(prev => 
                                                                                                                prev.map(product => (itemCheck.itemId === product.itemId  ) ? 
                                                                                                                        { ...product, 
                                                                                                                                warehouse: value.name,
                                                                                                                        } : product
                                                                                                                )
                                                                                                                );
                                                                                                        } else {
                                                                                                                setPurchases(prev => 
                                                                                                                        prev.map(product => (itemCheck.itemId === product.itemId) ? 
                                                                                                                                { ...product, 
                                                                                                                                        warehouse: null,
                                                                                                                                } : product
                                                                                                                        )
                                                                                                                );
                                                                                                        }
                                                                                                        }
                                                                                                        } 
                                                                                                style={{ width: '100%'}}
                                                                                                size="s"
                                                                                                caption={ captionList?.length > 0 && captionList?.find(item=>(item.state === "warehouse" && item.index === purchases?.indexOf(itemCheck))) ? captionList?.find(item=>(item.state === "warehouse" && item.index === purchases?.indexOf(itemCheck)))?.caption : undefined}
                                                                                                status={captionList?.length > 0 && captionList?.find(item=>(item.state === "warehouse" && item.index === purchases?.indexOf(itemCheck))) ? "alert" : undefined}
                                                                                                onFocus={()=> {setCaptionList(prev => (prev.filter(item => (item.state !== 'warehouse'))))}}
                                                                                                className={cnMixSpace({ mT:'xs' })}
                                                                                        />
                                                                                        <Button 
                                                                                                view='secondary'
                                                                                                label={'Убрать позицию'}
                                                                                                iconLeft={IconTrash} 
                                                                                                style={{color: '#D42A2A', borderColor: '#D42A2A'}}
                                                                                                size="s"
                                                                                                onClick={()=>{
                                                                                                        setPurchases(purchases?.filter(item=>(item.itemId !== itemCheck.itemId)))}}
                                                                                                className={cnMixSpace({ mT:'m' })}
                                                                                        /> 
                                                                                </Layout>
                                                                                <Layout direction="row" style={{ flexWrap: 'wrap' }}>
                                                                                        {purchases?.filter((elem => (elem.itemId === itemCheck.itemId && elem.serialNumber))).map((item => (
                                                                                                <Tag
                                                                                                        label={item.serialNumber ?? ''}
                                                                                                        onCancel={()=> {
                                                                                                                setPurchases(prev => (
                                                                                                                        prev?.filter((el => (el.serialNumber !== item.serialNumber)))
                                                                                                                        ));
                                                                                                                setPurchases(prev => 
                                                                                                                        prev.map(product => (product.itemId === itemCheck.itemId &&  !product.serialNumber && (product.partner === itemCheck.partner)) ? 
                                                                                                                                { ...product, 
                                                                                                                                quantFinal: (product?.quantFinal ?? 0 ) - 1, 
                                                                                                                                } : product
                                                                                                                        ));
                                                                                                                }}
                                                                                                        mode="cancel"
                                                                                                        className={cnMixSpace({ mL:'m', mB: 'm' })}
                                                                                                />
                                                                                        )))}
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
                                                <Layout direction="row" style={{justifyContent: 'center'}}>
                                                <Button 
                                                        label={'Добавить товар'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        size="s"
                                                        className={cnMixSpace({ mV:'m' })}
                                                        onClick={()=>{
                                                                setPurchases(prev => [...prev, 
                                                                        defaultItem
                                                                ]);
                                                        }}
                                                />
                                                </Layout>
                        
                                                
                                </Layout>
                                )}
                                {data?.batchId && (<Layout direction="column">
                                                                                {(purchases.length > 0) && purchases?.filter((elem) => (!elem.serialNumber )).map(itemBatch => (
                                                                                                                <Layout key={purchases.indexOf(itemBatch).toString()} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(purchases?.filter((elem) => (!elem.serialNumber ))?.indexOf(itemBatch) + 1).toString()}</Text>
                                                                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>
                                                
                                                                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({ pV:'s', pR: 's', pL:'s'})}>
                                                                                                                                        <div style={{ width: '100%' }}>
                                                                                                                                                <Text size="s" style={{ width: '100%'}} className={cnMixSpace({mT: '2xs' })}>
                                                                                                                                                        {itemBatch?.name && itemBatch?.itemId ? itemBatch.name : ''}
                                                                                                                                                </Text>
                                                                                                                                        </div>
                                                                                                                                                
                                                                                                                                                {itemBatch.itemId && (
                                                                                                                                                <Layout  style={{minWidth:'150px', maxWidth:'150px', justifyContent: 'center'}}  className={cnMixSpace({  mR: 'm' })}>
                                                                                                                                                        {itemBatch.hasSerialNumber ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : (<IconClose view="alert" style={{alignSelf: 'center'}}/>)}
                                                                                                                                                </Layout>
                                                                                                                                                )}
                                                
                                                                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} align='left' className={cnMixSpace({  mT: '2xs', mR: 'm'  })} >
                                                                                                                                                        {itemBatch?.quantFinal?.toString() + ' шт'}
                                                                                                                                                </Text>
                                                                                                                                                <Text size="s" style={{minWidth:'150px', maxWidth:'150px'}} align='left' className={cnMixSpace({  mT: '2xs', mR: 'm'  })} >
                                                                                                                                                        {itemBatch?.costPriceAll?.toString() + ' руб'}
                                                                                                                                                </Text>
                                                                                                                                                <Text size="s" style={{minWidth:'270px', maxWidth:'270px'}} align='left' className={cnMixSpace({  mT: '2xs', mR: 'm'  })} >
                                                                                                                                                        {itemBatch?.warehouse?.toString()}
                                                                                                                                                </Text>
                                                                                                                                </Layout>
                                                                                                                        </Layout>  
                                                                                                                </Layout>
                                                                                                ))}
                                                                                </Layout>
                                )}
                                <Layout direction="row" style={{justifyContent: 'left'}}>
                                                <Text size="s" weight='semibold' view="brand"  className={cnMixSpace({ mT:'2xs' })} >Общая сумма:</Text> 
                                                <Text size="s"  weight='semibold' view="brand" className={cnMixSpace({ mT:'2xs', mL:'xs' })}>{(purchases?.length > 0 ? purchases?.filter(el => (el.hasSerialNumber && el.serialNumber || !el.hasSerialNumber)).reduce((acc, item) => acc + (item.quantFinal ?? 1) * (item.costPriceAll ?? 0), 0).toString() : 0) + ' руб'}</Text>  
                                </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Комментарий:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={data?.comment}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                            setData(prev => ({
                                                                        ...prev,
                                                                        comment:  value,
                                                                        }))    
                                                                        } else {
                                                                                setData(prev => ({
                                                                                        ...prev,
                                                                                        comment:  null,
                                                                                        }))       
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                                disabled={!!data.batchId}
                                                        />        
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} style={{ minWidth: '130px', maxWidth: '130px'}}>Продавец:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={seller}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                                setSeller(value)  
                                                                        } else {
                                                                                setSeller(null)      
                                                                        }
                                                                }}
                                                                disabled={!!data.batchId}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />        
                                        </Layout>
                                        
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'end'}}  flex={1} className={cnMixSpace({ mT:'l' })}>
                                        
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
                                                {!data.batchId && (
                                                        <Button 
                                                                label={'Оформить'}
                                                                view="primary"
                                                                size="s"
                                                                style={{backgroundColor: '#22c38e'}}
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                                createBatch(e);
                                                                }}
                                                                disabled={purchases?.filter(elem => ((elem.itemId && !elem.quantFinal) || (elem.itemId && !elem.costPriceAll) ))?.length > 0 || purchases?.filter(elem =>(elem.itemId)).length === 0}
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
export default PurchaseModalMobile;