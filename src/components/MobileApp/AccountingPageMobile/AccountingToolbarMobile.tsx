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
import { TAccountingFilter } from "../../../types/accounting-types.ts";
import { IconArrowDown } from "@consta/icons/IconArrowDown/index";
import { IconArrowUp } from "@consta/icons/IconArrowUp/index";
import { DatePicker } from "@consta/uikit/DatePicker/index";
import NumberMaskTextField from "../../../utils/NumberMaskTextField.tsx";
import { Combobox } from "@consta/uikit/Combobox/index";
import { TCategory } from "../../../types/settings-types.ts";
import { getCategories } from "../../../services/SettingsService.ts";
import { Card } from "@consta/uikit/Card/index";

export interface TAccountingToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TAccountingFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsAccModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        role: string;
        isMatvei: boolean;
        filterValues: TAccountingFilter;
}

const AccountingToolbarMobile = ({setIsEditModalOpen, setFilterValues, setUpdateFlag, setIsAccModalOpen, role, isMatvei, filterValues} : TAccountingToolbarProps) => {

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
                <Layout direction="column" style={{  borderBottom: '2px solid #56b9f2' }} className={cnMixSpace({pB: 'm'})} >
                        <Layout direction="row"  className={cnMixSpace({mB: 'xs'})} style={{ justifyContent: 'space-between'}}>
                                <Button 
                                        size='m' 
                                        view='primary' 
                                        label={'Оформить транзакцию'} 
                                        iconLeft={IconAdd} 
                                        onClick={()=>{setIsEditModalOpen(true)}} 
                                        disabled={role === 'SLR' && !isMatvei}
                                        form="round"
                                />
                                <Layout>
                                        <Button size='m' view='secondary' iconLeft={IconBook} onClick={()=>{setIsAccModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                                        <Button 
                                                size='m' 
                                                view='ghost' 
                                                iconLeft={!isVisible ? IconArrowDown : IconArrowUp} 
                                                onClick={()=>{setIsVisible(!isVisible)}} 
                                                className={cnMixSpace({mL: 's'})}
                                        />
                                </Layout>
                                
                        </Layout>
                        {isVisible && (
                        <Card  className={cnMixSpace({ mH: 's'})} style={{border: '1px solid var(--color-typo-brand)'}}>
                        <Layout direction="row" className={cnMixSpace({mT: 'm'})} >
                                
                                <TextField
                                        size='s'
                                        placeholder="Счет списания"
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
                                
                                <TextField
                                        size='s'
                                        placeholder="Счет пополнения"
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
                                        className={cnMixSpace({mH: 's'})}
                                        disabled={role === 'SLR'}
                                />
                        </Layout>
                        <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                <TextField
                                        size='s'
                                        placeholder="Обоснование"
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
                                <Combobox
                                        placeholder="Категории"
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
                                        className={cnMixSpace({mH: 's'})+ ' ' + 'selectMobile'}
                                        renderValue={(item) => {
                                                const count = filterValues?.category?.length || 0;
                                                const selected = filterValues?.category ?? [];
                                                const primary = selected[0];
                                                if (count === 0) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>-</Text>;
                                                if (count === 1) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>{filterValues.category ? filterValues.category[0].name : '-'}</Text>;
                                                return (item.item === primary) ? <Text size="m" className={cnMixSpace({ mT:'2xs' })} >{`Выбрано: ${count}`}</Text> : null;
                                        }}
                                />
                        </Layout>
                        <Layout direction="row" style={{ alignItems: 'center', justifyContent: 'right', alignSelf: 'end', width: '70%'}} className={cnMixSpace({mT: 'm'})}>
                                <DatePicker
                                        size='s'
                                        type="date-range"
                                        placeholder="ДД.ММ.ГГГГ"
                                        value={[filterValues?.dateFrom, filterValues?.dateTo]}
                                        onChange={(value) => {  
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateFrom:  value[0],
                                                                dateTo: value[1],
                                                                }))       
                                                } else {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                dateFrom:  undefined,
                                                                dateTo: undefined,
                                                                }))  
                                                }
                                        }}
                                        disabled={role === 'SLR'}
                                        withClearButton
                                        className={cnMixSpace({mH: 's'})}
                                />
                                
                                </Layout>
                                <Layout direction="row" style={{ alignItems: 'center', justifyContent: 'right'}} className={cnMixSpace({mV: 's'})}>
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        Сумма от:
                                </Text>
                                <NumberMaskTextField
                                        value={filterValues.valueFrom}
                                        onChange={(value: string) => {
                                                setFilterValues(prev => ({...prev, valueFrom: Number(value)}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, valueFrom: null}))
                                                }
                                        }}
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={role === 'SLR'}
                                        style={{minWidth: '60px'}}
                                        size='xs'
                                />
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})} style={{width: 'fit-content', textWrap: 'nowrap'}}>
                                        до:
                                </Text>
                                <NumberMaskTextField
                                        value={filterValues.valueTo}
                                        onChange={(value: string) => {
                                                setFilterValues(prev => ({...prev, valueTo: Number(value)}))
                                                if (!value) {
                                                        setFilterValues(prev => ({...prev, valueTo: null}))
                                                }
                                        }}
                                        className={cnMixSpace({mH: 's'})}
                                        disabled={role === 'SLR'}
                                        style={{minWidth: '60px'}}
                                        size='xs'
                                />
                        </Layout>
                        <Button 
                                        size='s' 
                                        view='secondary' 
                                        iconLeft={IconSearchStroked} 
                                        label="Поиск"  
                                        className={cnMixSpace({mB: 's'})}
                                        onClick={() => {
                                                setUpdateFlag(true);
                                        }}
                                />
                        </Card>
                        )}
                        
                </Layout>
                
        )
}
export default AccountingToolbarMobile;