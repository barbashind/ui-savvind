import React from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Sidebar } from '@consta/uikit/Sidebar';

// иконки
import { IconClose } from '@consta/icons/IconClose';
import { TPurchaseFilter } from "../../types/purchase-types";


interface TProductWarehouseFilterProps {
        isFilterOpen: boolean;
        setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TPurchaseFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TPurchaseFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ProductWarehouseFilter = ({isFilterOpen, setIsFilterOpen,  setUpdateFlag, filterValues, setFilterValues} : TProductWarehouseFilterProps) => {

        const defaultFilter : TPurchaseFilter = {
                sumMin: null,
                sumMax: null,
                dateMin: null,
                dateMax: null,
                batchNumber: null,
                batchStatus: ['COMPLETED']
        }

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
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        batchNumber:  Number(value),
                                                        }))       
                                        } else {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        batchNumber:  null,
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
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                sumMin:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
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
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                sumMax:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
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
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateMin:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
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
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateMax:  Number(value),
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
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
export default ProductWarehouseFilter;