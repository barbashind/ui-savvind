import React from "react"
import { useEffect, useState } from "react"

// Компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { Combobox } from '@consta/uikit/Combobox';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';
import { Checkbox } from '@consta/uikit/Checkbox';

// иконки
import { IconClose } from '@consta/icons/IconClose';


// Собственные компоненты
import { IdLabel } from "../../utils/types"; 
import NumberMaskTextField from "../../utils/NumberMaskTextField.js";
import { addNomenclature, getNomenclature, getProductType, getProductTypes, updateNomenclature } from "../../services/NomenclatureService.js";
import { TNomenclature } from "../../types/nomenclature-types";

interface TNomenclatureDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        id: number | undefined;
        setId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const NomenclatureDetailsModal = ({isOpen, setIsOpen, id, setId,  setUpdateFlag} : TNomenclatureDetailsModalProps) => {
        const defaultData : TNomenclature = {
                itemId: undefined,
                name: null,
                lastCostPrice: null,
                weight: null,
                isMessageActive: false,
                remains: null,
                productType: undefined,
                brand: null,
                productHeight: null,
                productWidth: null,
                productLength: null,
                createdAt: null,
                updatedAt: null,
                altName: null,
                productColor: null,
                productPrice: null,
                printName: null,
                productModel: null,
                productMemory: null,
                productCountry: null,
                productSim: null,
                remainsSum: null,
                hasSerialNumber: false,
        }
        const [data, setData] = useState<TNomenclature>(defaultData);
        const [types, setTypes] = useState<IdLabel[]>([]);
        const [type, setType] = useState<IdLabel>();
        const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);
        const [caption, setCaption] = useState<string | undefined>(undefined);
        // Инициализация данных
        
        

        useEffect(() => {
                const getData = async (id: number) => {
                                await getNomenclature(id, (resp) => {
                                        setData(resp);
                                        
                                });
                                await getProductType(data.productType, (resp: IdLabel) => {
                                        setType({id: resp.id , label: resp.label});
                                        setIsLoading(false);
                                })
                }
                if (id) {
                   getData(id).then(
                        () => {
                                setIsLoading(false);
                        }
                   );
                }
                void getProductTypes((resp) => {
                        setTypes(resp)
                })
                
            }, [data.productType, id, setData]);

        const createNomenclature = async (e: React.MouseEvent<Element, MouseEvent>) => {
                e.preventDefault();
                        await addNomenclature({
                        name: data.name,
                        lastCostPrice: Number(data.lastCostPrice),
                        weight: Number(data.weight),
                        productType: data.productType,
                        remains: data.remains,
                        brand: data.brand,
                        productHeight: Number(data.productHeight),
                        productWidth: Number(data.productWidth),
                        productLength: Number(data.productLength),
                        altName: data.altName,
                        productColor: data.productColor,
                        productPrice: data.productPrice,
                        printName: data.printName,
                        productModel: data.productModel,
                        productMemory: data.productMemory,
                        productCountry: data.productCountry,
                        productSim: data.productSim,
                        isMessageActive: data.isMessageActive,
                        remainsSum: (data.lastCostPrice && data.remains) ? data.lastCostPrice * data.remains : null,
                        hasSerialNumber: data.hasSerialNumber,
                                }).then(() => {  setUpdateFlag(true)
                                setIsOpen(false);
                                setData(defaultData);
                                setId(undefined);
                                setType(undefined);
                        }).catch(
                                (error) => {
                                        setCaption(error?.error?.statusText);
                                }
                        )
                }

        const updateNomenclatureData = async (e: React.MouseEvent<Element, MouseEvent>, id: number | undefined) => {
                e.preventDefault();
                await updateNomenclature( id, {
                        name: data.name,
                        lastCostPrice: Number(data.lastCostPrice),
                        weight: Number(data.weight),
                        productType: data.productType,
                        remains: data.remains,
                        brand: data.brand,
                        productHeight: Number(data.productHeight),
                        productWidth: Number(data.productWidth),
                        productLength: Number(data.productLength),
                        altName: data.altName,
                        productColor: data.productColor,
                        productPrice: data.productPrice,
                        printName: data.printName,
                        productModel: data.productModel,
                        productMemory: data.productMemory,
                        productCountry: data.productCountry,
                        productSim: data.productSim,
                        isMessageActive: data.isMessageActive,
                        remainsSum: (data.lastCostPrice && data.remains) ? data.lastCostPrice * data.remains : null,
                        hasSerialNumber: data.hasSerialNumber,
                }).then(
                       () => { 
                                setUpdateFlag(true);
                                setIsOpen(false);
                        }
                );
        }
        
        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onClickOutside={() => {
                                setIsOpen(false);
                                // setIsLoading(true);
                                setData(defaultData);
                                setId(undefined);
                                setType(undefined);
                        }}
                        onEsc={() => {
                                setIsOpen(false);
                                // setIsLoading(true);
                                setData(defaultData);
                                setId(undefined);
                                setType(undefined);
                        }}
                        style={{width: '50%'}}
                >
                        {!isLoading && (
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xl' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Text size="xl" view="brand" className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                               {id ? 'Детализация товара' : 'Создать новый товар'}
                                        </Text>
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        setIsOpen(false);
                                                        // setIsLoading(true);
                                                        setData(defaultData);
                                                        setId(undefined);
                                                        setType(undefined);
                                                }}
                                        />
                                </Layout>
                                <Text size="s" className={cnMixSpace({ mT:'xl' })} onClick={()=>{console.log(caption)}}>Наименование:</Text>
                                <TextField 
                                        size="s"
                                        type="textarea"
                                        rows={3}
                                        value={data?.name}
                                        onChange={(value) => { setData(prev => ({
                                                ...prev,
                                                name:  value,
                                                }))
                                        }}
                                        className={cnMixSpace({ mT:'2xs' })}
                                        caption={caption}
                                        status={caption ? 'alert' : undefined}
                                        onFocus={()=>{setCaption(undefined)}}
                                />
                                <Text size="s" className={cnMixSpace({ mT:'xl' })}>Альтернативное наименование:</Text>
                                <TextField 
                                        size="s"
                                        type="textarea"
                                        maxRows={3}
                                        value={data?.altName}
                                        onChange={(value) => { setData(prev => ({
                                                ...prev,
                                                altName:  value,
                                                }))
                                        }}
                                        className={cnMixSpace({ mT:'2xs' })}
                                />
                                <Text size="s" className={cnMixSpace({ mT:'xl' })}>Наименование для печати:</Text>
                                <TextField 
                                        size="s"
                                        type="textarea"
                                        maxRows={3}
                                        value={data?.printName}
                                        onChange={(value) => { setData(prev => ({
                                                ...prev,
                                                printName:  value,
                                                }))
                                        }}
                                        className={cnMixSpace({ mT:'2xs' })}
                                />
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                        <Layout direction="column">
                                                <Text size="s" >Бренд:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.brand?.toString()}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                brand:  value,
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Модель:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.productModel?.toString()}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                productModel:  value,
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Цвет:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.productColor}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                productColor:  value,
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Страна:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.productCountry?.toString()}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                productCountry:  value,
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                        <Layout direction="column" flex={0.845}>
                                                <Text size="s" >Тип товара:</Text>
                                                <Combobox
                                                        size="s" 
                                                        value={type}
                                                        items={types}
                                                        placeholder="Выберите тип товара"
                                                        style={{width: data.productType === 'Мобильное устройство' ? '100%' : '53.4%'}}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productType:  value?.label,
                                                                        }));
                                                                        setType({id: value?.id ?? 0, label: value.label});        
                                                                } else {
                                                                        setType(undefined)
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productType:  undefined,
                                                                        }));
                                                                }
                                                                
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />     
                                        </Layout>
                                        {data.productType === 'Мобильное устройство' && (
                                        <Layout direction="row" >
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s" >Память:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.productMemory?.toString()}
                                                        type="number"
                                                        incrementButtons={false}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                productMemory:  Number(value),
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">SIM:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.productSim?.toString()}
                                                        onChange={(value) => { setData(prev => ({
                                                                ...prev,
                                                                productSim:  value,
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        
                                </Layout>
                                )}
                                        
                                </Layout>

                                <Layout direction="row">
                                <Layout direction="column">
                                                <Text size="s" className={cnMixSpace({ mT:'m' })}>Цена:</Text>
                                                <NumberMaskTextField
                                                        size="s" 
                                                        value={data?.productPrice?.toString()}
                                                        onChange={(value: string | null) => { setData(prev => ({
                                                                ...prev,
                                                                productPrice:  Number(value),
                                                                }))
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                        
                                                />
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s" className={cnMixSpace({ mT:'m' })}>Последняя цена закупки:</Text>
                                                <NumberMaskTextField 
                                                        size="s" 
                                                        value={data?.lastCostPrice?.toString()}
                                                        onChange={(value: string | null) => {
                                                                if (value) {
                                                                   setData(prev => ({
                                                                ...prev,
                                                                lastCostPrice:  Number(value),
                                                                }))     
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                lastCostPrice:  0,
                                                                                }))       
                                                                }
                                                        }}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                        <Layout direction="column">
                                                <Text size="s" >Высота (м):</Text>
                                                <NumberMaskTextField 
                                                        size="s" 
                                                        value={data?.productHeight?.toString()}
                                                        onChange={(value: string | null) => { 
                                                                if (value) {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productHeight:  value,
                                                                        }))
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productHeight:  null, 
                                                                        }))
                                                                }
                                                        }}
                                                        scale={3}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Ширина (м):</Text>
                                                <NumberMaskTextField 
                                                        size="s" 
                                                        value={data?.productWidth?.toString()}
                                                        onChange={(value: string | null) => { 
                                                                if (value) {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productWidth:  value,
                                                                        }))
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productWidth:  null, 
                                                                        }))
                                                                }
                                                        }}
                                                        scale={3}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Длина (м):</Text>
                                                <NumberMaskTextField 
                                                        size="s" 
                                                        value={data?.productLength?.toString()}
                                                        onChange={(value : string | null) => { 
                                                                if (value) {
                                                                        setData(prev => ({
                                                                        ...prev,
                                                                        productLength:  value,
                                                                        }))
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                productLength:  null, 
                                                                        }))
                                                                }
                                                        }}
                                                        scale={3}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s" >Масса (кг):</Text>
                                                <NumberMaskTextField 
                                                        size="s" 
                                                        value={data?.weight?.toString()}
                                                        onChange={(value : string | null) => { 
                                                                if (value) {
                                                                        setData(prev => ({
                                                                        ...prev,
                                                                        weight:  value,
                                                                        }))
                                                                } else {
                                                                        setData(prev => ({
                                                                                ...prev,
                                                                                weight:  null, 
                                                                        }))
                                                                }       
                                                        }}
                                                        scale={3}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                />        
                                        </Layout>
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                        <Layout direction="column">
                                                <Text size="s">Плотность:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.weight && data?.productLength &&  data?.productHeight && data?.productWidth ? ((Number(data?.weight))/((Number(data?.productLength) * Number(data?.productHeight) * Number(data?.productWidth)))).toString() : '0'}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                        disabled
                                                />        
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL:'m' })}>
                                                <Text size="s">Цена за 1кг:</Text>
                                                <TextField 
                                                        size="s" 
                                                        value={data?.weight && data?.productLength &&  data?.productHeight && data?.productWidth ? ((Number(data?.weight))/((Number(data?.productLength) * Number(data?.productHeight) * Number(data?.productWidth)))).toString() : '0'}
                                                        className={cnMixSpace({ mT:'2xs' })}
                                                        disabled
                                                />        
                                        </Layout>
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'l' })}>
                                        <Checkbox 
                                                checked={data.isMessageActive} 
                                                onChange={() => { 
                                                                        setData(prev => ({
                                                                        ...prev,
                                                                        isMessageActive:  !data.isMessageActive,
                                                                        }))
                                                        }}
                                                className={cnMixSpace({ mR:'s' })}
                                        />
                                        <Text size="s">Активировать бота</Text>
                                        
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({ mT:'l' })}>
                                        <Checkbox 
                                                checked={data.hasSerialNumber} 
                                                onChange={() => { 
                                                                        setData(prev => ({
                                                                        ...prev,
                                                                        hasSerialNumber:  !data.hasSerialNumber,
                                                                        }))
                                                        }}
                                                className={cnMixSpace({ mR:'s' })}
                                        />
                                        <Text size="s">Есть серийный номер</Text>
                                        
                                </Layout>
                                
                                <Layout direction="row" style={{justifyContent: 'right'}} className={cnMixSpace({ mT:'5xl' })}>
                                        <Button 
                                                label={'Отменить'}
                                                view="secondary"
                                                size="s"
                                                className={cnMixSpace({ mL:'m' })}
                                                onClick={()=>{
                                                        setIsOpen(false);
                                                        // setIsLoading(true);
                                                        setData(defaultData);
                                                        setId(undefined);
                                                        setType(undefined);
                                                }}
                                        />
                                        <Button 
                                                label={'Сохранить'}
                                                view="primary"
                                                size="s"
                                                className={cnMixSpace({ mL:'m' })}
                                                onClick={(e)=>{
                                                        if (id) {
                                                                updateNomenclatureData(e, id);
                                                        } else {
                                                                createNomenclature(e); 
                                                        }
                                                }}
                                        />
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
export default NomenclatureDetailsModal