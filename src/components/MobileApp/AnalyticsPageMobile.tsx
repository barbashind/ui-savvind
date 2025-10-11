import { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { cnMixSpace } from '@consta/uikit/MixSpace';

import { getUserInfo } from "../../services/AuthorizationService.ts";
import { UserInfo } from "../../services/AuthorizationService.ts";
import { getAnalytics, getAnalyticsGraph } from "../../services/SalesService.ts";
import { TAnalyticData, TAnalyticFilter, TAnalyticGraphData } from "../../types/analytic-types.ts";
import { Loader } from "@consta/uikit/Loader/index";
import { getUsers } from "../../services/SettingsService.ts";
import { TUser } from "../../types/settings-types.ts";
import { Line } from "@consta/charts/Line/Line";
import { Card } from "@consta/uikit/Card/index";
import { Combobox } from "@consta/uikit/Combobox/index";
import { List } from "@consta/uikit/ListCanary/index";
import { Avatar } from "@consta/uikit/Avatar/index";
import { formatNumber } from "../../utils/formatNumber.ts";
import { Button } from "@consta/uikit/Button/index";
import { SearchOutlined } from "@ant-design/icons";
import { AntIcon } from "../../utils/AntIcon.ts";
import { cnMixFontSize } from "../../utils/MixFontSize.ts";
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { IdLabel } from "../../utils/types.ts";

// сервисы

const AnalyticsPageMobile = () => {

        const [user, setUser] = useState<UserInfo | undefined>(undefined);
                
        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp);
                        })
                };
                
                void getUserInfoData();
        }, []);

        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);

        const defaultFilterValues = {
                users: null,
                startDate: startDate,
                endDate: today
        }
        const [updateFlag, setUpdateFlag] = useState<boolean>(false);
        const [filterValues, setFilterValues] = useState<TAnalyticFilter>(defaultFilterValues);

        const [dataGraph, setDataGraph]=useState<TAnalyticGraphData[]>([])
       
        const [isLoading, setIsLoading]=useState<boolean>(false)
        const [users, setUsers] = useState<(string | undefined)[]>([]);

        // инициализация данных       
        
        useEffect(() => {
                setIsLoading(true);
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp);
                                const getUsersData = async () => {
                                                await getUsers((resp) => {
                                                        if (user?.role === 'ADM') {
                                                                setUsers(resp?.filter(elem => (elem.role === 'SLR'))?.map((item : TUser) => (
                                                                item.username)))
                                                                setFilterValues(prev => ({
                                                                        ...prev,
                                                                        users:  resp?.filter(elem => (elem.role === 'SLR'))?.map((item : TUser) => (
                                                                        item.username)),
                                                                        }))
                                                        }
                                                        if (user?.role === 'SLR' && user?.username !== 'Matvei') {
                                                                setUsers(resp?.filter(elem => (elem.role === 'SLR' && (elem.username === user.username)))?.map((item : TUser) => (
                                                                        item.username)))
                                                                setFilterValues(prev => ({
                                                                        ...prev,
                                                                        users:  resp?.filter(elem => (elem.role === 'SLR' && (elem.username === user.username)))?.map((item : TUser) => (
                                                                        item.username)),
                                                                        }))
                                                        }
                                                        if (user?.role === 'SLR' && user?.username === 'Matvei') {
                                                                setUsers(resp?.filter(elem => (elem.role === 'SLR' && ((elem.username === user.username) || (elem.username === 'djiSeller'))))?.map((item : TUser) => (
                                                                        item.username)))
                                                                setFilterValues(prev => ({
                                                                        ...prev,
                                                                        users:  resp?.filter(elem => (elem.role === 'SLR' && ((elem.username === user.username) || (elem.username === 'djiSeller'))))?.map((item : TUser) => (
                                                                        item.username)),
                                                                        }))
                                                        }
                                                        const today = new Date();
                                                        const startDate = new Date();
                                                        startDate.setDate(today.getDate() - 7);

                                                        const defFilterValues = {
                                                                users: resp?.filter(elem => (elem.role === 'SLR'))?.map((item : TUser) => (
                                                                item.username)),
                                                                startDate: startDate,
                                                                endDate: today
                                                        } 
                                                        const getAnalyticDataGraph = async () => {
                                                                await getAnalyticsGraph(defFilterValues).then((resp)=>{
                                                                        const processedData = resp.map(item => ({
                                                                                user: item.user,
                                                                                date: new Date(item.date).toLocaleString('default', { weekday: 'short' }), // Преобразуем дату в день недели
                                                                                revenue: Number((Number(item?.revenue) / 1000).toFixed(2)), 
                                                                                margProfit: Number((Number(item?.margProfit) / 1000).toFixed(2)) 
                                                                        }));
                                                                        setDataGraph(processedData);
                                                                        setIsLoading(false);
                                                                })
                                                        }
                                                        void getAnalyticDataGraph();
                                                        const getAnalyticData = async () => {
                                                                        await getAnalytics(defFilterValues).then((resp)=>{
                                                                                setData(resp);
                                                                                setIsLoading(false)
                                                                        })
                                                                }
                                                        void getAnalyticData();   
                                                                })
                                                }
                                        void getUsersData();
                                        
                        })
                };
                
                void getUserInfoData();
        }, [user?.role, user?.username]);

        const periods : IdLabel[] = [
                        
                        
                        {
                                id: 0,
                                label: 'нед.',
                        },
                        {
                                id: 1,
                                label: 'мес.',
                        },
                ]
        const [period, setPeriod]=useState<IdLabel>(periods[0])

        // обновление данных по поиску
        
        useEffect(() => {
                if (updateFlag) {
                        setIsLoading(true);
                        const getAnalyticDataGraph = async () => {
                                await getAnalyticsGraph(filterValues).then((resp)=>{
                                        const processedData = resp.map(item => ({
                                                user: item.user,
                                                date: (period.id === 0) ? new Date(item.date).toLocaleString('default', { weekday: 'short' }) 
                                                : new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }), // Преобразуем дату в день недели
                                                revenue: Number((Number(item?.revenue) / 1000).toFixed(2)), 
                                                margProfit: Number((Number(item?.margProfit) / 1000).toFixed(2)) 
                                        }));
                                        setDataGraph(processedData);
                                        setIsLoading(false);
                                })
                        }
                        const getAnalyticData = async () => {
                                        await getAnalytics(filterValues).then((resp)=>{
                                                setData(resp);
                                                setIsLoading(false);
                                        })
                                }
                        void getAnalyticData();        
                        void getAnalyticDataGraph();
                        setUpdateFlag(false);
                }
        }, [filterValues, period, setUpdateFlag, updateFlag])

        const [data, setData]=useState<TAnalyticData[]>([])
        
        // меняем период расчета
        useEffect(() => {
                
                const today = new Date();
                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                if (period.id === 0) {
                        startDate.setDate(today.getDate() - 7);
                }
                if (period.id === 1) {
                        startDate.setDate(today.getDate() - 30);
                }
                setFilterValues(prev => ({...prev, startDate: startDate}))


        }, [period]);

        return (
                <div>
                        <Layout direction="column" >
                                
                                {isLoading && (
                                        <Layout style={{width: '100%', height: '50vh', justifyContent: 'center', alignItems: 'center'}}>
                                                <Loader/>
                                        </Layout>
                                )}
                                {!isLoading && (user?.role === 'ADM' || user?.role === 'SLR') && (
                                        <Layout direction="column">
                                                <Layout direction="row" style={{alignItems: 'center'}} className={cnMixSpace({ mT: 's' })}>
                                                        <Combobox
                                                                size="s"
                                                                items={users}
                                                                value={filterValues.users}
                                                                getItemKey={(item: string | undefined) => item ?? '' }
                                                                getItemLabel={(item: string | undefined) => item ?? ''}
                                                                multiple
                                                                placeholder="Продавцы"
                                                                renderValue={(item) => {
                                                                        const count = filterValues?.users?.length || 0;
                                                                        const selected = filterValues?.users ?? [];
                                                                        const primary = selected[0];
                                                                        if (count === 0) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>-</Text>;
                                                                        if (count === 1) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>{filterValues.users ? filterValues.users[0] : '-'}</Text>;
                                                                        return (item.item === primary) ? <Text size="m" className={cnMixSpace({ mT:'2xs' })} >{`Выбрано: ${count}`}</Text> : null;
                                                                }}
                                                                onChange={(value) => {
                                                                        if (value) {
                                                                                setFilterValues(prev => ({
                                                                                ...prev,
                                                                                users:  value,
                                                                                }));
                                                                        } else {
                                                                                setFilterValues(prev => ({
                                                                                        ...prev,
                                                                                        users:  null,
                                                                                        }));
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({ mL: 's' }) + ' ' + 'selectMobile'}
                                                                style={{minWidth: '170px', maxWidth: '170px'}}
                                                        /> 
                                                        <ChoiceGroup
                                                                items={periods}
                                                                value={period}
                                                                onChange={(value) => {
                                                                        setPeriod(value);
                                                                }}
                                                                name='periodChoice'
                                                                size="s"
                                                                style={{maxHeight: '32px'}}
                                                                className={cnMixSpace({ mH: 'xs' })}
                                                        />
                                                        <Button
                                                                iconLeft={AntIcon.asIconComponent(() => (
                                                                        <SearchOutlined
                                                                                className={cnMixFontSize('l')}
                                                                        />
                                                                ))}
                                                                onClick={()=>{
                                                                        setUpdateFlag(true);
                                                                }}
                                                                size="s"
                                                                view="secondary"
                                                        />

                                                </Layout>
                                                
                                                <Layout direction="column" className={cnMixSpace({ mB: 'm'})}>
                                                        <Card className={cnMixSpace({ mT:'m', mH: 's'})} style={{border: '1px solid var(--color-typo-brand)', minWidth: '250px',}}>
                                                                <Text size="m"  weight='bold' align="left" className={cnMixSpace({ mL: 'm', mT:'l'})} style={{color: 'var(--color-typo-brand)', justifyContent: 'left'}}>
                                                                        Выручка (тыс. руб)
                                                                </Text>
                                                                <Layout direction="row" className={cnMixSpace({ p:'m'})} style={{width: '100%', minWidth: '250px',  maxHeight: '200px'}}>
                                                                        {
                                                                                dataGraph && dataGraph.length > 0 ? (
                                                                                        <Line
                                                                                                data={dataGraph}
                                                                                                xField={'date'}
                                                                                                yField={'revenue'}
                                                                                                seriesField={'user'}  
                                                                                                style={{width: '100%', minWidth: '250px'}}
                                                                                        />
                                                                                ) : (
                                                                                        <Text view="secondary">Выберите хотя бы одного продавца</Text>
                                                                                ) 
                                                                        }
                                                                        
                                                                </Layout>
                                                        </Card>
                                                        
                                                        <Card className={cnMixSpace({ mT:'m', mH: 's'})} style={{border: '1px solid var(--color-typo-brand)'}}>
                                                                <Text size="m"  weight='bold' align="left" className={cnMixSpace({ mL: 'm', mT:'l'})} style={{color: 'var(--color-typo-brand)', justifyContent: 'left'}}>
                                                                        Марж. прибыль (тыс. руб)
                                                                </Text>
                                                                <Layout direction="row" className={cnMixSpace({ p:'m', mT:'2xs'})} style={{width: '100%',  maxHeight: '200px'}} >
                                                                        {
                                                                                dataGraph && dataGraph.length > 0 ? (
                                                                                        <Line 
                                                                                                data={dataGraph}
                                                                                                xField={'date'}
                                                                                                yField={'margProfit'}
                                                                                                seriesField={'user'} 
                                                                                                style={{width: '100%'}} 
                                                                                        />
                                                                                ) : (
                                                                                        <Text view="secondary">Выберите хотя бы одного продавца</Text>
                                                                                ) 
                                                                        }
                                                                </Layout>  
                                                        </Card>
                                                        <Card className={cnMixSpace({ mT:'m', mH: 's'})} style={{border: '1px solid var(--color-typo-brand)'}}>
                                                                <Text size="m"  weight='bold' align="left" className={cnMixSpace({ mL: 'm', mT:'l'})} style={{color: 'var(--color-typo-brand)', justifyContent: 'left'}}>
                                                                        Премиальные выплаты
                                                                </Text>
                                                                <Layout direction="column" className={cnMixSpace({ p:'m', mT:'2xs'})} style={{width: '100%',  maxHeight: '200px'}} >
                                                                        {data.length > 0 ? (
                                                                                <List
                                                                                        items={data}
                                                                                        getItemLabel={item => item.user}
                                                                                        renderItem={(item)=> (
                                                                                                <Layout direction="row" style={{alignItems: 'center'}} className={cnMixSpace({ mT: 's'})} >
                                                                                                        <Avatar
                                                                                                                name={item?.user ?? ''}
                                                                                                                className={cnMixSpace({ mR: 'xs'})}
                                                                                                        />
                                                                                                        <Text size="s">
                                                                                                                {(item?.user ?? '') + ' - ' + formatNumber((Number(item.margProfit ?? 0 ) * 0.04).toFixed(2))  + ' руб' }
                                                                                                        </Text>
                                                                                                </Layout>
                                                                                        )}
                                                                                />  
                                                                        ) : (
                                                                                <Text view="secondary">Выберите хотя бы одного продавца</Text>
                                                                        ) 
                                                                        }
                                                                        
                                                                </Layout>  
                                                        </Card>
                                                        
                                                </Layout>
                                        </Layout>
                                )}
                        </Layout>
                </div>
                
                
        )
}
export default AnalyticsPageMobile