import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Pie } from '@consta/charts/Pie';
import { Line } from '@consta/charts/Line';
import { List } from '@consta/uikit/ListCanary';
import { Avatar } from '@consta/uikit/Avatar';

import { TAnalyticData, TAnalyticFilter, TAnalyticGraphData, TAssetsData, TProdDataFilter, TProdDataSortFields } from "../../types/analytic-types.ts";

// иконки
import { getAnalytics, getAnalyticsAssets, getAnalyticsGraph } from "../../services/SalesService.ts";
import { Loader } from "@consta/uikit/Loader/index";
import { getUserInfo, UserInfo } from "../../services/AuthorizationService.ts";
import AnalyticsProductsTable from "./AnalyticsProductsTable.tsx";
import { Sort, useTableSorter } from "../../hooks/useTableSorter.ts";
import { Checkbox } from "@consta/uikit/Checkbox/index";
import { Switch } from "@consta/uikit/Switch/index";
import { formatNumber } from "../../utils/formatNumber.ts";





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
const [updateFlagTable, setUpdateFlagTable]=useState<boolean>(false)
const [user, setUser] = useState<UserInfo | undefined>(undefined);

const [isTable, setIsTable] = useState<boolean>(false);
const [isWithPartner, setIsWithPartner] = useState<boolean>(false);
        
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
                setUpdateFlag(false);
                setUpdateFlagTable(true);
        }

        
}, [filterValues, setUpdateFlag, updateFlag])


        const PageSettings: {
                filterValues: TProdDataFilter | null;
                currentPage: number;
                columnSort?: Sort<TProdDataSortFields>;
                countFilterValues?: number | null;
        } = {
                filterValues: filterValues,
                currentPage: 0,
                columnSort: [],
        };
        const [count, setCount] = useState<number | null>(0)
        const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
        const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                useTableSorter<TProdDataSortFields>(PageSettings.columnSort);
        


        return (
                <Layout direction="column" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row" style={{ alignItems: 'center'}}>
                                <Switch checked={isTable} label="Отчет по товарам" onChange={()=>{setIsTable(!isTable)}} className={cnMixSpace({mV: 'm'})}/>
                                {isTable && (<>
                                        <Checkbox checked={isWithPartner} label="Детализация (партнеры)" onChange={()=>{setIsWithPartner(!isWithPartner)}} className={cnMixSpace({mV: 'm', mL: 'm'})}/>
                                </>)}
                        </Layout>
                        {!isLoading && data && data?.length > 0 && !isTable &&  (
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
                                                                                                        {(item?.user ?? '') + ' - ' + formatNumber((Number(item.margProfit ?? 0 ) * 0.03).toFixed(2))  + ' руб' }
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
                                                                                        {formatNumber((Number(assetsData?.supplies?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'На складе: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left"  weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.warehouse?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Деньги в офисе: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left"  weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.officeAsset ?? 0 )).toFixed(2))  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Дебиторская задолженность: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.debit?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб'}
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Деньги в офисе с вычетом задолженности: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {formatNumber((Number(Number(assetsData?.officeAsset) + Number(assetsData?.debit))).toFixed(2))  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Выручка с продаж: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left" weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.revenue?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб'  }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Маржа с продаж: ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({ mL: 'm'})} align="left"  weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.margProfit?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб' }
                                                                                </Text>
                                                                        </Layout>
                                                                </Layout>
                                                        </Layout>
                                                        )}
                                                </Layout>
                                        )}
                                        
                                </Layout>
                        )}

                {!isLoading && dataGraph && dataGraph?.length > 0 && !isTable && (
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

                        {(user?.role === 'ADM') && isTable && (
                                        <AnalyticsProductsTable 
                                                        updateFlag={updateFlagTable}
                                                        setUpdateFlag={setUpdateFlagTable}
                                                        currentPage={currentPage}
                                                        setCurrentPage={setCurrentPage}
                                                        getColumnSortOrder={getColumnSortOrder}
                                                        getColumnSortOrderIndex={getColumnSortOrderIndex}
                                                        columnSort={columnSort}
                                                        onColumnSort={onColumnSort}
                                                        filterValues={filterValues}
                                                        count={count}
                                                        setCount={setCount}
                                                        isWithPartner={isWithPartner}
                                        />
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