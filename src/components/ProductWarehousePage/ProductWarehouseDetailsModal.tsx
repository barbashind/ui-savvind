import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { IconClose } from '@consta/icons/IconClose';
import { IconAllDone } from '@consta/icons/IconAllDone';
import { IconArrowUndone } from '@consta/icons/IconArrowUndone';

import { getPurchase, getPurchaseItems, updatePurchase, updatePurchaseItems } from "../../services/PurchaseService";
import { TPurchase } from "../../types/purchase-types";
import { TPurchaseItem } from "../../types/product-purchase-types";


interface TProductWarehouseDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        batchId: number | undefined;
        setBatchId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ProductWarehouseDetailsModal = ({isOpen, setIsOpen, batchId, setBatchId,  setUpdateFlag} : TProductWarehouseDetailsModalProps) => {
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
        }

        const closeWindow = () => {
                setData(defaultData);
                setItemsBatch([defaultItem]);
                setIsOpen(false);
                setBatchId(undefined);
        }
        const [data, setData] = useState<TPurchase>(defaultData);
        const [itemsBatch, setItemsBatch] = useState<TPurchaseItem[]>([defaultItem]);
        const [isLoading, setIsLoading] = useState<boolean>(batchId ? true : false);
        
        // Инициализация данных
        useEffect(() => {
                if (batchId) {
                        setIsLoading(true);
                } else {
                        setIsLoading(false);
                }
        }, [batchId, isOpen, setIsLoading]);

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
                                        
                        
        
                        if (batchId) {
                                getItems(batchId);  
                                getData(batchId).then(
                                        () => {
                                        setIsLoading(false);
                                }
                           );
                        }
                        
                    }, [batchId, setData, isOpen]);

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
                                setUpdateFlag(true);
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
                                                        {batchId ? 'Партия ' +  data.batchNumber?.toString() : 'Новая партия'}
                                                </Text>
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
                                <Text size="m" weight="semibold" className={cnMixSpace({ mT:'xl' })}>{`Список товаров партии (${itemsBatch?.length?.toString() ?? 0}):`}</Text>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })} >
                                        <div style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mR:'m' })}/>
                                        <Text size="s" style={{ width: '100%'}} className={cnMixSpace({  pL:'s' })}>Наименование</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Контрагент</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Кол-во закуп.</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Сер. номер</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mL:'m' })} align="center">Кол-во принято</Text>
                                        <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} className={cnMixSpace({ mH:'m' })} align="center" >Осталось</Text>
                                </Layout>
                                <Layout direction="column">
                                {(itemsBatch.length > 0) && itemsBatch?.filter((elem) => (!elem.serialNumber )).map(itemBatch => (
                                                                <Layout key={itemsBatch.indexOf(itemBatch).toString()} direction="row" className={cnMixSpace({ mT:'s' })}>
                                                                        <Text size="s" style={{minWidth:'15px', maxWidth:'15px'}} className={cnMixSpace({ mT:'l', mR:'m' })}>{(itemsBatch?.filter((elem) => (!elem.serialNumber ))?.indexOf(itemBatch) + 1).toString()}</Text>
                                                                        <Layout direction="column" style={{border:'1px solid #0078d2', borderRadius:'5px', width: '100%'}}>

                                                                                <Layout direction="row" style={{width: '100%'}} className={cnMixSpace({ pV:'s', pR: 's', pL:'s'})}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                                <Text size="s" style={{ width: '100%'}} className={cnMixSpace({mT: '2xs' })}>
                                                                                                        {itemBatch?.name && itemBatch?.itemId ? itemBatch.name : ''}
                                                                                                </Text>
                                                                                        </div>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} align='center' className={cnMixSpace({  mT: '2xs', mR: 'm' })}>
                                                                                                        {itemBatch?.partner}
                                                                                                </Text>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} align='center' className={cnMixSpace({  mT: '2xs', mR: 'm' })}>
                                                                                                        {itemBatch?.quant?.toString() + ' шт'}
                                                                                                </Text>
                                                                                                {itemBatch.itemId && (
                                                                                                <Layout  style={{minWidth:'100px', maxWidth:'100px', justifyContent: 'center'}}  className={cnMixSpace({  mR: 'm' })}>
                                                                                                        {itemBatch.hasSerialNumber ? (<IconAllDone view="success" style={{alignSelf: 'center'}}/>) : (<IconClose view="alert" style={{alignSelf: 'center'}}/>)}
                                                                                                </Layout>
                                                                                                )}

                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} align='center' className={cnMixSpace({  mT: '2xs', mR: 'm'  })} >
                                                                                                        {itemBatch?.quantFinal?.toString() + ' шт'}
                                                                                                </Text>
                                                                                                <Text size="s" style={{minWidth:'100px', maxWidth:'100px'}} align='center' className={cnMixSpace({  mT: '2xs' })}>
                                                                                                        {(!itemBatch.hasSerialNumber ? itemBatch?.remainder?.toString() : itemsBatch?.filter(elem => ((elem.itemId === itemBatch.itemId && elem.partner === itemBatch.partner ) && elem.serialNumber && !elem.isSaled))?.length.toString()) + ' шт'}
                                                                                                </Text>
                                                                                </Layout>
                                                                        </Layout>  
                                                                </Layout>
                                                ))}
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
                                                    
                                                { (data.batchStatus === 'COMPLETED') && 
                                                        <Button 
                                                                label={'Вернуть на приемку'}
                                                                iconLeft={IconArrowUndone}
                                                                style={{backgroundColor: !itemsBatch?.find(elem => elem.quantFinal !== elem.remainder) ? '#ffa10a' : '#97b2c4'}}
                                                                view="primary"
                                                                size="s"
                                                                className={cnMixSpace({ mL:'m' })}
                                                                onClick={(e)=>{
                                                                        if (batchId) {
                                                                                returnBatch(e, batchId);
                                                                        }
                                                                }}
                                                                disabled={!!itemsBatch?.find(elem => elem.quantFinal !== elem.remainder)}
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
export default ProductWarehouseDetailsModal