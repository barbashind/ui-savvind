import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";


import { TAnalyticFilter } from "../../types/analytic-types.ts";
import { getAccounts, getUsers } from "../../services/SettingsService.ts";
import { TAccount, TUser } from "../../types/settings-types.ts";

// иконки
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { Combobox } from "@consta/uikit/Combobox/index";
import { DatePicker } from "@consta/uikit/DatePicker/index";
import { getUserInfo, UserInfo } from "../../services/AuthorizationService.ts";
import { Checkbox } from "@consta/uikit/Checkbox/index";
import { Select } from "@consta/uikit/Select/index";





export interface TAnalyticToolbarProps {
        filterValues: TAnalyticFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TAnalyticFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnalyticToolbar = ({filterValues,  setFilterValues, setUpdateFlag} : TAnalyticToolbarProps) => {

const [users, setUsers] = useState<(string | undefined)[]>([]);
const [user, setUser] = useState<UserInfo | undefined>(undefined);
const [today, setToday] = useState<Date | null>(null);
const [dayWeekBack, setDayWeekBack] = useState<Date | null>(null);
const [accounts, setAccounts] = useState<TAccount[]>([]);
        
useEffect(() => {
        
        const getUserInfoData = async () => {
                await getUserInfo().then((resp) => {
                        setUser(resp);
                })
        };
        
        void getUserInfoData();

        const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, currency: item.currency})))
                        })
                }
                
        void getAccountsData();

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 
        setToday(currentDate); 

        const weekBackDate = new Date(currentDate.getTime());
        weekBackDate.setDate(weekBackDate.getDate() - 7); 
        setDayWeekBack(weekBackDate); 

}, []);

