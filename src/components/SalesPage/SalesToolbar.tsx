import React from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Switch } from '@consta/uikit/Switch';

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconRevert } from "@consta/icons/IconRevert";


import { TCheckFilter } from "../../types/sales-types";
import { IconStorage } from "@consta/icons/IconStorage";

export interface TSalesToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TCheckFilter>>;
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
                setSearchText,  
                searchText, 
                setUpdateFlag, 
                setIsFilterModalOpen, 
                setIsReturnModalOpen,
                setIsPurchaseModalOpen,
                isProducts,
                setIsProducts
        } : TSalesToolbarProps) => {


        return (
                <Layout direction="column">

                
                <Layout direction="row" style={{ justifyContent: 'space-between'}} className={cnMixSpace({mH: 'm', pH:'m', mT: 'm', pT:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Продажи
                                </Text>
                        </Layout>
                        <Layout direction="row">
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
                <Layout direction="row" style={{ justifyContent: 'end', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({m: 'm', pB:'m', pH:'m'})} >
                        <Button 
                                size='s' 
                                view='secondary' 
                                label={'Разовая закупка'} 
                                iconLeft={IconStorage} 
                                onClick={()=>{setIsPurchaseModalOpen(true)}} 
                                className={cnMixSpace({mL: 's'})}
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