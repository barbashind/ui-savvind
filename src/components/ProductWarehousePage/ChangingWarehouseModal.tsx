import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { Combobox } from '@consta/uikit/Combobox';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';
import { RadioGroup } from '@consta/uikit/RadioGroup';

import { IconClose } from '@consta/icons/IconClose';

import { TNomenclature } from "../../types/nomenclature-types";
import {  getProductBySerial } from "../../services/SalesService";
import { changeWarehouseByName, changeWarehouseBySerial, getItemsPurchaseReturn, getNomenclatures } from "../../services/PurchaseService";
import { TPurchaseItem } from "../../types/product-purchase-types";
import { TPurchaseItemFilter } from "../../types/purchase-types";
import { Tag } from "@consta/uikit/Tag";
import { TWarehouse } from "../../types/settings-types";
import { getWarehouses } from "../../services/SettingsService";

interface TChangingWarehouseModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ChangingWarehouseModal = ({isOpen, setIsOpen, setUpdateFlag} : TChangingWarehouseModalProps) => {

        const closeWindow = () => {
                setIsOpen(false);
                setSerialNumber(null);
                setSerialNums(null);
                setSerialCaption(null);
                setActiveTab(tabs[0]);
                setWarehouse(null);
                setItem(null);
                setItems([]);
                setProduct(null);
                setQuant(0);
                setUpdateFlag(true);
        }
        const [productList, setProductList] = useState<TNomenclature[]>([]);
       

        const [serialNumber, setSerialNumber] = useState<string | null>(null);
        const [product, setProduct] = useState<TNomenclature | null>(null);
       
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isSearch, setIsSearch] = useState<boolean>(false);

useEffect(() => {
        const getProducts = async () => {
                                await  getNomenclatures((resp) => {
                                        setProductList(resp);
                                        setIsLoading(false);
                                        });
                                }
        getProducts();
                
}, [isOpen]);

        

const getItemsData = async () => {
                const filterParam : TPurchaseItemFilter = {
                        searchText: product?.name ?? null,
                        warehouse: null,
                }
                        await getItemsPurchaseReturn({filterParam}).then((resp) => {
                                 setItems(resp);
                                        setIsLoading(false);
                        });
                               
        }

const tabs = [
        {
                id: 0,
                label: 'По серийным номерам',
        },
        {
                id: 1,
                label: 'По товарам (без сер.ном.)',
        },

]

const [activeTab, setActiveTab] = useState(tabs[0])
        
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
        
const [serialCaption, setSerialCaption] = useState<string | null>(null);

const checkSerialNumberExists = async (serialNumber: string | null) => {
                if (!serialNumber) {
                    setSerialCaption('Введите не пустое значение');
                    return false;
                }
            
                // Проверка на уникальность в текущем массиве itemsBatch
                if (serialNums?.find(item => item === serialNumber)) {
                    setSerialCaption('Значение повторяется');
                    return false;
                }

                let checked = false
            
                // Проверка на уникальность с помощью API
                await getProductBySerial(serialNumber, (resp)=>{
                        if (resp) {
                                checked = true   
                        } else {
                                setSerialCaption('Значения нет в базе данных');
                                checked = false
                        }
                })

                return checked;
            }

const [serialNums, setSerialNums] = useState<string[] | null>(null)

const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);
const [warehouse, setWarehouse] = useState<TWarehouse | null>(null);

const [items, setItems] = useState<TPurchaseItem[]>([]);

const [item, setItem] = useState<TPurchaseItem | null>(null);
const [quant, setQuant] = useState<number>(0);

useEffect(() => {
                
        const getWarehousesData = async () => {
                await getWarehouses((resp) => {
                        setWarehouses(resp.map((item : TWarehouse) => ({
                                warehouseId: item.warehouseId, 
                                name: item.name, 
                        })))
                        setWarehouse(resp[0])
                });
        }
        if (activeTab.id === 0) {
                void getWarehousesData()
        }
        
}, [activeTab]);

const changeWarehouseBySerialNum = async () => {
        await changeWarehouseBySerial(warehouse?.name, serialNums).then(()=>{
                setIsLoading(false);
                closeWindow();
        })
}