useEffect(() => {
        const getUsersData = async () => {
                await getUsers((resp) => {
                        if (user?.role === 'ADM') {
                                setUsers(resp?.filter(elem => (elem.role === 'SLR'))?.map((item : TUser) => (
                                item.username)))
                                setFilterValues(prev => ({
                                        ...prev,
                                        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 25),
                                        endDate: new Date(),
                                        users: resp?.filter(elem => (elem.role === 'SLR'))?.map((item : TUser) => (
                                                item.username))
                                }))
                        }
                        if (user?.role === 'SLR' && user?.username !== 'Matvei') {
                                setUsers(resp?.filter(elem => (elem.role === 'SLR' && (elem.username === user.username)))?.map((item : TUser) => (
                                        item.username)))
                                setFilterValues(prev => ({
                                        ...prev,
                                        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 25),
                                        endDate: new Date(),
                                        users: resp?.filter(elem => (elem.role === 'SLR' && (elem.username === user.username)))?.map((item : TUser) => (
                                                item.username))
                                }))
                        }
                        if (user?.role === 'SLR' && user?.username === 'Matvei') {
                                setUsers(resp?.filter(elem => (elem.role === 'SLR' && ((elem.username === user.username) || (elem.username === 'djiSeller'))))?.map((item : TUser) => (
                                        item.username)))
                                setFilterValues(prev => ({
                                        ...prev,
                                        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 25),
                                        endDate: new Date(),
                                        users: resp?.filter(elem => (elem.role === 'SLR' && (elem.username === user.username)))?.map((item : TUser) => (
                                                item.username))
                                }))
                        }
                        
                });
        }
        void getUsersData();
        setUpdateFlag(true);
}, [setFilterValues, setUpdateFlag, user])

        return (
                <Layout direction="column" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row" className={cnMixSpace({ mB: 'm'})}>
                                <Text size="s" className={cnMixSpace({ mT: 's'})} style={{width: '150px'}}>
                                        Выбрать продавцов:
                                </Text>
                                <Combobox
                                        size="s"
                                        items={users}
                                        value={filterValues.users}
                                        getItemKey={(item: string | undefined) => item ?? '' }
                                        getItemLabel={(item: string | undefined) => item ?? ''}
                                        multiple
                                        onChange={(value) => {
                                                if (value) {
                                                        setFilterValues(prev => ({
                                                        ...prev,
                                                        users:  value,
                                                        }))  
                                                } else {
                                                        setFilterValues(prev => ({
                                                                ...prev,
                                                                users:  null,
                                                                }))        
                                                }
                                                
                                        }}
                                        className={cnMixSpace({ mL:'2xs' })}
                                        style={{minWidth: '400px', maxWidth: '400px'}}
                                /> 
                                <Button 
                                        size='s' 
                                        view='secondary' 
                                        iconLeft={IconSearchStroked} 
                                        label="Расчитать"  
                                        className={cnMixSpace({mL: 's'})}
                                        onClick={() => {
                                                setUpdateFlag(true);
                                        }}
                                />
                        </Layout>
                        <Layout direction="row">
                                <Text size="s" className={cnMixSpace({ mT: 's'})} style={{width: '90px'}}>
                                        Период от:
                                </Text>
                                <DatePicker
                                       size="s" 
                                       style={{minWidth: '200px', maxWidth: '200px'}}
                                       value={filterValues.startDate}
                                       onChange={(value) => {
                                                setFilterValues(prev => (
                                                        {...prev, startDate: value}
                                                ))
                                        }}
                                        className={cnMixSpace({ mL: 'xs'})}
                                />
                                <Text size="s" className={cnMixSpace({ mT: 's', mL: 'm'})} style={{width: '30px'}}>
                                        до:
                                </Text>
                                <DatePicker
                                        size="s"
                                        style={{minWidth: '200px', maxWidth: '200px'}}
                                        value={filterValues.endDate}
                                        onChange={(value) => {
                                                setFilterValues(prev => (
                                                        {...prev, endDate: new Date(value?.setHours(23, 59, 59, 999) ?? 0)}
                                                ))
                                        }}
                                        className={cnMixSpace({ mL: 'xs'})}
                                        maxDate={new Date()}
                                />
                                <Checkbox 
                                        className={cnMixSpace({ mL: 'm'})} 
                                        label="За сегодня" 
                                        checked={
                                                (filterValues.startDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.startDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.startDate?.getDate() === today?.getDate()) &&
                                                (filterValues.endDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.endDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.endDate?.getDate() === today?.getDate())
                                        }
                                        onChange={()=> {
                                                if (!((filterValues.startDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.startDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.startDate?.getDate() === today?.getDate()) &&
                                                (filterValues.endDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.endDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.endDate?.getDate() === today?.getDate()))) {
                                                        setFilterValues(prev => ({...prev,
                                                                startDate: today,
                                                                endDate: new Date(),
                                                        }))  
                                                }
                                        }}
                                />
                                <Checkbox 
                                        className={cnMixSpace({ mL: 'm'})} 
                                        label="За неделю" 
                                        checked={
                                                (filterValues.startDate?.getFullYear() === dayWeekBack?.getFullYear()) &&
                                                (filterValues.startDate?.getMonth() === dayWeekBack?.getMonth()) &&
                                                (filterValues.startDate?.getDate() === dayWeekBack?.getDate()) &&
                                                (filterValues.endDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.endDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.endDate?.getDate() === today?.getDate())
                                        }
                                        onChange={()=> {
                                                if (!((filterValues.startDate?.getFullYear() === dayWeekBack?.getFullYear()) &&
                                                (filterValues.startDate?.getMonth() === dayWeekBack?.getMonth()) &&
                                                (filterValues.startDate?.getDate() === dayWeekBack?.getDate()) &&
                                                (filterValues.endDate?.getFullYear() === today?.getFullYear()) &&
                                                (filterValues.endDate?.getMonth() === today?.getMonth()) &&
                                                (filterValues.endDate?.getDate() === today?.getDate()))) {
                                                        setFilterValues(prev => ({...prev,
                                                                startDate: dayWeekBack,
                                                                endDate: today,
                                                        }))  
                                                }
                                        }}
                                        
                                />
                                <Select
                                        items={accounts}
                                        value={accounts?.find(account => filterValues.account === account.name)}
                                        getItemKey={item   => (item.accountId ?? 0)}
                                        getItemLabel={item  => (item.name ?? '')}
                                        onChange={(value) => {
                                                if (value) {
                                                        setFilterValues(prev => ({...prev,
                                                                account: value?.name,
                                                        })) 
                                                } else {
                                                        setFilterValues(prev => ({...prev,
                                                                account: undefined,
                                                        }))
                                                }
                                        }}
                                        size="s"
                                        style={{minWidth: '200px', maxWidth: '200px'}}
                                        disabled={user?.role !== 'ADM'}
                                        placeholder="Выберите счет"
                                        className={cnMixSpace({mL:'l'})}
                                />
                        </Layout>
                        
                </Layout>
        )
}
export default AnalyticToolbar;