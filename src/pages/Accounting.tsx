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

const Accounting = ( ) => {

        const defaultFilter : TAccountingFilter = {
                searchText: null,
                accountFrom: null,
                accountTo: null,
                valueFrom: null,
                valueTo: null,
                dateFrom: null,
                dateTo: null
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
        
        const [role, setRole] = useState<string | undefined>(undefined);
        const [isMatvei, setIsMatvei] = useState<boolean>(false);
        
                     useEffect(() => {
                                
                                const getUserInfoData = async () => {
                                        await getUserInfo().then((resp) => {
                                                setRole(resp.role);
                                                if (resp.username === 'Matvei') {
                                                       setIsMatvei(true); 
                                                }
                                        })
                                };
                                
                                void getUserInfoData();
                        }, []);
        
        return (
                <Card style={{width: '100%', height: '100%'}} className={cnMixSpace({p: 's'})}>
                              <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                <AccountingToolbar
                                         setIsEditModalOpen={setIsEditModalOpen} 
                                         setFilterValues={setFilterValues}
                                         setUpdateFlag={setUpdateFlag}
                                         setIsAccModalOpen={setIsAccModalOpen}
                                         role={role ?? ''}
                                         isMatvei={isMatvei}
                                         filterValues={filterValues}
                                />
                                {(role === 'ADM' || role === 'SLR' || role === 'KUR' ) && (
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
                                
                                
                                <AccountingDetailsModal
                                        id={id}
                                        setId={setId}
                                        setIsOpen={setIsEditModalOpen}
                                        isOpen={isEditModalOpen}
                                        setUpdateFlag={setUpdateFlag}
                                />
                                {(role === 'ADM' || role === 'SLR' ) && (
                                        <AccountingAccModal
                                                isOpen={isAccModalOpen}
                                                setIsOpen={setIsAccModalOpen}
                                        />
                                )}
                        </Layout>  
                        
                        
                </Card>

        )
}
export default Accounting;