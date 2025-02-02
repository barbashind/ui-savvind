
import { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';

// собственные компоненты
import ProductPurchaseToolbar from "../components/ProductPurchase/ProductPurchaseToolbar.tsx";
import ProductPurchaseTable from "../components/ProductPurchase/ProductPurchaseTable.tsx";
import ProductPurchaseDetailsModal from "../components/ProductPurchase/ProductPurchaseDetailsModal.tsx";
import ProductPurchaseFilter from "../components/ProductPurchase/ProductPurchaseFilter.tsx";
import { TPurchaseFilter, TPurchaseSortFields } from "../types/purchase-types.ts";
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts";
import { getUserInfo } from "../services/AuthorizationService.ts";
import { Text } from "@consta/uikit/Text/index";


const Purchase = () => {

        const defaultFilter : TPurchaseFilter = {
                sumMin: null,
                sumMax: null,
                dateMin: null,
                dateMax: null,
                batchNumber: null,
                batchStatus: ['CREATED'],
        }
        
        const PageSettings: {
                        filterValues: TPurchaseFilter | null;
                        currentPage: number;
                        columnSort?: Sort<TPurchaseSortFields>;
                        countFilterValues?: number | null;
                } = {
                        filterValues: defaultFilter,
                        currentPage: 0,
                };
        const [count, setCount] = useState<number | null>(0)
        const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
        const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                useTableSorter<TPurchaseSortFields>(PageSettings.columnSort);
                
        const [filterValues, setFilterValues] = useState<TPurchaseFilter>(
                PageSettings.filterValues ?? defaultFilter
        );

        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
        const [id, setId] = useState<number | undefined>(undefined)
        const [updateFlag, setUpdateFlag] = useState<boolean>(true);

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
                <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                        {role === 'ADM' && (
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <ProductPurchaseToolbar
                                                setIsEditModalOpen={setIsEditModalOpen} 
                                                setIsFilterModalOpen={setIsFilterModalOpen}
                                        />
                                        <ProductPurchaseTable
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
                                        <ProductPurchaseDetailsModal
                                                isOpen={isEditModalOpen}
                                                setIsOpen={setIsEditModalOpen}
                                                batchId={id}
                                                setBatchId={setId}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                        <ProductPurchaseFilter
                                                isFilterOpen={isFilterModalOpen}
                                                setIsFilterOpen={setIsFilterModalOpen}
                                                setUpdateFlag={setUpdateFlag}
                                                filterValues={filterValues}
                                                setFilterValues={setFilterValues}
                                        />
                                </Layout>
                        )}
                        {role !== 'ADM' && (
                                <Text>Нет полномочий</Text>
                        )}
                                
                </Card>

        )
}
export default Purchase;