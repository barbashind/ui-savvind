

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';
import { Text } from "@consta/uikit/Text";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/AuthorizationService";
import HistoryTable from "../components/HistoryPage/HistoryTable";
import { THistoryFilter, THistorySortFields } from "../types/history-types";
import { Sort, useTableSorter } from "../hooks/useTableSorter";
import { Tabs } from "@consta/uikit/Tabs";
import { Checkbox } from "@consta/uikit/Checkbox";

// собственные компоненты



const History = () => {

        const [role, setRole] = useState<string | undefined>(undefined);

        const tabs = [
        {
                id: 0,
                label: 'Изменения счетов',
                table_name: 'accounts'
        },
        {
                id: 1,
                label: 'История возвратов',
                table_name: 'items_batch'
        },

        ]

        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setRole(resp.role);
                        })
                };
                void getUserInfoData();
        }, []);
                const [updateFlag, setUpdateFlag] = useState<boolean>(true);
                const defaultFilter : THistoryFilter = {
                        searchText: null,
                        table_name: 'items_batch',
                        onlyReturn: false,
                }
        
                const PageSettings: {
                                        filterValues: THistoryFilter | null;
                                        currentPage: number;
                                        columnSort?: Sort<THistorySortFields>;
                                        countFilterValues?: number | null;
                                } = {
                                        filterValues: defaultFilter,
                                        currentPage: 0,
                                        columnSort: [{column: 'id', sortOrder: 'desc'}]
                                };
                const [count, setCount] = useState<number | null>(0)
                const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
                const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                                useTableSorter<THistorySortFields>(PageSettings.columnSort);
                                
                const [filterValues, setFilterValues] = useState<THistoryFilter>(
                                PageSettings.filterValues ?? defaultFilter
                );
        


        return (
                <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                        
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <Text size='2xl' view='brand' weight="semibold" align="left" >История изменений</Text>
                                        <Layout direction="row">
                                                <Tabs 
                                                        value={tabs.find(el => (filterValues.table_name === el.table_name))}
                                                        onChange={(value) => {
                                                                setFilterValues(prev => ({...prev, table_name: value.table_name}));
                                                                setFilterValues(prev => ({...prev, onlyReturn: false}));
                                                                setUpdateFlag(true);
                                                        }}
                                                        items={tabs}
                                                />
                                        </Layout>
                                         {(filterValues.table_name === 'items_batch') && (
                                                <Layout direction="row" className={cnMixSpace({mV:'l'})}>
                                                        <Checkbox 
                                                                label="Только возвраты" 
                                                                checked={filterValues.onlyReturn} 
                                                                onClick={() => {
                                                                        setFilterValues(prev => ({...prev, onlyReturn: !filterValues.onlyReturn}));
                                                                        setUpdateFlag(true);
                                                                } } 
                                                        />
                                                </Layout>
                                        )}
                                        {role !== 'ADM' && (filterValues.table_name !== 'accounts') && (
                                                <HistoryTable
                                                        updateFlag={updateFlag}
                                                        setUpdateFlag={setUpdateFlag}
                                                        currentPage={currentPage}
                                                        setCurrentPage={setCurrentPage}
                                                        getColumnSortOrder={getColumnSortOrder}
                                                        getColumnSortOrderIndex={getColumnSortOrderIndex}
                                                        columnSort={columnSort}
                                                        onColumnSort={onColumnSort}
                                                        filterValues={filterValues}
                                                        count={count}
                                                        setCount={setCount}
                                                />
                                        )}
                                        {role === 'ADM'  && (
                                                <HistoryTable
                                                        updateFlag={updateFlag}
                                                        setUpdateFlag={setUpdateFlag}
                                                        currentPage={currentPage}
                                                        setCurrentPage={setCurrentPage}
                                                        getColumnSortOrder={getColumnSortOrder}
                                                        getColumnSortOrderIndex={getColumnSortOrderIndex}
                                                        columnSort={columnSort}
                                                        onColumnSort={onColumnSort}
                                                        filterValues={filterValues}
                                                        count={count}
                                                        setCount={setCount}
                                                />
                                        )}
                                        {role !== 'ADM' && (filterValues.table_name === 'accounts') && (
                                                <Text>Нет полномочий</Text>
                                        )}
                                </Layout>
                </Card>

        )
}
export default History;