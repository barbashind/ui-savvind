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
import { TNomenclatureFilter } from "../../types/nomenclature-types";
import { Combobox } from "@consta/uikit/Combobox";
import { IdLabel } from "../../utils/types";
import { getProductTypes } from "../../services/NomenclatureService";

interface TNomenclatureFilterProps {
        isFilterOpen: boolean;
        setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TNomenclatureFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TNomenclatureFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const NomenclatureFilter = ({isFilterOpen, setIsFilterOpen,  setUpdateFlag, filterValues, setFilterValues} : TNomenclatureFilterProps) => {

        const defaultFilter : TNomenclatureFilter = {
                remainsMin: null,
                remainsMax: null,
                remainsSumMin: null,
                remainsSumMax: null,
                productType: undefined,
                brand: null,
                altName: null,
                productColor: null,
                productPrice: null,
                productModel: null,
                productCountry: null,
                searchText: null
        }

        const [type, setType] = useState<IdLabel[]>();
        const [types, setTypes] = useState<IdLabel[]>([]);
        
        useEffect(() => {
                
                const getProductTypesData = async () => {
                await getProductTypes((resp) => {setTypes(resp)});
                }
                getProductTypesData();
            }, []);

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
                                 Тип товара:
                        </Text>
                        <Combobox
                                size="s" 
                                value={type}
                                items={types}
                                placeholder="Выберите типы товаров"
                                multiple
                                onChange={(value) => {
                                        if (value) {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        productType:  value.map(el=>(el.label ? el.label : '' )),
                                                }));
                                                setType(value);  
                                        } else {
                                                setType(undefined)
                                                setFilterValues(prev => ({
                                                ...prev,
                                                productType:  undefined,
                                                }));
                                        }
                                                                
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                                />
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Бренд:
                        </Text>
                        <TextField
                                size='s'
                                value={filterValues?.brand ?? ''}
                                onChange={(value) => {  
                                        if (value) {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        brand:  value,
                                                        }))       
                                        } else {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        brand:  null,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        />
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Модель:
                        </Text>
                        <TextField
                                size='s'
                                value={filterValues?.productModel ?? ''}
                                onChange={(value) => {  
                                        if (value) {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        productModel:  value,
                                                        }))       
                                        } else {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        productModel:  null,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        />
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Цена:
                        </Text>
                        <TextField
                                size='s'
                                type="number"
                                incrementButtons={false}
                                value={filterValues?.productPrice?.toString() ?? ''}
                                onChange={(value) => {  
                                        if (value) {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        productPrice:  Number(value),
                                                        }))       
                                        } else {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        productPrice:  null,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        />
                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Остаток:
                        </Text>
                        <Layout direction="row" className={cnMixSpace({ mT: 'xs'})}>
                                
                                <TextField
                                        size='s'
                                        type="number"
                                        placeholder="От"
                                        incrementButtons={false}
                                        value={filterValues?.remainsSumMin?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                remainsSumMin:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                remainsSumMin:  null,
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
                                        value={filterValues?.remainsSumMax?.toString() ?? ''}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                remainsSumMax:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                remainsSumMax:  null,
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
export default NomenclatureFilter