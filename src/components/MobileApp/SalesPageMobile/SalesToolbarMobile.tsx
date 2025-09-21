import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Checkbox } from '@consta/uikit/Checkbox';

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconRevert } from "@consta/icons/IconRevert";


import { TCheckFilter } from "../../../types/sales-types";
import { IconStorage } from "@consta/icons/IconStorage";
import { getDebtSales } from "../../../services/SalesService";
import { AntIcon } from "../../../utils/AntIcon";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { cnMixFontSize } from "../../../utils/MixFontSize";
import { DatePicker } from "@consta/uikit/DatePicker";
import { Card } from "@consta/uikit/Card";

export interface TSalesToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TCheckFilter>>;
        filterValues: TCheckFilter;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsReturnModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setIsPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SalesToolbarMobile = ({
                setIsEditModalOpen, 
                setFilterValues,
                filterValues,
                setUpdateFlag, 
                setIsReturnModalOpen,
                setIsPurchaseModalOpen,
                
        } : TSalesToolbarProps) => {

const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
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

                <Layout direction="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }} className={cnMixSpace({pH: 'xs', pT:'xs', mB:'m'})} >
                        <Button 
                                size='m' 
                                view='primary' 
                                label={'Оформить чек'} 
                                iconLeft={IconAdd} 
                                onClick={()=>{setIsEditModalOpen(true)}} 
                                form="round"
                        />
                        <Layout direction='row'>
                                <Button 
                                        size='m' 
                                        view='secondary' 
                                        // label={'Разовая закупка'} 
                                        iconLeft={IconStorage} 
                                        onClick={()=>{setIsPurchaseModalOpen(true)}} 
                                        className={cnMixSpace({mL: 'm'})}
                                />
                                
                                <Button 
                                        size='m' 
                                        view='secondary' 
                                        // label={'Возврат товара'} 
                                        iconLeft={IconRevert} 
                                        onClick={()=>{setIsReturnModalOpen(true)}} 
                                        className={cnMixSpace({mL: 's'})}
                                        style={{color: '#eb5757', borderColor: '#eb5757'}}
                                />
                                <Button 
                                        size='m' 
                                        view='ghost' 
                                        iconLeft={AntIcon.asIconComponent(() => !isOpenFilter ? (
                                                        <DownOutlined
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ) : (
                                                        <UpOutlined 
                                                                className={cnMixFontSize('l')}
                                                        />
                                                )
                                        )}
                                        // title="Поиск"  
                                        className={cnMixSpace({mL: 's'})}
                                        onClick={() => {
                                                setIsOpenFilter(!isOpenFilter);
                                        }}
                                />
                        </Layout>
                        
                </Layout>
                
                        
                {isOpenFilter && (
                        <Card className={cnMixSpace({ mB:'m', mH: 's'})} style={{border: '1px solid var(--color-typo-brand)'}}>
                                <Layout direction="column"  className={cnMixSpace({pH: 'xs', pT:'m'})}>
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
                                                onKeyPress={(event) => {
                                                        if (event.key === 'Enter') {
                                                                setUpdateFlag(true);
                                                        }
                                                        }}
                                                withClearButton
                                                placeholder="Покупатель"
                                        /> 
                                        <Layout direction="row" className={cnMixSpace({ mT: 'xs'})}>
                                                <DatePicker
                                                        size='s'
                                                        type="date-range"
                                                        placeholder="ДД.ММ.ГГГГ"
                                                        value={[filterValues?.dateMin, filterValues?.dateMax]}
                                                        onChange={(value) => {  
                                                                if (value) {
                                                                        setFilterValues(prev => ({
                                                                                ...prev,
                                                                                dateMin:  value[0],
                                                                                dateMax: value[1],
                                                                                }))       
                                                                } else {
                                                                        setFilterValues(prev => ({
                                                                                ...prev,
                                                                                dateMin:  undefined,
                                                                                dateMax: undefined,
                                                                                }))  
                                                                }
                                                        }}
                                                />
                                                
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({pH: 'xs', pB:'s'})}>
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
                                                        className={cnMixSpace({mT: 'm'})}
                                                        size="m"
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
                                                        label={'Бронь - ' + isBooked?.toFixed(2) + ' руб' }
                                                        className={cnMixSpace({mT: 'm'})}
                                                        size="m"
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
                                                        label={'Не оплачено - ' + isUnpaid?.toFixed(2) + ' руб'}
                                                        className={cnMixSpace({mT: 'm'})}
                                                        size="m"
                                                />
                                        </Layout>
                                </Layout>
                        </Card>
                )}
                </Layout>
        )
}
export default SalesToolbarMobile