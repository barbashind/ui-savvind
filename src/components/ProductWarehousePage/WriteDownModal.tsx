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

import { TNomenclature } from "../../types/nomenclature-types";
import {  getProductBySerial } from "../../services/SalesService";
import { deletePurchaseItem, getItemsPurchaseReturn, getNomenclatures, returnPurchaseItem } from "../../services/PurchaseService";
import { TPurchaseItem } from "../../types/product-purchase-types";
import { TPurchaseItemFilter } from "../../types/purchase-types";

interface TWriteDownModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const WriteDownModal = ({isOpen, setIsOpen, setUpdateFlag} : TWriteDownModalProps) => {

        const closeWindow = () => {
                setIsOpen(false);
                setIsSearch(false);
                setItem(null);
                setItems([]);
                setSerialNumber(null);
                setProduct(null);
                setUpdateFlag(true);
        }
        const [productList, setProductList] = useState<TNomenclature[]>([]);
       
        const [caption, setCaption] = useState<string | null>(null);

        const [serialNumber, setSerialNumber] = useState<string | null>(null);
        const [product, setProduct] = useState<TNomenclature | null>(null);
       
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isSearch, setIsSearch] = useState<boolean>(false);

        const [items, setItems] = useState<TPurchaseItem[]>([]);
        const [item, setItem] = useState<TPurchaseItem | null>(null);



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

const getProduct = async (serialNumber : string | null) => {
                await getProductBySerial(serialNumber, (resp) => {
                        if (resp && !resp.isSaled) {
                                setCaption('Товар найден');
                                setItem(resp);
                        } else {
                                setCaption('Товар не найден');
                        }
                }).catch(()=>{
                        setCaption('Товар не найден');
                })   
        }

        


const writeDownProduct = async (product : TPurchaseItem) => {
        if (product.hasSerialNumber) {
                await deletePurchaseItem(product.itemBatchId).then(() => {
                        closeWindow()
                }
                        ).catch(()=>{
                        setCaption('Товар не найден');
                })   
        } else {
                await returnPurchaseItem(product.itemBatchId).then(() => {
                        closeWindow()
                }
                        ).catch(()=>{
                        setCaption('Товар не найден');
                })
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
                                                        {'Списание товара'}
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
                                {!isSearch && (
                                <Layout direction="column" className={cnMixSpace({ mT:'m' })}>
                                        <Text size="s" weight="semibold" align="center">По серийному номеру</Text>
                                        <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                                <TextField
                                                        size="s"
                                                        value={serialNumber}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setSerialNumber(value);
                                                                } else {
                                                                        setSerialNumber(null);
                                                                }
                                                        }}
                                                        placeholder="Введите сер. номер"
                                                        caption={caption ?? undefined}
                                                        status={caption === 'Товар не найден' ? 'alert' : caption === 'Товар найден' ? 'success' : undefined}
                                                        onFocus={()=>{
                                                                setCaption(null);
                                                        }}
                                                />
                                                <Button 
                                                        label={'Проверить'}
                                                        view="secondary"
                                                        className={cnMixSpace({mL:'s'})}
                                                        size="s"
                                                        onClick={()=>{
                                                                getProduct(serialNumber);
                                                        }}
                                                />
                                                <Button 
                                                        label={'Списать'}
                                                        view="primary"
                                                        size="s"
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={()=>{
                                                                if (item) {
                                                                        writeDownProduct(item);
                                                                }
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                )}
                                {!isSearch && (
                                        <Layout direction="column" className={cnMixSpace({ mT:'l' })}>
                                        <Text size="s" weight="semibold" align="center">По поиску товара</Text>
                                        <Layout direction="row" className={cnMixSpace({ mT:'m' })} style={{alignItems: 'center'}}>
                                                <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} align="right" className={cnMixSpace({ mR:'xs' })}>Товар:</Text>
                                                <Combobox
                                                        value={product}
                                                        items={productList}
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
                                                />
                                        </Layout>
                                        <Layout direction="row" style={{ justifyContent: 'center'}} className={cnMixSpace({mT:'s'})}>
                                                <Button 
                                                        label={'Поиск'}
                                                        view="secondary"
                                                        size="s"
                                                        onClick={() => {
                                                                setIsLoading(true);
                                                                setIsSearch(true);
                                                                getItemsData();
                                                        }}
                                                />
                                        </Layout>
                                </Layout>
                        )}
                        {isSearch && (
                                <Layout direction="column">
                                        <Text size="s" view="secondary" weight="semibold" className={cnMixSpace({mT:'s'})}>Удалось найти (выберите нужный):</Text>
                                        {isLoading && (
                                               <Layout style={{ minHeight: '150px', alignItems: 'center', justifyContent: 'center'}}>
                                                                                      <Loader size="m" />
                                                                              </Layout>  
                                        )}
                                        {(items.length > 0) && items.map((elem) => (
                                                <Layout 
                                                        direction="row" 
                                                        className={cnMixSpace({mT:'s', p: 's'})} 
                                                        style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px', cursor: 'pointer'}}
                                                        onClick={()=>{
                                                                writeDownProduct(elem);
                                                        }}
                                                >
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '30px', maxWidth: '30px'}}>{elem.batchNumber}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{ width: '100%'}}>{elem.name}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{elem.costPrice + ' руб'}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{elem.partner}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '100px', maxWidth: '100px'}}>{elem.warehouse}</Text>
                                                </Layout>
                                        ))}
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
export default WriteDownModal;