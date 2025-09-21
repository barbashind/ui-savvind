
// компоненты Consta
import { Sort, useTableSorter } from '../../hooks/useTableSorter';
import { TCheckFilter, TCheckSortFields } from '../../types/sales-types';
import { Layout } from '@consta/uikit/Layout';
import { useState } from 'react';
import SalesTableMobile from './SalesPageMobile/SalesTableMobile';
import SalesToolbarMobile from './SalesPageMobile/SalesToolbarMobile';
import SalesDetailsModalMobile from './SalesPageMobile/SalesDetailsModalMobile';
import ReturnModalMobile from './SalesPageMobile/ReturnModalMobile';
import PurchaseModalMobile from './SalesPageMobile/PurchaseModalMobile';


// иконки

// собственные компоненты

// сервисы

const SalesPageMobile = () => {
               
const [updateFlag, setUpdateFlag] = useState<boolean>(true);
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
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false)
        const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false)
        const [id, setId] = useState<number | undefined>(undefined)

        return (
                        <Layout direction="column" >
                                <SalesToolbarMobile
                                        setIsEditModalOpen={setIsEditModalOpen} 
                                        setUpdateFlag={setUpdateFlag}
                                        setFilterValues={setFilterValues}
                                        filterValues={filterValues}
                                        setIsReturnModalOpen={setIsReturnModalOpen}
                                        setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                                />
                                <SalesTableMobile 
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
                                <SalesDetailsModalMobile
                                        isOpen={isEditModalOpen}
                                        setIsOpen={setIsEditModalOpen}
                                        checkId={id}
                                        setCheckId={setId}
                                        setUpdateFlag={setUpdateFlag}
                                />
                                <PurchaseModalMobile
                                        isOpen={isPurchaseModalOpen}
                                        setIsOpen={setIsPurchaseModalOpen}
                                />
                               
                                <ReturnModalMobile
                                        isOpen={isReturnModalOpen}
                                        setIsOpen={setIsReturnModalOpen}
                                        setUpdateFlag={setUpdateFlag}
                                />

                        </Layout>
        )
}
export default SalesPageMobile