 
import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { IconClose } from '@consta/icons/IconClose';
import { IconAllDone } from '@consta/icons/IconAllDone';
import { IconCheck } from '@consta/icons/IconCheck';
import { IconArrowUndone } from '@consta/icons/IconArrowUndone';

import { TCaption } from "../../utils/types";
import { Tag } from "@consta/uikit/Tag";
import { getPurchase, getPurchaseItems, updatePurchase, updatePurchaseItems } from "../../services/PurchaseService";
import { TPurchase } from "../../types/purchase-types";
import { TPurchaseItem } from "../../types/product-purchase-types";
import { Combobox } from "@consta/uikit/Combobox";
import { TWarehouse } from "../../types/settings-types";
import { getWarehouses } from "../../services/SettingsService";
import { getProductBySerial } from "../../services/SalesService";
import NumberMaskTextField from "../../utils/NumberMaskTextField";
import { getNomenclatures } from "../../services/PurchaseService.ts";
import { TNomenclature } from "../../types/nomenclature-types";
import { InfoCircleFilled } from "@ant-design/icons";

import errorAudio from '../../assets/Audio/errorSignal.mp3';
import checkProductAudio from '../../assets/Audio/checkProduct.mp3';
import { getUserInfo } from "../../services/AuthorizationService.ts";





