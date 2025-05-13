import React from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconBook } from '@consta/icons/IconBook';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { TAccountingFilter } from "../../types/accounting-types.ts";

export interface TAccountingToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TAccountingFilter>>;
        searchText: string | null;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsAccModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        role: string;
}

const AccountingToolbar = ({setIsEditModalOpen, setSearchText,  setFilterValues, searchText, setUpdateFlag, setIsAccModalOpen, role} : TAccountingToolbarProps) => {


        return (
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Бухгалтерия
                                </Text>
                        </Layout>
                        <Layout direction="row">
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
                                        disabled={role === 'SLR'}
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
                                <Button 
                                        size='s' 
                                        view='secondary' 
                                        label={'Сформировать транзакцию'} 
                                        iconLeft={IconAdd} 
                                        onClick={()=>{setIsEditModalOpen(true)}} 
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                />
                                <Button size='s' view='secondary' label={'Проверить счета'} iconLeft={IconBook} onClick={()=>{setIsAccModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>

                        </Layout>
                        
                </Layout>
        )
}
export default AccountingToolbar;