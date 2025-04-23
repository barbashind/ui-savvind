import React from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Sidebar } from '@consta/uikit/Sidebar';
import { DatePicker } from '@consta/uikit/DatePicker';

// иконки
import { IconClose } from '@consta/icons/IconClose';

import { TCheckFilter } from "../../types/sales-types";

interface TSalesFilterProps {
        isFilterOpen: boolean;
        setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TCheckFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TCheckFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        isProducts: boolean;
    }

const SalesFilter = ({isFilterOpen, setIsFilterOpen,  setUpdateFlag, filterValues, setFilterValues} : TSalesFilterProps) => {

        const defaultFilter : TCheckFilter = {
                dateMin: null,
                dateMax: null,
                customer: null,
                searchText: null,
                isUnpaid: true,
                isBooking: true,
                isPaid: true
        }

        return (
                <Sidebar
                        isOpen={isFilterOpen}
                        position="right"
                >
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({pB: 's'})}>
                                <Text size='l' weight="semibold" view="brand" className={cnMixSpace({mT: 's', mL: 's'})} >
                                        Фильтр по продажам
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
                                 Покупатель:
                        </Text>
                        <TextField
                                size='s'
                                value={filterValues?.customer ?? ''}
                                onChange={(value) => {  
                                        if (value) {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        customer:  value,
                                                        }))       
                                        } else {
                                                setFilterValues(prev => ({
                                                        ...prev,
                                                        customer:  null,
                                                        }))  
                                        }
                                }}
                                className={cnMixSpace({ mT: 'xs'})}
                        />
                        
                        

                        <Text size="s" className={cnMixSpace({ mT: 's'})}>
                                 Дата продажи:
                        </Text>
                        <Layout direction="row" className={cnMixSpace({ mT: 'xs'})}>
                                
                                <DatePicker
                                        size='s'
                                        placeholder="От"
                                        value={filterValues?.dateMin}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateMin:  value,
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
                                <DatePicker
                                        size='s'
                                        placeholder="До"
                                        value={filterValues?.dateMax}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateMax:  value,
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateMax:  null,
                                                                }))  
                                                }
                                        }}
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
export default SalesFilter;