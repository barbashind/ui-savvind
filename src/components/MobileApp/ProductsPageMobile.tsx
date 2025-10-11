
// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import NomenclatureDetailsModalMobile from './NomenclaturePageMobile/NomenclatureDetailsModalMobile';
import NomenclatureTableMobile from './NomenclaturePageMobile/NomenclatureTableMobile';
import NomenclatureToolbarMobile from './NomenclaturePageMobile/NomenclatureToolbarMobile';
import { TNomenclatureFilter, TNomenclatureSortFields } from '../../types/nomenclature-types';
import { Sort, useTableSorter } from '../../hooks/useTableSorter';
import { useState } from 'react';


// иконки

// собственные компоненты

// сервисы

const ProductsPageMobile = () => {
        
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

        return (
                        <Layout direction="column">
                                        <NomenclatureToolbarMobile 
                                                setIsEditModalOpen={setIsEditModalOpen} 
                                                setSearchText={setSearchText}
                                                searchText={searchText}
                                                setUpdateFlag={setUpdateFlag}
                                                setFilterValues={setFilterValues}
                                        />
                                        <NomenclatureTableMobile
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
                                        <NomenclatureDetailsModalMobile
                                                isOpen={isEditModalOpen}
                                                setIsOpen={setIsEditModalOpen}
                                                id={id}
                                                setId={setId}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                       
                        </Layout>
                
                
        )
}
export default ProductsPageMobile