interface TProductRegistrationDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        batchId: number | undefined;
        setBatchId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ProductRegistrationDetailsModal = ({isOpen, setIsOpen, batchId, setBatchId,  setUpdateFlag} : TProductRegistrationDetailsModalProps) => {
        const defaultData : TPurchase = {
                batchId: undefined,
                comment: null,
                sum: null,
                batchNumber: undefined,
                createdAt: null,
                updatedAt: null,
                batchStatus: null,
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
                setItemsBatch([defaultItem]);
                setIsOpen(false);
                setBatchId(undefined);
        }
        interface TNomenclatureP {
                itemId?: number;
                name: string | null;
                weightProduct: number | null;
                
            }
        const [data, setData] = useState<TPurchase>(defaultData);
        const [itemsBatch, setItemsBatch] = useState<TPurchaseItem[]>([defaultItem]);
        const [isLoading, setIsLoading] = useState<boolean>(batchId ? true : false);
        const [captionList, setCaptionList] = useState<TCaption[]>([]);
        const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);
        const [serialNumber, setSerialNumber] = useState<string | null>(null);
        const [serialCaption, setSerialCaption] = useState<string | null>(null);
        const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
        const [productList, setProductList] = useState<TNomenclatureP[]>([]);
        const [mainCost, setMainCost] = useState<number | null>(null);
        const [rate, setRate] = useState<number | null>(null);
        const [mainInsuranceCost, setMainInsuranceCost] = useState<number | null>(null);

        const checkSerialNumberExists = async (serialNumber: string | null) => {
                if (!serialNumber) {
                    setSerialCaption('Введите не пустое значение');
                    return false;
                }
            
                // Проверка на уникальность в текущем массиве itemsBatch
                if (itemsBatch.find(item => item.serialNumber === serialNumber)) {
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
        
        
        // Инициализация данных
        useEffect(() => {
                if (batchId) {
                        setIsLoading(true);
                } else {
                        setIsLoading(false);
                }
        }, [batchId, isOpen, setIsLoading]);

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
            
    
        useEffect(() => {
                const getData = async (batchId : number) => {
                                        await getPurchase(batchId, (resp) => {
                                                setData(resp);
                                                setIsLoading(false);
                                            });
                                }
                                const getItems = async (batchId : number) => {
                                        await getPurchaseItems(batchId, (resp) => {
                                                setItemsBatch(resp);
                                                setIsLoading(false);
                                            });
                                        }
                                const getWarehousesData = async () => {
                                                await getWarehouses((resp) => {
                                                        setWarehouses(resp.map((item : TWarehouse) => ({
                                                                warehouseId: item.warehouseId, 
                                                                name: item.name, 
                                                        })))
                                                });
                                        }
                                const getProducts = async () => {
                                                        await  getNomenclatures((resp) => setProductList(resp.map((item: TNomenclature) => ({ name: item.name, itemId: item.itemId, weightProduct: Number(item.weight) }))));
                                                        }
                if (batchId) {
                        getItems(batchId);
                        void getWarehousesData();
                        void getProducts();
                        getData(batchId).then(
                                () => {
                                setIsLoading(false);
                        }
                   );
                }
                
            }, [batchId, setData, isOpen]);
                       

        

        const acceptBatch = async (e: React.MouseEvent<Element, MouseEvent>, id : number) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch?.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0) ?? 0;
                const body = itemsBatch;
                try {
                        await updatePurchase( id ,{
                                comment: data.comment,
                                sum: totalSum,
                                batchId: batchId,
                                batchNumber: data.batchNumber,
                                batchStatus: 'COMPLETED',
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                body: body,

                        }).then(async(resp) => {
                                const body = itemsBatch.map(product => ({
                                        ...product,
                                        batchNumber: data.batchNumber,
                                        remainder: product.quantFinal,
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors);
                        setUpdateFlag(true);
                        setIsLoading(false);
                }
        }

        const returnBatch = async (e: React.MouseEvent<Element, MouseEvent> , id : number) => {
                setIsLoading(true);
                e.preventDefault();
                const totalSum = itemsBatch?.reduce((acc, item) => acc + (item.quant ?? 0) * (item.costPrice ?? 0), 0) ?? 0;
                const body = itemsBatch;
                try {
                        await updatePurchase( id , {
                                comment: data.comment,
                                sum: totalSum,
                                batchId: batchId,
                                batchNumber: data.batchNumber,
                                batchStatus: 'REGISTRATION',
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                body: body,

                        }).then(async(resp) => {
                                const body = itemsBatch.map(product => ({
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error : any) {
                        console.error('Ошибка при обновлении партии:', error);
                        setCaptionList(error?.response?.data?.errors);
                        setUpdateFlag(true);
                        setIsLoading(false);
                }
        }

        const checkSerialNumber = () => {
                if (itemsBatch?.filter(elem => elem.hasSerialNumber && !elem.serialNumber)?.find((item) =>
                        (item?.quant !== itemsBatch?.filter(el => ((el.itemId === item.itemId) && el.serialNumber && (el.partner === item.partner)))?.length))) {
                        return true;
                } else {
                        return false;
                }
        }

        const checkQuant = () => {

                if (itemsBatch?.filter(elem => !elem.hasSerialNumber)?.find((item) => (item?.quant !== item.quantFinal))) {
                        return true;
                        
                } else {
                        return false;
                }
        }

         const [role, setRole] = useState<string | undefined>(undefined);
                        
        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setRole(resp.role);
                        })
                };
                
                void getUserInfoData();
        }, []);



        
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
                                                <Text size="xl" view="brand" style={{width: '100%'}}  className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                        {batchId ? 'Партия ' +  data.batchNumber?.toString() : 'Новая партия'}
                                                </Text>
                                                {!batchId && (<TextField 
                                                        size="s" 
                                                        placeholder="Введите номер партии"
                                                        value={data?.batchNumber ? data?.batchNumber?.toString() : ''}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setData((prev: TPurchase) => ({
                                                                                ...prev,
                                                                                batchNumber:  Number(value),
                                                                        }))     
                                                                } else {
                                                                        setData((prev: TPurchase) => ({
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
                                                        {data.batchStatus === 'REGISTRATION' && (<Text size="m" weight="medium" view="caution" className={cnMixSpace({mL:'s', mT: 'xs'})}>
                                                                (На оприходовании)
                                                        </Text>)}
                                                        {data.batchStatus === 'COMPLETED' && (<Text size="m" weight="medium" view="caution" className={cnMixSpace({mL:'s', mT: 'xs'})}>
                                                                (Партия принята)
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
                                                }}
                                        />
                                </Layout>

                                {/* Шапка */}
                                <Text size="m" weight="semibold" className={cnMixSpace({ mT:'xl' })}>{`Список товаров партии (${itemsBatch?.filter?.(item => !item.serialNumber)?.length?.toString() ?? 0}):`}</Text>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })} >
                                        <div style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mR:'m' })}/>
                                        <Text size="s" style={{ width: '100%'}} className={cnMixSpace({  pL:'s' })}>Наименование</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Контрагент</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Количество</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Сер. номер</Text>
                                        <div style={{minWidth:'135px', maxWidth:'135px'}} className={cnMixSpace({ mR:'m' })}/>
                                        <Text size="s" style={{minWidth:'235px', maxWidth:'235px'}} className={cnMixSpace({ mR:'m' })} align="center">Склад</Text>
                                        <Text size="s" style={{minWidth:'150px', maxWidth:'150px'}} className={cnMixSpace({ mR:'m' })} align="center" onClick={()=> console.log(itemsBatch)}>Себестоимость</Text>

                                </Layout>
                                <Layout direction="column">
                                {itemsBatch.length > 0 && (itemsBatch?.filter((elem) => (elem.serialNumber === null || elem.serialNumber === undefined )).map(itemBatch => (
                                                                <Layout key={itemsBatch.indexOf(itemBatch).toString()} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(itemsBatch.indexOf(itemBatch) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({ pT:'s', pR: 's', pL:'s'})}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                                <Text size="s" style={{ width: '100%'}} className={cnMixSpace({mT: '2xs' })}>
                                                                                                        {itemBatch?.name && itemBatch?.itemId ? itemBatch.name : ''}
                                                                                                </Text>
                                                                                        </div>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs', mR:'m' })} align="center">
                                                                                                        {itemBatch?.partner}
                                                                                                </Text>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs' })} align="center">
                                                                                                        {itemBatch?.quant?.toString() + ' шт'}
                                                                                                </Text>
                                                                                        {itemBatch.itemId && (
                                                                                                <Layout  style={{minWidth:'100px', maxWidth:'100px', justifyContent: 'center'}} className={cnMixSpace({ mL:'m' })}>
                                                                                                        {itemBatch.hasSerialNumber ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : (<IconClose view="alert" style={{alignSelf: 'center'}}/>)}
                                                                                                </Layout>
                                                                                        )}
                                                                                                <div style={{minWidth:'135px', maxWidth:'135px'}} className={cnMixSpace({ mR:'m' })}>
                                                                                                        {itemBatch.hasSerialNumber && (
                                                                                                                <Layout direction="row">
                                                                                                                     <TextField 
                                                                                                                        id={itemsBatch.indexOf(itemBatch)}
                                                                                                                        placeholder="Серия" 
                                                                                                                        title='Нажмите Enter, чтобы добавить введенное значение' 
                                                                                                                        size="s"
                                                                                                                        value={(focusedIndex !== itemsBatch.indexOf(itemBatch)) ? null : itemsBatch?.filter(elem => ((elem.itemId === itemBatch.itemId) && (elem.serialNumber) && (elem.partner === itemBatch.partner))).length !== itemBatch.quant ? serialNumber : 'Заполнено'}
                                                                                                                        onChange={(value)=>{
                                                                                                                                if (value) {
                                                                                                                                        const convertedValue = convertRuToEn(value);
                                                                                                                                        const filteredValue = convertedValue.replace(/[^a-zA-Z0-9-]/g, '');
                                                                                                                                        setSerialNumber(filteredValue);
                                                                                                                                        // setSerialNumber(value);
                                                                                                                                        setSerialCaption(null)
                                                                                                                                } else {
                                                                                                                                        setSerialNumber(null)
                                                                                                                                        setSerialCaption(null)
                                                                                                                                }
                                                                                                                        }}
                                                                                                                        disabled={itemsBatch?.filter(elem => ((elem.itemId === itemBatch.itemId) && (elem.serialNumber) && (elem.partner === itemBatch.partner))).length === itemBatch.quant}
                                                                                                                        onKeyPress={async (event) => {
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
                                                                                                                                setItemsBatch(prev => ([...prev, {
                                                                                                                                        itemBatchId: null,
                                                                                                                                        batchId: itemBatch.batchId,
                                                                                                                                        itemId: itemBatch.itemId,
                                                                                                                                        costPrice: itemBatch.costPrice,
                                                                                                                                        costPriceAll: itemBatch.costPriceAll,
                                                                                                                                        costDeliver: itemBatch.costDeliver,
                                                                                                                                        batchNumber: itemBatch.batchNumber,
                                                                                                                                        name: itemBatch.name,
                                                                                                                                        hasSerialNumber: itemBatch.hasSerialNumber,
                                                                                                                                        quant: itemBatch.quant,
                                                                                                                                        serialNumber: serialNumber,
                                                                                                                                        warehouse: itemBatch.warehouse,
                                                                                                                                        partner: itemBatch.partner,
                                                                                                                                        createdAt: null,
                                                                                                                                        updatedAt: null,  
                                                                                                                                }]));
                                                                                                                                setSerialNumber(null);
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                        prev.map(product => (product.itemId === itemBatch.itemId &&  !product.serialNumber && (product.partner === itemBatch.partner)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                quantFinal: (product?.quantFinal ?? 0 )+ 1, 
                                                                                                                                                } : product
                                                                                                                                        ));
                                                                                                                                }
                                                                                                                                }
                                                                                                                                }
                                                                                                                                }
                                                                                                                                onPaste={async (event) => {
                                                                                                                                        event.preventDefault(); // Предотвращаем стандартное поведение вставки
                                                                                                                                    
                                                                                                                                        const clipboardData = event.clipboardData.getData('text'); // Получаем данные из буфера обмена
                                                                                                                                        const serialNumbers = clipboardData.split('\n'); // Разделяем по строкам
                                                                                                                                    
                                                                                                                                        for (const number of serialNumbers) {
                                                                                                                                          const convertedValue = convertRuToEn(number);
                                                                                                                                          const filteredValue = convertedValue.replace(/[^a-zA-Z0-9-]/g, '');
                                                                                                                                          const trimmedNumber = filteredValue; // Удаляем лишние пробелы
                                                                                                                                          if (trimmedNumber) { // Проверяем, что строка не пустая
                                                                                                                                            const isUnique = await checkSerialNumberExists(trimmedNumber);
                                                                                                                                            if (!isUnique) {
                                                                                                                                              const audio = new Audio(errorAudio);
                                                                                                                                              audio.play();
                                                                                                                                              continue; // Если номер не уникален, переходим к следующему
                                                                                                                                            }
                                                                                                                                    
                                                                                                                                            // Добавляем новый элемент в itemsBatch
                                                                                                                                            setItemsBatch(prev => ([...prev, {
                                                                                                                                              itemBatchId: null,
                                                                                                                                              batchId: itemBatch.batchId,
                                                                                                                                              itemId: itemBatch.itemId,
                                                                                                                                              costPrice: itemBatch.costPrice,
                                                                                                                                              costPriceAll: itemBatch.costPriceAll,
                                                                                                                                              costDeliver: itemBatch.costDeliver,
                                                                                                                                              batchNumber: itemBatch.batchNumber,
                                                                                                                                              name: itemBatch.name,
                                                                                                                                              hasSerialNumber: itemBatch.hasSerialNumber,
                                                                                                                                              quant: itemBatch.quant,
                                                                                                                                              serialNumber: trimmedNumber,
                                                                                                                                              warehouse: itemBatch.warehouse,
                                                                                                                                              partner: itemBatch.partner,
                                                                                                                                              createdAt: null,
                                                                                                                                              updatedAt: null,
                                                                                                                                            }]));
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }}
                                                                                                                            caption={(focusedIndex === itemsBatch.indexOf(itemBatch)) ? (serialCaption ?? undefined) : undefined}
                                                                                                                            status={(serialCaption && (focusedIndex === itemsBatch.indexOf(itemBatch))) ? 'alert' : undefined}
                                                                                                                            onFocus={() => {setFocusedIndex(itemsBatch.indexOf(itemBatch))}}
                                                                                                                        />
                                                                                                                </Layout>
                                                                                                                
                                                                                                        )}
                                                                                                        {!itemBatch.hasSerialNumber && (
                                                                                                                <TextField 
                                                                                                                        placeholder="Кол-во принято"
                                                                                                                        type="number"
                                                                                                                        incrementButtons={false}
                                                                                                                        value={itemBatch.quantFinal?.toString() ?? undefined} 
                                                                                                                        onChange={(value)=> {
                                                                                                                                if (value) {
                                                                                                                                        setItemsBatch(prev => 
                                                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                                                        { ...product, 
                                                                                                                                                        quantFinal: Number(value),
                                                                                                                                                        } : product
                                                                                                                                                )
                                                                                                                                                );
                                                                                                                                } else {
                                                                                                                                        setItemsBatch(prev => 
                                                                                                                                                prev.map(product => (itemsBatch.indexOf(product) === itemsBatch.indexOf(itemBatch)) ? 
                                                                                                                                                        { ...product, 
                                                                                                                                                        quantFinal: null,
                                                                                                                                                        } : product
                                                                                                                                                )
                                                                                                                                                );
                                                                                                                                }
                                                                                                                        }
                                                                                                                        } 
                                                                                                                        size="s"
                                                                                                                />
                                                                                                        )}
                                                                                                </div>
                                                                                                <Combobox 
                                                                                                        items={warehouses}
                                                                                                        getItemKey={item => item.warehouseId ?? 0}
                                                                                                        getItemLabel={item => item.name ?? ''}
                                                                                                        placeholder="Выберите склад"
                                                                                                        value={itemBatch?.warehouse ? {warehouseId: warehouses?.find(item => (item.name === itemBatch?.warehouse))?.warehouseId, name: itemBatch?.warehouse} : null} 
                                                                                                        onChange={(value)=> {
                                                                                                        if (value) {
                                                                                                                setItemsBatch(prev => 
                                                                                                                        prev.map(product => (itemBatch.itemId === product.itemId && (product.partner === itemBatch.partner) ) ? 
                                                                                                                                { ...product, 
                                                                                                                                        warehouse: value.name,
                                                                                                                                } : product
                                                                                                                        )
                                                                                                                        );
                                                                                                                } else {
                                                                                                                        setItemsBatch(prev => 
                                                                                                                                prev.map(product => (itemBatch.itemId === product.itemId && (product.partner === itemBatch.partner)) ? 
                                                                                                                                        { ...product, 
                                                                                                                                                warehouse: null,
                                                                                                                                        } : product
                                                                                                                                )
                                                                                                                        );
                                                                                                                }
                                                                                                                }
                                                                                                                } 
                                                                                                        size="s"
                                                                                                        style={{minWidth:'235px', maxWidth:'235px'}}
                                                                                                        caption={ captionList?.length > 0 && captionList?.find(item=>(item.state === "warehouse" && item.index === itemsBatch?.indexOf(itemBatch))) ? captionList?.find(item=>(item.state === "warehouse" && item.index === itemsBatch?.indexOf(itemBatch)))?.caption : undefined}
                                                                                                        status={captionList?.length > 0 && captionList?.find(item=>(item.state === "warehouse" && item.index === itemsBatch?.indexOf(itemBatch))) ? "alert" : undefined}
                                                                                                        onFocus={()=> {setCaptionList(prev => (prev.filter(item => (item.state !== 'warehouse'))))}}
                                                                                                        className={cnMixSpace({mR:'m'})}
                                                                                                />
                                                                                                {!mainCost ? (
                                                                                                        <NumberMaskTextField 
                                                                                                                placeholder="Себестоимость"
                                                                                                                incrementButtons={false}
                                                                                                                value={itemBatch.costPriceAll?.toString()} 
                                                                                                                onChange={(value : string | null)=> {
                                                                                                                        if (value) {
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                        prev.map(product => (itemBatch.itemId === product.itemId && (product.partner === itemBatch.partner)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                        costPriceAll: Number(value),
                                                                                                                                                } : product
                                                                                                                                        )
                                                                                                                                        );
                                                                                                                        } else {
                                                                                                                                setItemsBatch(prev => 
                                                                                                                                        prev.map(product => (itemBatch.itemId === product.itemId && (product.partner === itemBatch.partner)) ? 
                                                                                                                                                { ...product, 
                                                                                                                                                        costPriceAll: undefined,
                                                                                                                                                } : product
                                                                                                                                        )
                                                                                                                                        );
                                                                                                                        }
                                                                                                                }
                                                                                                                } 
                                                                                                                size="s"
                                                                                                                style={{minWidth:'150px', maxWidth:'150px'}}
                                                                                                        />
                                                                                                ) : (
                                                                                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({  mT: '2xs', mR:'m' })} align="center">
                                                                                                                {itemBatch?.costPriceAll ? Number(itemBatch?.costPriceAll)?.toFixed(2) : ''}
                                                                                                        </Text>
                                                                                                )}
                                                                                                
                                                                                </Layout>
                                                                                <Layout direction="row" className={itemsBatch?.filter(elem => ((elem.itemId === itemBatch.itemId) && (elem.serialNumber) && (elem.partner === itemBatch.partner))).length > 0 ? '' : cnMixSpace({ mB:'s' })} style={{ flexWrap: 'wrap' }}>
                                                                                        {itemsBatch?.filter(elem => ((elem.itemId === itemBatch.itemId) && (elem.serialNumber) && (elem.partner === itemBatch.partner))).map(prod =>(
                                                                                                <Tag 
                                                                                                        label={prod.serialNumber ?? ''} 
                                                                                                        mode="cancel" 
                                                                                                        onCancel={()=>{
                                                                                                                setItemsBatch(itemsBatch?.filter(el => (el.serialNumber !== prod.serialNumber)));
                                                                                                                setItemsBatch(prev => 
                                                                                                                        prev.map(product => (product.itemId === itemBatch.itemId && !product.serialNumber && (product.partner === itemBatch.partner)) ? 
                                                                                                                                { ...product, 
                                                                                                                                quantFinal: (product?.quantFinal ?? 0 ) - 1, 
                                                                                                                                } : product
                                                                                                                        ));
                                                                                                        }}
                                                                                                        className={cnMixSpace({ mL:'s', mV:'xs'})}
                                                                                                />
                                                                                        ))}
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                )))}
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'center', alignContent: 'center'}}>
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
                                                                className={cnMixSpace({ mT:'2xs', mL: 'xs'})}
                                                                style={{width: '100px'}}
                                                        />  
                                        </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'center', alignContent: 'center'}}>
                                                        <Text size="s" className={cnMixSpace({ mT:'xs' })} >Общ. стоимость доставки:</Text>
                                                        <NumberMaskTextField 
                                                                size="s"
                                                                value={mainCost}
                                                                placeholder='Введите общ. стоимость доставки'
                                                                onChange={(value : string | null) => {setMainCost(Number(value))}}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                        />
                                                        <InfoCircleFilled className={cnMixSpace({ mL:'s' })}/>
                                                        <Text size="xs"  view='secondary' className={cnMixSpace({ mL:'xs' })} >Сначала укажите кол-во принято или серийники</Text>
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'center', alignContent: 'center'}}>
                                                        <Text size="s" className={cnMixSpace({ mT:'xs' })} >Общ. стоимость страховки:</Text>
                                                        <NumberMaskTextField 
                                                                size="s"
                                                                value={mainInsuranceCost}
                                                                placeholder='Введите и нажмите Enter для расчёта'
                                                                onChange={(value : string | null) => {setMainInsuranceCost(Number(value))}}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                onKeyPress={async (event: any) => {
                                                                        if (event.key === 'Enter') {
                                                                                let totalWeight = 0;
                                                                                let totalPrice = 0;
                                                                                // Считаем общий вес продукции
                                                                                for (const item of itemsBatch) {
                                                                                    const product = productList.find(p => p.itemId === item.itemId);
                                                                                    if (product) {
                                                                                        totalWeight += Number(product.weightProduct || 0 ) * Number(item?.quantFinal || 0);

                                                                                    }
                                                                                }
                                                                                // Находим цену доставки за единицу веса
                                                                                const pricePerUnitWeight = (Number(mainCost)) / totalWeight;

                                                                                 // Считаем общую цену продукции
                                                                                 for (const item of itemsBatch) {
                                                                                        const product = productList.find(p => p.itemId === item.itemId);
                                                                                        if (product) {
                                                                                                totalPrice += Number(item.costPrice || 0 ) * Number(item?.quantFinal || 0);
                                                                                        }
                                                                                    }
                                                                                
                                                                                // Находим цену страховки за товар
                                                                                const priceInsuranceUnit = (Number(mainInsuranceCost)) / totalPrice;
                                                                                

                                                                                

                                                                                // Обновляем costPriceAll для каждого элемента itemsBatch
                                                                                const updatedItemsBatch = itemsBatch.map(item => {
                                                                                        const product = productList.find(p => p.itemId === item.itemId);
                                                                                        return {
                                                                                                ...item,
                                                                                                costDeliver: Number(pricePerUnitWeight * Number(product?.weightProduct || 0)) * Number(rate),
                                                                                                costPriceAll: Number(pricePerUnitWeight * Number(product?.weightProduct || 0)) * Number(rate) + Number(item.costPrice || 0) * Number(data?.rate)  + Number(priceInsuranceUnit * Number(item.costPrice || 0 ) * Number(rate)),
                                                                                        };
                                                                                })
                                                                                setItemsBatch(updatedItemsBatch)
                                                                                
                                                                        }
                                                                        }}
                                                        />
                                                        <InfoCircleFilled className={cnMixSpace({ mL:'s' })}/>
                                                        <Text size="xs"  view='secondary' className={cnMixSpace({ mL:'xs' })} >Сначала укажите общ.стоимость доставки и курс</Text>
                                                        <Button
                                                                label={'Расчитать'}
                                                                size="s"
                                                                className={cnMixSpace({ mL:'xs' })}
                                                                onClick={ () => {
                                                                         
                                                                                let totalWeight = 0;
                                                                                let totalPrice = 0;
                                                                                // Считаем общий вес продукции
                                                                                for (const item of itemsBatch) {
                                                                                    const product = productList.find(p => p.itemId === item.itemId);
                                                                                    if (product) {
                                                                                        totalWeight += Number(product.weightProduct || 0 ) * Number(item?.quantFinal || 0);

                                                                                    }
                                                                                }
                                                                                // Находим цену доставки за единицу веса
                                                                                const pricePerUnitWeight = (Number(mainCost) * Number(rate)) / totalWeight;

                                                                                 // Считаем общую цену продукции
                                                                                 for (const item of itemsBatch) {
                                                                                        const product = productList.find(p => p.itemId === item.itemId);
                                                                                        if (product) {
                                                                                                totalPrice += Number(item.costPrice || 0 ) * Number(rate) * Number(item?.quantFinal || 0);
                                                                                        }
                                                                                    }
                                                                                
                                                                                // Находим цену страховки за товар
                                                                                const priceInsuranceUnit = (Number(mainInsuranceCost) * Number(rate)) / totalPrice;
                                                                                

                                                                                

                                                                                // Обновляем costPriceAll для каждого элемента itemsBatch
                                                                                const updatedItemsBatch = itemsBatch.map(item => {
                                                                                        const product = productList.find(p => p.itemId === item.itemId);
                                                                                        return {
                                                                                                ...item,
                                                                                                costDeliver: Number(pricePerUnitWeight * Number(product?.weightProduct || 0)),
                                                                                                costPriceAll: Number(pricePerUnitWeight * Number(product?.weightProduct || 0)) * Number(rate) + Number(item.costPrice || 0) * Number(data?.rate)  + Number(priceInsuranceUnit * Number(item.costPrice || 0 ) * Number(rate)),
                                                                                        };
                                                                                })
                                                                                setItemsBatch(updatedItemsBatch)
                                                                                
                                                                        }
                                                                        }
                                                                        />
                                        </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'xl' })} style={{alignItems: 'end'}}>
                                                        <Text size="s" className={cnMixSpace({ mB:'xs' })} >Комментарий:</Text>
                                                        <TextField 
                                                                size="s"
                                                                type="textarea"
                                                                rows={1}
                                                                value={data?.comment}
                                                                onChange={(value) => { setData((prev: TPurchase) => ({
                                                                        ...prev,
                                                                        comment:  value,
                                                                        }))
                                                                }}
                                                                className={cnMixSpace({ mL:'2xs' })}
                                                                onFocus={()=>{setCaptionList(prev => prev?.filter(capt => (capt.state !== "comment")))}}
                                                                caption={ captionList?.length > 0 && captionList?.find(item=>((item.state === "comment"))) ? captionList?.find(item=>((item.state === "comment")))?.caption : undefined}
                                                                status={captionList?.length > 0 && captionList?.find(item=>((item.state === "comment"))) ? "alert" : undefined}
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
                                                    
                                                { (data.batchStatus === 'REGISTRATION') && 
                                                        <Button 
                                                                label={'Принять партию'}
                                                                view="primary"
                                                                iconLeft={IconCheck}
                                                                style={{backgroundColor: '#09b37b'}}
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (((checkQuant()) && (!data.comment)) || ((checkSerialNumber()) && (!data.comment))) {
                                                                                setCaptionList(prev => [...prev, {caption: 'Укажите в комментарии причину несоответствия объёмов товара', state:'comment'}])
                                                                        } else {
                                                                                if (itemsBatch.filter(item => !item.warehouse)?.length > 0) {
                                                                                        setCaptionList(prev => [...prev, {caption: 'Укажите склад', state:'warehouse', index: itemsBatch?.indexOf(itemsBatch.find(item => !item.warehouse) ?? itemsBatch[0]) }])

                                                                                } else {
                                                                                        if (batchId) {
                                                                                        acceptBatch(e, batchId);
                                                                                }
                                                                                }
                                                                                
                                                                        }
                                                                        
                                                                }}
                                                        />
                                                }   
                                                { (data.batchStatus === 'COMPLETED' && role === 'ADM') && 
                                                        <Button 
                                                                label={'Вернуть на приемку'}
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
export default ProductRegistrationDetailsModal