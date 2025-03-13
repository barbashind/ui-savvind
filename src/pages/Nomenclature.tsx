import { useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';

// собственные компоненты
import NomenclatureToolbar from "../components/NomenclaturePage/NomenclatureToolbar.tsx"
import NomenclatureTable from "../components/NomenclaturePage/NomenclatureTable.tsx"
import NomenclatureFilter from "../components/NomenclaturePage/NomenclatureFilter.tsx"
import { TNomenclatureFilter, TNomenclatureSortFields } from "../types/nomenclature-types.ts"
import NomenclatureDetailsModal from "../components/NomenclaturePage/NomenclatureDetailsModal.tsx"
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts"

const Nomenclature = () => {
        const defaultFilter : TNomenclatureFilter = {
                remainsMin: null,
                remainsMax: null,
                remainsSumMin: null,
                remainsSumMax: null,
                productType: undefined,
                brand: null,
                altName: null,
                productColor: null,
                productPrice: null,
                productModel: null,
                productCountry: null,
                searchText: null
        }

        const PageSettings: {
                        filterValues: TNomenclatureFilter | null;
                        currentPage: number;
                        columnSort?: Sort<TNomenclatureSortFields>;
                        countFilterValues?: number | null;
                } = {
                        filterValues: defaultFilter,
                        currentPage: 0,
                        columnSort: [{column: 'createdAt', sortOrder: 'desc'}]
                };
        const [count, setCount] = useState<number | null>(0)
        const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
        const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                useTableSorter<TNomenclatureSortFields>(PageSettings.columnSort);
        
        const [filterValues, setFilterValues] = useState<TNomenclatureFilter>(
                PageSettings.filterValues ?? defaultFilter
        );
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [id, setId] = useState<number | undefined>(undefined)
        const [updateFlag, setUpdateFlag] = useState<boolean>(true);
        const [searchText, setSearchText] = useState<string | null> (null);        
        const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
        
        return (
                <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <NomenclatureToolbar 
                                                setIsEditModalOpen={setIsEditModalOpen} 
                                                setSearchText={setSearchText}
                                                searchText={searchText}
                                                setUpdateFlag={setUpdateFlag}
                                                setIsFilterModalOpen={setIsFilterModalOpen}
                                                setFilterValues={setFilterValues}
                                        />
                                        <NomenclatureTable 
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
                                        <NomenclatureDetailsModal
                                                isOpen={isEditModalOpen}
                                                setIsOpen={setIsEditModalOpen}
                                                id={id}
                                                setId={setId}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                        <NomenclatureFilter
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
export default Nomenclature