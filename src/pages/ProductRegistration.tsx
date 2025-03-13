import { useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';

// собственные компоненты
import ProductRegistrationTable from "../components/ProductRegistrationPage/ProductRegistrationTable.tsx"
import ProductRegistrationDetailsModal from "../components/ProductRegistrationPage/ProductRegistrationDetailsModal.tsx"
import { TPurchaseRegFilter, TPurchaseRegSortFields } from "../types/registration-types.ts";
import { Sort, useTableSorter } from "../hooks/useTableSorter.ts";
import { Text } from "@consta/uikit/Text/index";

const ProductRegistration = () => {
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
        const [id, setId] = useState<number | undefined>(undefined)
        const [updateFlag, setUpdateFlag] = useState<boolean>(true);
        const defaultFilter : TPurchaseRegFilter = {
                batchStatus: ['REGISTRATION'],
        }

        const PageSettings: {
                                filterValues: TPurchaseRegFilter | null;
                                currentPage: number;
                                columnSort?: Sort<TPurchaseRegSortFields>;
                                countFilterValues?: number | null;
                        } = {
                                filterValues: defaultFilter,
                                currentPage: 0,
                                columnSort: [{column: 'batchId', sortOrder: 'desc'}]
                        };
                const [count, setCount] = useState<number | null>(0)
                const [currentPage, setCurrentPage] = useState(PageSettings.currentPage);
                const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                        useTableSorter<TPurchaseRegSortFields>(PageSettings.columnSort);
                        
        return (
                <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({m: 'm', p:'m'})} >
                                                        <Layout direction="row">
                                                                <Text size='2xl' weight="semibold" view="brand" >
                                                                        Оприходование товаров
                                                                </Text>
                                                        </Layout>
                                                </Layout>
                                <ProductRegistrationTable
                                         updateFlag={updateFlag}
                                         setUpdateFlag={setUpdateFlag}
                                         currentPage={currentPage}
                                         setCurrentPage={setCurrentPage}
                                         getColumnSortOrder={getColumnSortOrder}
                                         getColumnSortOrderIndex={getColumnSortOrderIndex}
                                         columnSort={columnSort}
                                         onColumnSort={onColumnSort}
                                         filterValues={defaultFilter}
                                         count={count}
                                         setCount={setCount}
                                         setId={setId}
                                         setIsEditModalOpen={setIsEditModalOpen}
                                />
                                <ProductRegistrationDetailsModal
                                        isOpen={isEditModalOpen}
                                        setIsOpen={setIsEditModalOpen}
                                        batchId={id}
                                        setBatchId={setId}
                                        setUpdateFlag={setUpdateFlag}
                                />
                        </Layout>
                </Card>

        )
}
export default ProductRegistration