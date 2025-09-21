import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Pie } from '@consta/charts/Pie';
import { Line } from '@consta/charts/Line';
import { List } from '@consta/uikit/ListCanary';
import { Avatar } from '@consta/uikit/Avatar';

import { TAnalyticData, TAnalyticDeliversData, TAnalyticFilter, TAnalyticGraphData, TAssetsData, TProdDataFilter, TProdDataSortFields } from "../../types/analytic-types.ts";

// иконки
import { getAnalytics, getAnalyticsAssets, getAnalyticsDeliver, getAnalyticsGraph } from "../../services/SalesService.ts";
import { Loader } from "@consta/uikit/Loader/index";
import { getUserInfo, UserInfo } from "../../services/AuthorizationService.ts";
import AnalyticsProductsTable from "./AnalyticsProductsTable.tsx";
import { Sort, useTableSorter } from "../../hooks/useTableSorter.ts";
import { Checkbox } from "@consta/uikit/Checkbox/index";
import { Switch } from "@consta/uikit/Switch/index";
import { formatNumber } from "../../utils/formatNumber.ts";
import { Tag } from "@consta/uikit/Tag/index";
import { Badge } from "@consta/uikit/Badge/index";





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

const [dataDelivers, setDataDelivers]=useState<TAnalyticDeliversData[]>([])

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
                        await getAnalyticsAssets(filterValues).then((resp)=>{
                                setAssetsData(resp);
                        })
                }
                const getDeliversData = async () => {
                        await getAnalyticsDeliver((resp)=>{
                                setDataDelivers(resp);
                        })
                }
                void getAssetsData();
                void getAnalyticData();
                void getAnalyticDataGraph();
                void getDeliversData();
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
                                                                                                        {(item?.user ?? '') + ' - ' + formatNumber((Number(item.margProfit ?? 0 ) * 0.04).toFixed(2))  + ' руб' }
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
                                                                                        {'Выручка с продаж(за период): ' }
                                                                                </Text>
                                                                                <Text size="m" className={cnMixSpace({  mL: 'm'})} align="left" weight="semibold">
                                                                                        {formatNumber((Number(assetsData?.revenue?.toFixed(2) ?? 0 )).toFixed(2))  + ' руб'  }
                                                                                </Text>
                                                                        </Layout>
                                                                        <Layout direction="row" className={cnMixSpace({ mT: 'm', p: 's'})} style={{alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}}>
                                                                                <Text size="s"  align="left">
                                                                                        {'Маржа с продаж(за период): ' }
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

{!isLoading && dataGraph && dataGraph?.length > 0 && !isTable && (
                                <Layout direction="column" className={cnMixSpace({ mB: 'm', p:'m'})} style={{width: '100%', border: '1px solid #56b9f2', minHeight: '350px'}}>
                                        <Layout direction="row" >
                                                <Text size="m" view='link' className={cnMixSpace({ mR: 'm'})} style={{width: '150px'}}>
                                                        Товары в пути
                                                </Text>
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT: 'm'})}>
                                                <Text size="s" view="secondary" className={cnMixSpace({ mR: 'm',  pL: 'l'})} style={{width: '300px'}} align="left"  >
                                                        Доставщик
                                                </Text>
                                                <Text size="s" view="secondary" align="left" className={cnMixSpace({ mR: 'm', mL: '5xl' })} style={{width: '100%'}}>
                                                        Товары
                                                </Text>
                                        </Layout>
                                        <Layout direction="column">
                                                {dataDelivers && dataDelivers?.length > 0 && dataDelivers?.map(deliver => (
                                                        <Layout direction="row" className={cnMixSpace({ mT: 's'})} style={{width: 'fit-content', alignItems: 'center', border: '1px solid #56b9f2', borderRadius: '4px'}} >
                                                                <Text style={{width: '300px'}} size="xs" align="left" className={cnMixSpace({ pL: 'l'})}>{deliver.deliver}</Text>
                                                                <Badge size="s" className={cnMixSpace({ mL: 'm'})} label={'Сумма: ' + deliver?.products?.reduce((total, item) => total + (item?.cost ?? 0), 0) + ' $'} view="filled"/>
                                                                <Layout direction="column" style={{width: 'fit-content'}} className={cnMixSpace({ p: 'xs'})}>
                                                                        {deliver?.products && deliver?.products?.length > 0 && deliver?.products?.map(
                                                                                item => (
                                                                                        <Layout direction="row" className={cnMixSpace({ p: '2xs', mV: '2xs'})} style={{width: 'fit-content', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0, 66, 105, .28)', borderRadius: '4px'}} > 
                                                                                                <Text size="xs" style={{minWidth: '200px', maxWidth:'200px'}} align="left">{item.name}</Text>
                                                                                                <Tag size="s" className={cnMixSpace({ mL: 'm'})} label={item.quant + ' шт'} mode="info"/>
                                                                                                <Badge size="s" className={cnMixSpace({ mL: 'm'})} label={item.cost + ' $'} view="filled"/>
                                                                                        </Layout> 
                                                                                )
                                                                        )}
                                                                        
                                                                </Layout>
                                                        </Layout>
                                                ))}
                                                
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