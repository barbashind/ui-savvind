import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Pie } from '@consta/charts/Pie';
import { Line } from '@consta/charts/Line';
import { List } from '@consta/uikit/ListCanary';
import { Avatar } from '@consta/uikit/Avatar';

import { TAnalyticData, TAnalyticFilter, TAnalyticGraphData, TAssetsData } from "../../types/analytic-types.ts";

// иконки
import { getAnalytics, getAnalyticsAssets, getAnalyticsGraph } from "../../services/SalesService.ts";
import { Loader } from "@consta/uikit/Loader/index";
import { getUserInfo, UserInfo } from "../../services/AuthorizationService.ts";





export interface TAnalyticDataProps {
        filterValues: TAnalyticFilter;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        updateFlag: boolean;
}

const AnalyticData = ({filterValues, setUpdateFlag, updateFlag} : TAnalyticDataProps) => {

const [data, setData]=useState<TAnalyticData[]>([])
const [assetsData, setAssetsData]=useState<TAssetsData | undefined>(undefined)
const [dataGraph, setDataGraph]=useState<TAnalyticGraphData[]>([])
const [isLoading, setIsLoading]=useState<boolean>(false)
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
        if (updateFlag) {
                setIsLoading(true);
                const getAnalyticData = async () => {
                        await getAnalytics(filterValues).then((resp)=>{
                                setData(resp);
                                setIsLoading(false)
                        })
                }
                const getAnalyticDataGraph = async () => {
                        await getAnalyticsGraph(filterValues).then((resp)=>{
                                setDataGraph(resp);
                        })
                }
                const getAssetsData = async () => {
                        await getAnalyticsAssets().then((resp)=>{
                                setAssetsData(resp);
                        })
                }
                void getAssetsData();
                void getAnalyticData();
                void getAnalyticDataGraph();
                setUpdateFlag(false)
        }
        
}, [filterValues, setUpdateFlag, updateFlag])


        return (
                <Layout direction="column" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        {!isLoading && data && data?.length > 0 && (
                                <Layout direction="row" className={cnMixSpace({ mB: 'm'})} style={{minHeight: '420px'}}>
                                        <Layout direction="column" style={{ border: '1px solid #56b9f2', borderRadius: '4px'}} className={cnMixSpace({pH: 'm'})}>
                                                <Text size="s" className={cnMixSpace({ mT: 's'})} style={{width: '150px'}} >
                                                        Выручка
                                                </Text>
                                                <Pie 
                                                        data={data}
                                                        angleField={'revenue'} 
                                                        colorField={'user'}  
                                                        style={{
                                                                width: 300,
                                                                height: '100%',
                                                              }}
                                                        innerRadius={0.64}
                                                        statistic={{
                                                                title: false,
                                                                content: false,
                                                        }}                                              
                                                />
                                        </Layout>
                                        <Layout direction="column" className={cnMixSpace({ mL: 'xl', pH: 'm'})} style={{ border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                <Text size="s" className={cnMixSpace({ mT: 's'})} style={{width: '150px'}}>
                                                        Маржа
                                                </Text>
                                                <Pie 
                                                        data={data}
                                                        angleField={'margProfit'} 
                                                        colorField={'user'}   
                                                        style={{
                                                                width: 300,
                                                                height: '100%',
                                                              }}  
                                                        innerRadius={0.64}
                                                        statistic={{
                                                                title: false,
                                                                content: false,
                                                        }}                                           
                                                />
                                        </Layout>
                                        {user?.role === 'ADM' && (
                                                <Layout direction="row" className={cnMixSpace({ mL: 'xl'})}>

                                                        <Layout direction="column" className={cnMixSpace({ mL: 'xl'})}>
                                                                <Text size="s" view="secondary" className={cnMixSpace({ mT: 's'})} style={{width: '250px'}} align="left">
                                                                        Премиальные выплаты:
                                                                </Text>
                                                                <Layout direction="column" className={cnMixSpace({ mT: 'm'})}>
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
                                                                                                        {(item?.user ?? '') + ' - ' + (Number(item.margProfit ?? 0 ) * 0.03).toFixed(2)  + ' руб' }
                                                                                                </Text>
                                                                                        </Layout>
                                                                                )}
                                                                        />
                                                                </Layout>
                                                        </Layout>
                                                        {user.role === 'ADM' && (

                                                        
                                                        <Layout direction="column" className={cnMixSpace({ mL: 'xl'})}>
                                                                <Text size="s" view="secondary" className={cnMixSpace({ mT: 's'})} style={{width: '250px'}} align="left">
                                                                        Общие данные:
                                                                </Text>
                                                                <Layout direction="column" className={cnMixSpace({ mT: 'm'})}> 
                                                                        <Layout direction="row" className={cnMixSpace({  p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s" align="left">
                                                                                        {'В доставке и на оприходовании: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(assetsData?.supplies?.toFixed(2) ?? 0 )).toFixed(2)  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'На складе: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(assetsData?.warehouse?.toFixed(2) ?? 0 )).toFixed(2)  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Деньги в офисе: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(assetsData?.officeAsset ?? 0 )).toFixed(2)  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Дебиторская задолженность: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(assetsData?.debit?.toFixed(2) ?? 0 )).toFixed(2)  + ' руб'}
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Деньги в офисе с вычетом задолженности: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(Number(assetsData?.officeAsset) + Number(assetsData?.debit))).toFixed(2)  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Выручка с продаж: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left" weight="semibold">
                                                                                        {(Number(assetsData?.revenue?.toFixed(2) ?? 0 )).toFixed(2)  + ' руб'  }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Маржа с продаж: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {(Number(assetsData?.margProfit?.toFixed(2) ?? 0 )).toFixed(2)  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                </Layout>
                                                        </Layout>
                                                        )}
                                                </Layout>
                                        )}
                                        
                                </Layout>
                        )}

                {!isLoading && dataGraph && dataGraph?.length > 0 && (
                                <Layout direction="column" className={cnMixSpace({ mB: 'm'})}>
                                        <Layout direction="row" className={cnMixSpace({ p:'m'})} style={{width: '100%', border: '1px solid #56b9f2', minHeight: '350px'}}>
                                                <Text size="s" className={cnMixSpace({ mR: 'm'})} style={{width: '150px'}}>
                                                        Выручка
                                                </Text>
                                                <Line 
                                                        data={dataGraph}
                                                        xField={'date'}
                                                        yField={'revenue'}
                                                        seriesField={'user'}  
                                                        style={{width: '100%'}}
                                                />
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ p:'m', mT:'m'})} style={{width: '100%', border: '1px solid #56b9f2', minHeight: '350px'}} >
                                                <Text size="s" className={cnMixSpace({ mR: 'm'})} style={{width: '150px'}}>
                                                        Маржа
                                                </Text>
                                                <Line 
                                                        data={dataGraph}
                                                        xField={'date'}
                                                        yField={'margProfit'}
                                                        seriesField={'user'} 
                                                        style={{width: '100%'}} 
                                                />
                                        </Layout>
                                        
                                </Layout>
                        )}

                        {isLoading && (
                                <Layout style={{width: '100%', height: '50px', justifyContent: 'center', alignItems: 'center'}}>
                                        <Loader/>
                                </Layout>
                        )}
                        
                </Layout>
        )
}
export default AnalyticData;