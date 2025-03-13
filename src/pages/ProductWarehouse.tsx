import { Layout } from "@consta/uikit/Layout"
import { useState } from "react"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';
import ProductWarehouseFilter from "../components/ProductWarehousePage/ProductWarehouseFilter.tsx";
import ProductWarehouseDetailsModal from "../components/ProductWarehousePage/ProductWarehouseDetailsModal.tsx";
import ProductWarehouseToolbar from "../components/ProductWarehousePage/ProductWarehouseToolbar.tsx";
import ProductWarehouseTable from "../components/ProductWarehousePage/ProductWarehouseTable.tsx";
import { TPurchaseFilter, TPurchaseItemFilter, TPurchaseItemSortFields, TPurchaseSortFields } from "../types/purchase-types.ts";
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts";
import ProductWarehouseItemsTable from "../components/ProductWarehousePage/ProductWarehouseItemsTable.tsx";
import WriteDownModal from "../components/ProductWarehousePage/WriteDownModal.tsx";

export type TMode = {
        code: string;
}

const ProductWarehouse = () => {
        const defaultFilter : TPurchaseFilter = {
                        sumMin: null,
                        sumMax: null,
                        dateMin: null,
                        dateMax: null,
                        batchNumber: null,
                        batchStatus: ['COMPLETED'],
                }
        const defaultFilterP : TPurchaseItemFilter = {
                searchText: null,
                warehouse: null
        }
                
                const PageSettings: {
                                filterValues: TPurchaseFilter | null;
                                currentPage: number;
                                columnSort?: Sort<TPurchaseSortFields>;
                                countFilterValues?: number | null;
                        } = {
                                filterValues: defaultFilter,
                                currentPage: 0,
                                columnSort: [{column: 'batchNumber', sortOrder: 'desc'}]

                        };
                const PageSettingsP: {
                                filterValues: TPurchaseItemFilter | null;
                                currentPage: number;
                                columnSort?: Sort<TPurchaseItemSortFields>;
                                countFilterValues?: number | null;
                        } = {
                                filterValues: defaultFilterP,
                                currentPage: 0,
                                columnSort: [{column: 'itemBatchId', sortOrder: 'desc'}]

                        };
                const [count, setCount] = useState<number | null>(0)
                const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
                const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                        useTableSorter<TPurchaseSortFields>(PageSettings.columnSort);
                        
                const [filterValues, setFilterValues] = useState<TPurchaseFilter>(
                        PageSettings.filterValues ?? defaultFilter
                );
                
                const [filterValuesP, setFilterValuesP] = useState<TPurchaseItemFilter>(
                        PageSettingsP.filterValues ?? defaultFilterP
                );
        
                const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
                const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
                const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false)
                const [id, setId] = useState<number | undefined>(undefined)
                const [updateFlag, setUpdateFlag] = useState<boolean>(true);

                const modes : TMode[] = [
                        {code: 'BATCHES'},
                        {code: 'PRODUCTS'}
                ]
                const [mode, setMode] = useState<TMode>(modes[0])

        return (
                <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <ProductWarehouseToolbar
                                                setIsFilterModalOpen={setIsFilterModalOpen}
                                                setFilterValuesP={setFilterValuesP}
                                                setIsReturnModalOpen={setIsReturnModalOpen}
                                                filterValuesP={filterValuesP}
                                                setUpdateFlag={setUpdateFlag}
                                                mode={mode}
                                                setMode={setMode}
                                                modes={modes}
                                        />
                                        {mode.code === 'BATCHES' && (
                                                <ProductWarehouseTable
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
                                        {mode.code === 'PRODUCTS' && (
                                                <ProductWarehouseItemsTable
                                                        updateFlag={updateFlag}
                                                        setUpdateFlag={setUpdateFlag}
                                                        currentPage={currentPage}
                                                        setCurrentPage={setCurrentPage}
                                                        filterValues={filterValuesP}
                                                        count={count}
                                                        setCount={setCount} 
                                                        PageSettings={PageSettingsP}
                                                />
                                        )}

                                        <WriteDownModal
                                                isOpen={isReturnModalOpen}
                                                setIsOpen={setIsReturnModalOpen}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                        
                                        <ProductWarehouseDetailsModal
                                                isOpen={isEditModalOpen}
                                                setIsOpen={setIsEditModalOpen}
                                                batchId={id}
                                                setBatchId={setId}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                        <ProductWarehouseFilter
                                                isFilterOpen={isFilterModalOpen}
                                                setIsFilterOpen={setIsFilterModalOpen}
                                                setUpdateFlag={setUpdateFlag}
                                                filterValues={filterValues}
                                                setFilterValues={setFilterValues}
                                        />

                                </Layout>
                </Card>

        )
}
export default ProductWarehouse