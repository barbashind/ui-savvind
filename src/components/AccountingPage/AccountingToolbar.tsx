import React, { useEffect, useState } from "react"

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
import { IconArrowDown } from "@consta/icons/IconArrowDown/index";
import { IconArrowUp } from "@consta/icons/IconArrowUp/index";
import { DatePicker } from "@consta/uikit/DatePicker/index";
import NumberMaskTextField from "../../utils/NumberMaskTextField.tsx";
import { Combobox } from "@consta/uikit/Combobox/index";
import { TCategory } from "../../types/settings-types.ts";
import { getCategories } from "../../services/SettingsService.ts";

export interface TAccountingToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TAccountingFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsAccModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        role: string;
        isMatvei: boolean;
        filterValues: TAccountingFilter;
}

const AccountingToolbar = ({setIsEditModalOpen, setFilterValues, setUpdateFlag, setIsAccModalOpen, role, isMatvei, filterValues} : TAccountingToolbarProps) => {

        const [isVisible, setIsVisible] = useState<boolean>(false)
        const [categories, setCategories] = useState<TCategory[]>([]);
        
        // Инициализация данных
        useEffect(() => {
                const getCategoriesData = async () => {
                        await getCategories((resp) => {
                                setCategories(resp.map((item : TCategory) => ({id: item.id, name: item.name})))
                                
                        })
                }
                void getCategoriesData();
        }, [])
        

        return (
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2', flexWrap: 'wrap'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Бухгалтерия
                                </Text>
                        </Layout>
                        <Layout direction="row">
                                {/* <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})}>
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
                                /> */}
                                
                                <Button 
                                        size='s' 
                                        view='primary' 
                                        label={'Сформировать транзакцию'} 
                                        iconLeft={IconAdd} 
                                        onClick={()=>{setIsEditModalOpen(true)}} 
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR' && !isMatvei}
                                />
                                <Button size='s' view='secondary' label={'Проверить счета'} iconLeft={IconBook} onClick={()=>{setIsAccModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                                <Button 
                                        size='s' 
                                        view='clear' 
                                        label={!isVisible ? 'Показать фильтры' : 'Скрыть фильтры'} 
                                        iconLeft={!isVisible ? IconArrowDown : IconArrowUp} 
                                        onClick={()=>{setIsVisible(!isVisible)}} 
                                        className={cnMixSpace({mL: 's'})}
                                />
                                

                        </Layout>
                        {isVisible && (
                        <Layout direction="column" style={{ width: '100%'}}>
                        <Layout direction="row" className={cnMixSpace({mT: 'm'})} style={{ alignItems: 'center', alignSelf: 'end', width: '70%'}} >
                                <Text size="s" className={cnMixSpace({mL: 'xl'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Счет списания:
                                </Text>
                                <TextField
                                        size='s'
                                        value={filterValues.accountFrom}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, accountFrom: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, accountFrom: null}))
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
                                <Text size="s" className={cnMixSpace({mL: 'xl'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Счет пополнения:
                                </Text>
                                <TextField
                                        size='s'
                                        value={filterValues.accountTo}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, accountTo: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, accountTo: null}))
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
                        </Layout>
                        <Layout direction="row" className={cnMixSpace({mT: 'm'})} style={{ alignItems: 'center', alignSelf: 'end', width: '70%'}} >
                                <Text size="s" className={cnMixSpace({mL: 'xl'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Обоснование:
                                </Text>
                                <TextField
                                        size='s'
                                        value={filterValues.justification}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, justification: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, justification: null}))
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
                                <Text size="s" className={cnMixSpace({mL: 'xl'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Категории:
                                </Text>
                                <Combobox
                                        multiple={true}
                                        items={categories}
                                        getItemKey={item => item.id ?? 0}
                                        getItemLabel={item => item.name ?? ''}
                                        size='s'
                                        value={filterValues.category}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, category: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, category: null}))
                                                }
                                        }}
                                        onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                        setUpdateFlag(true);
                                                }
                                            }}
                                        className={cnMixSpace({mL: 's'})}
                                />
                        </Layout>
                        <Layout direction="row" style={{ alignItems: 'center', justifyContent: 'right', alignSelf: 'end', width: '70%'}} className={cnMixSpace({mT: 'm'})}>
                                <Text size="s" className={cnMixSpace({mL: 'xl'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Дата от:
                                </Text>
                                <DatePicker
                                        size='s'
                                        value={filterValues.dateFrom}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, dateFrom: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, dateFrom: null}))
                                                }
                                        }}
                                        withClearButton
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                        style={{maxWidth: '240px'}}
                                />
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        до:
                                </Text>
                                <DatePicker
                                        size='s'
                                        value={filterValues.dateTo}
                                        onChange={(value) => {
                                                setFilterValues(prev => ({...prev, dateTo: value}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, dateTo: null}))
                                                }
                                        }}
                                        withClearButton
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                        style={{maxWidth: '240px'}}
                                />
                                </Layout>
                                <Layout direction="row" style={{ alignItems: 'center', justifyContent: 'right', alignSelf: 'end', width: '70%'}} className={cnMixSpace({mT: 'm'})}>
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Сумма от:
                                </Text>
                                <NumberMaskTextField
                                        size='s'
                                        value={filterValues.valueFrom}
                                        onChange={(value: string) => {
                                                setFilterValues(prev => ({...prev, valueFrom: Number(value)}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, valueFrom: null}))
                                                }
                                        }}
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                />
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        до:
                                </Text>
                                <NumberMaskTextField
                                        size='s'
                                        value={filterValues.valueTo}
                                        onChange={(value: string) => {
                                                setFilterValues(prev => ({...prev, valueTo: Number(value)}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, valueTo: null}))
                                                }
                                        }}
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                />
                                <Button 
                                        size='s' 
                                        view='secondary' 
                                        iconLeft={IconSearchStroked} 
                                        label="Поиск"  
                                        className={cnMixSpace({mL: 's'})}
                                        onClick={() => {
                                                setUpdateFlag(true);
                                        }}
                                />

                        

                        </Layout>
                        </Layout>
                        )}
                        
                </Layout>
                
        )
}
export default AccountingToolbar;