import { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';


// Собственные компоненты
import AccountingToolbar from "../components/AccountingPage/AccountingToolbar.tsx";
import AccountingTable from "../components/AccountingPage/AccountingTable.tsx";
import { TAccountingFilter, TAccountingSortFields } from "../types/accounting-types.ts";
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts";
import AccountingDetailsModal from "../components/AccountingPage/AccountingDetailsModal.tsx";
import AccountingAccModal from "../components/AccountingPage/AccountingAccModal.tsx";
import { getUserInfo } from "../services/AuthorizationService.ts";
import { Text } from "@consta/uikit/Text/index";



const Accounting = ( ) => {

        const defaultFilter : TAccountingFilter = {
                searchText: null,
        }

        const PageSettings: {
                filterValues: TAccountingFilter | null;
                currentPage: number;
                columnSort?: Sort<TAccountingSortFields>;
                countFilterValues?: number | null;
        } = {
                filterValues: defaultFilter,
                currentPage: 0,
                columnSort: [{column: 'id', sortOrder: 'desc'}]
        };
        const [count, setCount] = useState<number | null>(0)
        const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
        const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                useTableSorter<TAccountingSortFields>(PageSettings.columnSort);
        
        const [filterValues, setFilterValues] = useState<TAccountingFilter>(
                PageSettings.filterValues ?? defaultFilter
        );
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [isAccModalOpen, setIsAccModalOpen] = useState<boolean>(false)

        const [id, setId] = useState<number | undefined>(undefined)
        const [updateFlag, setUpdateFlag] = useState<boolean>(true);
        const [searchText, setSearchText] = useState<string | null> (null);
        
        const [role, setRole] = useState<string | undefined>(undefined);
        
                     useEffect(() => {
                                
                                const getUserInfoData = async () => {
                                        await getUserInfo().then((resp) => {
                                                setRole(resp.role);
                                        })
                                };
                                
                                void getUserInfoData();
                        }, []);
        
        return (
                <Card style={{width: '100%', height: '100%'}} className={cnMixSpace({p: 's'})}>
                        {(role !== 'SLR') && (
                              <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                <AccountingToolbar
                                         setIsEditModalOpen={setIsEditModalOpen} 
                                         setSearchText={setSearchText}
                                         setFilterValues={setFilterValues}
                                         searchText={searchText}
                                         setUpdateFlag={setUpdateFlag}
                                         setIsAccModalOpen={setIsAccModalOpen}
                                />
                                {(role === 'ADM') && (
                                        <AccountingTable 
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
                                                        setId={setId}
                                                        setIsEditModalOpen={setIsEditModalOpen}
                                        />
                                )}
                                {(role === ('KUR'))&& (
                                        <Text>Нет полномочий</Text>
                                )}
                                
                                <AccountingDetailsModal
                                        id={id}
                                        setId={setId}
                                        setIsOpen={setIsEditModalOpen}
                                        isOpen={isEditModalOpen}
                                        setUpdateFlag={setUpdateFlag}
                                />
                                {(role === 'ADM') && (
                                        <AccountingAccModal
                                                isOpen={isAccModalOpen}
                                                setIsOpen={setIsAccModalOpen}
                                        />
                                )}
                        </Layout>  
                        )}
                        {(role === ('SLR'))&& (
                                <Text>Нет полномочий</Text>
                        )}
                        
                </Card>

        )
}
export default Accounting;