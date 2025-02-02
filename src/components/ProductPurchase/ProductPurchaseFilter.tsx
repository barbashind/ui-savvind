import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Sidebar } from '@consta/uikit/Sidebar';

// иконки
import { IconClose } from '@consta/icons/IconClose';

import { TProduct } from "../../types/product-purchase-types";
import { Combobox } from "@consta/uikit/Combobox";
import { TNomenclature } from "../../types/nomenclature-types";
import { getNomenclatures } from "../../services/PurchaseService";
import { TPurchaseFilter } from "../../types/purchase-types";

interface TProductPurchaseFilterProps {
        isFilterOpen: boolean;
        setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TPurchaseFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TPurchaseFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ProductPurchaseFilter = ({isFilterOpen, setIsFilterOpen,  setUpdateFlag, filterValues, setFilterValues} : TProductPurchaseFilterProps) => {

        const defaultFilter : TPurchaseFilter = {
                sumMin: null,
                sumMax: null,
                dateMin: null,
                dateMax: null,
                batchNumber: null,
                product: undefined,
                batchStatus: ['CREATED'],
        }

        const batchStatuses = [
                {id: 'CREATED', label: 'Создан'}, 
                {id: 'REGISTRATION', label: 'На оприходовании'}, 
                {id: 'COMPLETED', label: 'Принят на склад'}
        ]



        const [productList, setProductList] = useState<TProduct[]>([]);
        useEffect(() => {
                
                const getProducts = async () => {
                                        await  getNomenclatures((resp) => {
                                                setProductList(resp.map((item : TNomenclature) => ({name: item.name, hasSerialNumber: item.hasSerialNumber, itemId: item.itemId, costPrice: item.lastCostPrice, weight: item.weight, productPrice: item.productPrice})));
                                            });
                }
                getProducts();
            }, [isFilterOpen]);

        return (
                <Sidebar
                        isOpen={isFilterOpen}
                        position="right"
                >
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({pB: 's'})}>
                                <Text size='l' weight="semibold" view="brand" className={cnMixSpace({mT: 's', mL: 's'})} >
                                        Фильтр по номенклатуре
                                </Text>
                                <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        setIsFilterOpen(false);
                                                }}
                                                className={cnMixSpace({mT: 'xs', mR: 'xs'})}
                                        />
                </Layout>        
                <Layout direction="column"  className={cnMixSpace({ p:'m'})} style={{ height: '100%'}}>
                        
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Номер партии:
                        </Text>
                        <TextField
                                size='s'
                                placeholder="Введите номер партии"
                                type="number"
                                incrementButtons={false}
                                value={filterValues?.batchNumber?.toString() ?? ''}
                                onChange={(value) => {  
                                        if (value) {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        batchNumber:  Number(value),
                                                        }))       
                                        } else {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        batchNumber:  null,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        />
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Статус:
                        </Text>
                        <Combobox
                                items={batchStatuses}
                                size="s"
                                placeholder="Выберите статусы"
                                value={filterValues.batchStatus  ? filterValues.batchStatus?.map((item: string) => ({id: item, label: batchStatuses?.find(elem => elem.id === item)?.label})): undefined} 
                                style={{ width: '100%'}}
                                multiple
                                getItemLabel={item => item.label ?? ''}
                                getItemKey={item => item.id}
                                onChange={(value)=>{
                                        if (value) {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        batchStatus: value.map(el=>(el.id)),
                                                        }))       
                                        } else {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        batchStatus:  undefined,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        /> 

                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Товар:
                        </Text>
                        <Combobox
                                items={productList?.map(element => ({id: element.itemId ?? 0, label: element.name ?? ''}))}
                                size="s"
                                placeholder="Введите для поиска и выберите товар"
                                value={filterValues.product?.itemId && filterValues.product?.name  ? {id: filterValues.product.itemId, label: filterValues.product.name} : undefined} 
                                style={{ width: '100%'}}
                                onChange={(value)=>{
                                        if (value) {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        product: {name: value.label, itemId: value.id},
                                                        }))       
                                        } else {
                                                setFilterValues((prev: TPurchaseFilter) => ({
                                                        ...prev,
                                                        product:  undefined,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        /> 
                        
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                Объем партии (руб):
                        </Text>
                        <Layout direction="row" className={cnMixSpace({ mT: 'xs'})}>
                                
                                <TextField
                                        size='s'
                                        type="number"
                                        placeholder="От"
                                        incrementButtons={false}
                                        value={filterValues?.sumMin?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                sumMin:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                sumMin:  null,
                                                                }))  
                                                }
                                        }}
                                />
                                <Text size="s" className={cnMixSpace({ mT: 's', mH:'s'})}>
                                        -
                                </Text>
                                <TextField
                                        size='s'
                                        type="number"
                                        placeholder="До"
                                        incrementButtons={false}
                                        value={filterValues?.sumMax?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                sumMax:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                sumMax:  null,
                                                                }))  
                                                }
                                        }}
                                        className={cnMixSpace({  mL:'xs'})}
                                />
                        </Layout>

                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Остаток (руб):
                        </Text>
                        <Layout direction="row" className={cnMixSpace({ mT: 'xs'})}>
                                
                                <TextField
                                        size='s'
                                        type="number"
                                        placeholder="От"
                                        incrementButtons={false}
                                        value={filterValues?.dateMin?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                dateMin:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                dateMin:  null,
                                                                }))  
                                                }
                                        }}
                                />
                                <Text size="s" className={cnMixSpace({ mT: 's', mH:'s'})}>
                                        -
                                </Text>
                                <TextField
                                        size='s'
                                        type="number"
                                        placeholder="До"
                                        incrementButtons={false}
                                        value={filterValues?.dateMax?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                dateMax:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues((prev: TPurchaseFilter) => ({
                                                                ...prev,
                                                                dateMax:  null,
                                                                }))  
                                                }
                                        }}
                                        className={cnMixSpace({  mL:'xs'})}
                                />
                        </Layout>
                                
                        <Layout direction="row" style={{justifyContent: 'right', alignItems: 'end'}} flex={1}>
                                <Button
                                        label={"Очистить фильтр"}
                                        size="s"
                                        view="secondary"
                                        onClick={()=>{
                                                setFilterValues(defaultFilter)
                                        }}
                                />
                                <Button
                                        label={"Применить"}
                                        className={cnMixSpace({  mL:'s'})}
                                        size="s"
                                        onClick={()=>{
                                                setUpdateFlag(true);
                                                setIsFilterOpen(false);
                                        }}
                                />
                        </Layout>
                </Layout>
                </Sidebar>
        )
}
export default ProductPurchaseFilter;