const changeWarehouseByItem = async () => {
        await changeWarehouseByName(warehouse?.name, item?.itemBatchId, quant).then(()=>{
                setIsLoading(false);
                closeWindow();
        })
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
                                                        {'Перенос на новый склад'}
                                                </Text>
                                        </Layout>
                                        
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        closeWindow();
                                                }}
                                        />
                                </Layout>
                                <Layout direction="row">
                                        <RadioGroup
                                                items={tabs}
                                                value={activeTab}
                                                onChange={(value) => {
                                                        setActiveTab(value);
                                                }}
                                                direction="row"
                                                className={cnMixSpace({p:'l'})}
                                                style={{gap: 24}}
                                        />

                                </Layout>
                                {activeTab.id === 0 && (
                                        <Layout direction="column">
                                        <Layout direction="row" style={{ alignItems: 'center'}} className={cnMixSpace({mT:'l'})}>
                                        <Text className={cnMixSpace({mR:'s'})} size="s" style={{width: '140px'}}>Серийный номер:</Text>
                                            <TextField 
                                                placeholder="Нажмите Enter после ввода значения" 
                                                size="s"
                                                value={serialNumber}
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
                                                onKeyPress={async (event) => {
                                                        if (event.key === 'Enter') {
                                                        const isUnique = await checkSerialNumberExists(serialNumber);

                                                        if (!isUnique) {
                                                                setSerialNumber(null)
                                                        return; // Если серийный номер не уникален, прекращаем выполнение
                                                        } else if (serialNumber) {
                                                        
                                                                const audio = new Audio('/src/assets/Audio/checkProduct.mp3');
                                                                audio.play(); 
                                                                setSerialNums((prev) => prev ? [...prev, serialNumber] : [serialNumber])
                                                                setSerialNumber(null);
                                                                }
                                                        }}}
                                                
                                                caption={serialCaption ?? undefined}
                                                status={serialCaption ? 'alert' : undefined}
                                                style={{width: '100%'}}
                                                />
                                        </Layout>
                                                <Layout direction="row" className={serialNums && serialNums?.length > 0 ? '' : cnMixSpace({ mB:'s' })} style={{ flexWrap: 'wrap' }}>
                                                        {serialNums?.map(prod =>(
                                                                <Tag
                                                                        label={prod ?? ''} 
                                                                        mode="cancel" 
                                                                        onCancel={()=>{
                                                                                setSerialNums(serialNums?.filter(el => (el !== prod)));
                                                                        }}
                                                                        className={cnMixSpace({ mL:'s', mV:'xs'})}
                                                                />
                                                        ))}
                                                </Layout>
                                                <Layout direction="row" style={{ alignItems: 'center'}} className={cnMixSpace({mT:'l'})}>
                                                        <Text size="s" className={cnMixSpace({mR:'xs'})}>Выберите склад:</Text>
                                                        <Combobox 
                                                                items={warehouses}
                                                                getItemKey={item => item.warehouseId ?? 0}
                                                                getItemLabel={item => item.name ?? ''}
                                                                placeholder="Выберите склад"
                                                                value={warehouse} 
                                                                onChange={(value)=> {
                                                                        if (value) {
                                                                                setWarehouse(value);
                                                                        } else {
                                                                                setWarehouse(null);
                                                                        }
                                                                        }
                                                                        } 
                                                                size="s"
                                                                style={{minWidth:'235px', maxWidth:'235px'}}
                                                                className={cnMixSpace({mR:'m'})}
                                                                caption={!warehouse ? 'Выберите склад' : undefined}
                                                                status={!warehouse ? 'alert' : undefined}
                                                        />
                                                         <Button 
                                                                label={'Перенести на новый склад'}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={()=>{
                                                                        if (serialNums && warehouse) {
                                                                                setIsLoading(true)
                                                                                changeWarehouseBySerialNum();
                                                                        }
                                                                }}
                                                                disabled={!serialNums || serialNums?.length === 0 || !warehouse}
                                                        />                                                
                                                </Layout>
                                        </Layout>
                                )}

                                {activeTab.id === 1 && (
                                        <Layout direction="column">
                                                <Layout direction="row" className={cnMixSpace({ mT:'m' })} style={{alignItems: 'center'}}>
                                                <Text size="s" style={{minWidth: '50px', maxWidth: '50px'}} align="left" className={cnMixSpace({ mR:'xs' })}>Товар:</Text>
                                                <Combobox
                                                        value={product}
                                                        items={productList.filter(item => (!item.hasSerialNumber))}
                                                        onChange={(value)=>{
                                                                if (value) {
                                                                        setProduct(value);
                                                                } else {
                                                                        setProduct(null);
                                                                }
                                                        }}
                                                        getItemKey={item => item.itemId ?? 0}
                                                        getItemLabel={item => item.name ?? ''}
                                                        placeholder="Выберите товар"
                                                        size="s"
                                                        className={cnMixSpace({ mR:'m' })}
                                                />
                                                <Button 
                                                        label={'Поиск'}
                                                        view="secondary"
                                                        size="s"
                                                        onClick={() => {
                                                                setIsLoading(true);
                                                                setIsSearch(true);
                                                                setItem(null);
                                                                getItemsData();
                                                        }}

                                                />
                                        </Layout>
                                        </Layout>
                                )}
                               
                                        
                        {isSearch && activeTab.id === 1 && (
                                <Layout direction="column">
                                        <Text size="s" view="secondary" weight="semibold" className={cnMixSpace({mT:'s'})}>Удалось найти (выберите нужный):</Text>
                                        {isLoading && (
                                               <Layout style={{ minHeight: '150px', alignItems: 'center', justifyContent: 'center'}}>
                                                                                      <Loader size="m" />
                                                                              </Layout>  
                                        )}
                                        {(items.length > 0) && !isLoading &&  items.map((elem) => (
                                                <Layout 
                                                        direction="row" 
                                                        className={cnMixSpace({mT:'s', p: 's'})} 
                                                        style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px', cursor: 'pointer', backgroundColor: elem === item ? '#ecf1f4' : ''}}
                                                        onClick={()=> {
                                                                setItem(elem);
                                                        }}
                                                >
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '30px', maxWidth: '30px'}}>{elem.batchNumber}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{ width: '100%'}}>{elem.name}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{elem.costPrice + ' руб'}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{elem.remainder + ' шт'}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{elem.partner}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '100px', maxWidth: '100px'}}>{elem.warehouse}</Text>
                                                        
                                                </Layout>
                                        ))}
                                        <Layout direction="row" className={cnMixSpace({mT:'l'})}>
                                                <TextField 
                                                        placeholder="Укажите кол-во"
                                                        size="s"
                                                        value={quant.toString()}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setQuant(Number(value))
                                                                } else {
                                                                        setQuant(0);
                                                                }
                                                        }}
                                                        type="number"
                                                        className={cnMixSpace({mR:'m'})}
                                                        style={{width: '150px'}}
                                                        caption={(quant > Number(item?.remainder)) ? 'Значение больше остатка' : undefined}
                                                        status={(quant > Number(item?.remainder)) ? 'alert' : undefined}
                                                />
                                                <Combobox 
                                                        items={warehouses}
                                                        getItemKey={item => item.warehouseId ?? 0}
                                                        getItemLabel={item => item.name ?? ''}
                                                        placeholder="Выберите склад"
                                                        value={warehouse} 
                                                        onChange={(value)=> {
                                                                if (value) {
                                                                        setWarehouse(value);
                                                                } else {
                                                                        setWarehouse(null);
                                                                }
                                                                }
                                                                } 
                                                        size="s"
                                                        style={{minWidth:'235px', maxWidth:'235px'}}
                                                        className={cnMixSpace({mR:'m'})}
                                                        caption={!warehouse ? 'Выберите склад' : (warehouse?.name === item?.warehouse) ? "Указан исходный склад" :   undefined}
                                                        status={(!warehouse || (warehouse?.name === item?.warehouse)) ? 'alert' : undefined}
                                                />
                                                <Button 
                                                                label={'Перенести на новый склад'}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={()=>{
                                                                        if (item && warehouse && quant) {
                                                                                setIsLoading(true)
                                                                                changeWarehouseByItem();
                                                                        }
                                                                }}
                                                                disabled={!item || !quant || !warehouse}
                                                        />  
                                        </Layout>
                                        
                                </Layout>
                        )}
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
export default ChangingWarehouseModal;