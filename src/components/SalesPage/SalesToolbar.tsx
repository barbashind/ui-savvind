import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Switch } from '@consta/uikit/Switch';
import { Checkbox } from '@consta/uikit/Checkbox';

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconRevert } from "@consta/icons/IconRevert";


import { TCheckFilter } from "../../types/sales-types";
import { IconStorage } from "@consta/icons/IconStorage";
import { getDebtSales } from "../../services/SalesService";

export interface TSalesToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TCheckFilter>>;
        filterValues: TCheckFilter;
        searchText: string | null;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        isProducts: boolean;
        setIsProducts: React.Dispatch<React.SetStateAction<boolean>>;
        setIsReturnModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setIsPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SalesToolbar = ({
                setIsEditModalOpen, 
                setFilterValues,
                filterValues,
                setSearchText,  
                searchText, 
                setUpdateFlag, 
                setIsFilterModalOpen, 
                setIsReturnModalOpen,
                setIsPurchaseModalOpen,
                isProducts,
                setIsProducts
        } : TSalesToolbarProps) => {

const [isUnpaid, seIsUnpaid] = useState<number | undefined>(0)
const [isBooked, seIsBooked] = useState<number | undefined>(0)
useEffect(()=>{
        const getDebtData = async () => {
                await getDebtSales((resp)=> {
                        seIsUnpaid(resp.isUnpaid);
                        seIsBooked(resp.isBooked);
                })
        };
        void getDebtData();
})

        return (
                <Layout direction="column">

                
                <Layout direction="row" style={{ justifyContent: 'space-between'}} className={cnMixSpace({mH: 'm', pH:'m', mT: 'm', pT:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Продажи
                                </Text>
                        </Layout>
                        <Layout direction="row" >
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{minWidth: '140px'}} align="right">
                                        По продукции:
                                </Text>
                                <Switch 
                                        checked={isProducts} 
                                        onChange={()=> {
                                                setIsProducts(!isProducts); 
                                                setUpdateFlag(true);
                                        }} 
                                        className={cnMixSpace({mL: 's', mT: 's'})}
                                />
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})}>
                                        Поиск:
                                </Text>
                                <TextField
                                        size='s'
                                        value={searchText}
                                        onChange={(value) => {
                                                setSearchText(value);
                                                setFilterValues(prev => ({...prev, searchText: value}))
                                                if (!value) {
                                                        setUpdateFlag(true);
                                                }
                                        }}
                                        onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                        setUpdateFlag(true);
                                                }
                                            }}
                                        withClearButton
                                        className={cnMixSpace({mL: 's'})}
                                />
                                <Button 
                                        size='s' 
                                        view='secondary' 
                                        iconLeft={IconSearchStroked} 
                                        title="Поиск"  
                                        className={cnMixSpace({mL: 's'})}
                                        onClick={() => {
                                                setUpdateFlag(true);
                                        }}
                                />
                        </Layout>
                        
                </Layout>
                <Layout direction="row"   style={{ justifyContent: 'end'}}>
                        <Text size="s" className={cnMixSpace({mR: 'm', mT: 'm'  })} >{'Бронь - ' + isBooked?.toFixed(2) } </Text>
                        <Text size="s" className={cnMixSpace({mR: 'm', mT: 'm'})}>{'Не оплачено - ' + isUnpaid?.toFixed(2)}</Text>
                        <Text size="s" className={cnMixSpace({ mT: 'm', mR: '2xl'  })}>{'Общ.задолж. -  '+ (Number(isBooked) + Number(isUnpaid))?.toFixed(2)}</Text> 
                </Layout>
                        
                <Layout direction="row" style={{ justifyContent: 'end', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({m: 'm', pB:'m', pH:'m'})} >
                        
                        <Checkbox
                                checked={filterValues.isPaid}
                                onChange={()=>{
                                        setFilterValues(prev => ({
                                                ...prev,
                                                isPaid: !prev.isPaid
                                        }));
                                        setUpdateFlag(true);
                                }}
                                label="Оплачено"
                                className={cnMixSpace({mL: 'm', p:'2xs'})}
                                size="s"
                        />
                        <Checkbox
                                checked={filterValues.isBooking}
                                onChange={()=>{
                                        setFilterValues(prev => ({
                                                ...prev,
                                                isBooking: !prev.isBooking
                                        }));
                                        setUpdateFlag(true);
                                }}
                                label="Бронь"
                                className={cnMixSpace({mL: 'm', p:'2xs'})}
                                size="s"
                        />
                        <Checkbox
                                checked={filterValues.isUnpaid}
                                onChange={()=>{
                                        setFilterValues(prev => ({
                                                ...prev,
                                                isUnpaid: !prev.isUnpaid
                                        }));
                                        setUpdateFlag(true);
                                }}
                                label="Не оплачено"
                                className={cnMixSpace({mL: 'm', p:'2xs'})}
                                size="s"
                        />
                        <Button 
                                size='s' 
                                view='secondary' 
                                label={'Разовая закупка'} 
                                iconLeft={IconStorage} 
                                onClick={()=>{setIsPurchaseModalOpen(true)}} 
                                className={cnMixSpace({mL: 'm'})}
                        />
                        <Button 
                                size='s' 
                                view='secondary' 
                                label={'Сформировать чек'} 
                                iconLeft={IconAdd} 
                                onClick={()=>{setIsEditModalOpen(true)}} 
                                className={cnMixSpace({mL: 's'})}
                        />
                        <Button 
                                size='s' 
                                view='secondary' 
                                label={'Возврат товара'} 
                                iconLeft={IconRevert} 
                                onClick={()=>{setIsReturnModalOpen(true)}} 
                                className={cnMixSpace({mL: 's'})}
                                style={{color: '#eb5757', borderColor: '#eb5757'}}
                        />
                        <Button size='s' view='secondary' iconLeft={IconSortDownCenter} title="Фильтр" onClick={()=>{setIsFilterModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                </Layout>
                </Layout>
        )
}
export default SalesToolbar