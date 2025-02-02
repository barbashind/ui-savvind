import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";

import { IconCheck } from '@consta/icons/IconCheck';

// собственные компоненты
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { TPurchaseItemFilter, TPurchaseItemRow, TPurchaseItemSortFields } from "../../types/purchase-types.ts";
import { TPageableResponse } from "../../utils/types.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { getItemsPurchase } from "../../services/PurchaseService.ts";
import { Sort, useTableSorter } from "../../hooks/useTableSorter.ts";
import { Pagination } from "../global/Pagination.tsx";
import { Loader } from "@consta/uikit/Loader/index";
import { TPurchaseItem } from "../../types/product-purchase-types.ts";

interface TProductWarehouseItemsTableProps {
                updateFlag: boolean;
                setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
                currentPage: number;
                setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
                filterValues: TPurchaseItemFilter;
                count: number | null;
                setCount: React.Dispatch<React.SetStateAction<number | null>>;
                PageSettings: {
                    filterValues: TPurchaseItemFilter | null;
                    currentPage: number;
                    columnSort?: Sort<TPurchaseItemSortFields>;
                    countFilterValues?: number | null;
                }
    }

const ProductWarehouseItemsTable = ({updateFlag, setUpdateFlag, currentPage, setCurrentPage,  filterValues, count, setCount, PageSettings} : TProductWarehouseItemsTableProps) => {
const { getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort } =
                useTableSorter<TPurchaseItemSortFields>(PageSettings.columnSort);
const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
        const [pagination, setPagination] = useState<IPagination>({
                        totalPages: 0,
                        totalElements: 0,
                        offset: 0,
                        pageSize: getStoredPageSize(),
                });        
        const [rows, setRows] = useState<TPurchaseItemRow[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
    
       
        useEffect(() => {
                setStoredPageSize(pagination.pageSize);
            }, [pagination.pageSize, setStoredPageSize]);
            useEffect(() => {
                setUpdateFlag(true);
            }, [columnSort, setUpdateFlag]);
    
    useEffect(() => {
        if (updateFlag) {
                setIsLoading(true);
                 const sortParam: TSortParam<TPurchaseItem>[] = columnSort.map(value => ({
                fieldname: value.column,
                isAsc: value.sortOrder === 'asc',
            }));
    
        const filterParam : TPurchaseItemFilter = {
            searchText: filterValues.searchText,
            warehouse: filterValues.warehouse,
        }
    
        const getData = async () => {
                try {
                    const serverData: TPageableResponse<TPurchaseItem> = await getItemsPurchase({
                        page: currentPage,
                        size: pagination.pageSize,
                        sortParam: sortParam,
                        filterParam: filterParam,
                    });
                    const dataRes: TPurchaseItemRow[] = [];
                    const spacerRow: TPurchaseItemRow = {} as TPurchaseItemRow;
                    spacerRow.spacer = true;
                    serverData.content.forEach((item, index) => {
                            dataRes.push(
                            {
                                ...item,
                                spacer: false,
                                rowNumber: (serverData.pageable.pageNumber || 0) + index + 1,
                            },
                            {
                                ...spacerRow,
                                rowNumber: (serverData.pageable.pageNumber || 0) + index + 1,
                            }
                        );
                    });
    
                    setRows(
                        dataRes.map((item) => {
                            return item;
                        })
                    );
                    setPagination({
                        totalPages: serverData.totalPages || 0,
                        totalElements: serverData.totalElements || 0,
                        offset: serverData.pageable.pageNumber || 0,
                        pageSize: pagination.pageSize,
                    });
                    
                    setCount(serverData.totalElements);
    
                } catch (e: unknown) {
                    if (e instanceof ErrorResponse || e instanceof Error) {
                        console.log(e);
                    }
                }
                setIsLoading(false);
                setUpdateFlag(false);
            };
            void getData();
        }
    }, [updateFlag, setUpdateFlag, filterValues, columnSort, currentPage, pagination.pageSize, setCount]);
 

    const columns: ColumnType<TPurchaseItemRow>[] = [
        {
            title: (
                <TableColumnHeader
                    header="ID партии товара"
                    sortOrder={getColumnSortOrder('itemBatchId')}
                    sortOrderIndex={getColumnSortOrderIndex('itemBatchId')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('itemBatchId', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'itemBatchId',
            key: 'itemBatchId',
            align: 'left',
            width: '150px',
            render: (value: string, record: TPurchaseItemRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        <Text size="s" weight="medium" style={{ minWidth: '150px' }}>
                            {value || '-'}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Наименование товара"
                    withoutSort
                />
            ),
            dataIndex: 'name',
            key: 'name',
            align: 'left',
            width: '100%',
            render: (value: string, record: TPurchaseItemRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ minWidth: '200px' }}>
                        <Text size="s" weight="medium">
                            {value}
                        </Text>
                       
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Остаток"
                    sortOrder={getColumnSortOrder('remainder')}
                    sortOrderIndex={getColumnSortOrderIndex('remainder')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('remainder', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'remainder',
            key: 'remainder',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseItemRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ minWidth: '200px' }}>
                        <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                            {value}
                        </Text>
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Серийный номер"
                    withoutSort
                />
            ),
            dataIndex: 'hasSerialNumber',
            key: 'hasSerialNumber',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseItemRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ minWidth: '200px' }}>
                        {value ? (<IconCheck/>) : <>-</>}
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Склад"
                    withoutSort
                />
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseItemRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ minWidth: '200px' }}>
                        <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                            {value}
                        </Text>
                    </Layout>
                );
            },
        },
        RCTable.EXPAND_COLUMN,
    ];

    const tableProps = {
        ...rcTableAdapter({
            borderBetweenColumns: false,
            borderBetweenRows: true,
            verticalAlign: 'center',
        }),
        rowKey: (row: { itemBatchId: number }) => row.itemBatchId,

    } as TableProps<TPurchaseItemRow>;

        return (
            <Layout flex={1} direction="column" style={{ height: '100%' }}>
            <Layout flex={1} direction="column" style={{
                    minHeight: 'calc(90vh - 155px)',
                    overflow: 'auto',
                    display: 'flex',
                    width: '100%',
                    flex: '1 1 auto',
                    }}>
                {!isLoading ? (
                    <RCTable
                        {...tableProps}
                        columns={columns}
                        data={rows} // Убираем проверку !isLoading, так как данные уже загружены
                        onRow={record => ({
                            className: record.spacer ? 'data-is-spacer' : `data-is-row`,
                        })}
                        emptyText={() =>
                            !isLoading && (
                                <Layout
                                    direction="column"
                                    className={cnMixSpace({ pT: 'm', pB: 'xs' })}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {count === 0 && (
                                        <Text
                                            size="m"
                                            className={cnMixSpace({ mT: 's' })}
                                            view="secondary"
                                            align="center"
                                            weight="regular"
                                            lineHeight="xs"
                                        >
                                            Добавьте первую запись или очистите поиск
                                        </Text>
                                    )}
                                </Layout>
                            )
                        }
                    />
                ) : (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Loader />
                    </div>
                )}
            </Layout>

            {/* Пагинация, закреплена внизу */}
                <Pagination
                    items={pagination.totalPages === 0 ? 1 : pagination.totalPages}
                    value={currentPage}
                    pageSize={pagination.pageSize}
                    onChange={(e) => {
                        setCurrentPage(e);
                        setUpdateFlag(true);
                    }}
                    onChangePageSize={(pageSize) => {
                        setCurrentPage(0);
                        setPagination((prev) => ({
                            ...prev,
                            pageSize,
                        }));
                        setUpdateFlag(true);
                    }}
                />
    </Layout>
        )
}
export default ProductWarehouseItemsTable