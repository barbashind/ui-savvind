import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";


import { TAnalyticFilter } from "../../types/analytic-types.ts";
import { getUsers } from "../../services/SettingsService.ts";
import { TUser } from "../../types/settings-types.ts";

// иконки
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { Combobox } from "@consta/uikit/Combobox/index";
import { DatePicker } from "@consta/uikit/DatePicker/index";
import { getUserInfo, UserInfo } from "../../services/AuthorizationService.ts";





export interface TAnalyticToolbarProps {
        filterValues: TAnalyticFilter;
        setFilterValues: React.Dispatch<React.SetStateAction<TAnalyticFilter>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnalyticToolbar = ({filterValues,  setFilterValues, setUpdateFlag} : TAnalyticToolbarProps) => {

const [users, setUsers] = useState<(string | undefined)[]>([]);
const [user, setUser] = useState<UserInfo | undefined>(undefined);
        
useEffect(() => {
        
        const getUserInfoData = async () => {
                await getUserInfo().then((resp) => {
                        setUser(resp);
                })
        };
        
        void getUserInfoData();
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
                        if (user?.role === 'SLR') {
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
                                                        {...prev, endDate: value}
                                                ))
                                        }}
                                        className={cnMixSpace({ mL: 'xs'})}
                                        maxDate={new Date()}
                                />
                        </Layout>
                        
                </Layout>
        )
}
export default AnalyticToolbar;