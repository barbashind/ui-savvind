import { useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';


// Собственные компоненты
import SalesTable from "../components/SalesPage/SalesTable.tsx"
import SalesToolbar from "../components/SalesPage/SalesToolbar.tsx"
import SalesFilter from "../components/SalesPage/SalesFilter.tsx"
import SalesDetailsModal from "../components/SalesPage/SalesDetailsModal.tsx";
import { TCheckFilter, TCheckSortFields } from "../types/sales-types.ts";
import SalesTableProducts from "../components/SalesPage/SalesTableProducts.tsx";
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts";
import ReturnModal from "../components/SalesPage/ReturnModal.tsx";
import PurchaseModal from "../components/SalesPage/PurchaseModal.tsx";

const Sales = () => {
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false)
        const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false)
        const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
        const [id, setId] = useState<number | undefined>(undefined)
        const [updateFlag, setUpdateFlag] = useState<boolean>(true);
        const [searchText, setSearchText] = useState<string | null> (null);
        const defaultFilter : TCheckFilter = {
                dateMin: undefined,
                dateMax: undefined,
                customer: null,
                searchText: null,
                isUnpaid: true,
                isBooking: true,
                isPaid: true
        }

        const PageSettings: {
                                filterValues: TCheckFilter | null;
                                currentPage: number;
                                columnSort?: Sort<TCheckSortFields>;
                                countFilterValues?: number | null;
                        } = {
                                filterValues: defaultFilter,
                                currentPage: 0,
                                columnSort: [{column: 'checkId', sortOrder: 'desc'}]
                        };
        const [count, setCount] = useState<number | null>(0)
        const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
        const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                        useTableSorter<TCheckSortFields>(PageSettings.columnSort);
                        
        const [filterValues, setFilterValues] = useState<TCheckFilter>(
                        PageSettings.filterValues ?? defaultFilter
                );

        const [isProducts, setIsProducts] = useState<boolean>(false);
        
        return (
                <Card style={{width: '100%'}}  className={cnMixSpace({p: 's'})}>
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                <SalesToolbar
                                        setIsEditModalOpen={setIsEditModalOpen} 
                                        setSearchText={setSearchText}
                                        searchText={searchText}
                                        setUpdateFlag={setUpdateFlag}
                                        setIsFilterModalOpen={setIsFilterModalOpen}
                                        setIsProducts={setIsProducts}
                                        isProducts={isProducts}
                                        setFilterValues={setFilterValues}
                                        filterValues={filterValues}
                                        setIsReturnModalOpen={setIsReturnModalOpen}
                                        setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                                />
                                {!isProducts && (
                                        <SalesTable 
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
                                {isProducts && (
                                      <SalesTableProducts
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
                                

                                
                                <PurchaseModal
                                        isOpen={isPurchaseModalOpen}
                                        setIsOpen={setIsPurchaseModalOpen}
                                />
                                 <SalesDetailsModal
                                        isOpen={isEditModalOpen}
                                        setIsOpen={setIsEditModalOpen}
                                        checkId={id}
                                        setCheckId={setId}
                                        setUpdateFlag={setUpdateFlag}
                                />
                                <ReturnModal
                                        isOpen={isReturnModalOpen}
                                        setIsOpen={setIsReturnModalOpen}
                                        setUpdateFlag={setUpdateFlag}
                                />
                                <SalesFilter
                                        isFilterOpen={isFilterModalOpen}
                                        setIsFilterOpen={setIsFilterModalOpen}
                                        setUpdateFlag={setUpdateFlag}
                                        filterValues={filterValues}
                                        setFilterValues={setFilterValues}
                                        isProducts={isProducts}
                                />
                        </Layout>
                </Card>

        )
}
export default Sales