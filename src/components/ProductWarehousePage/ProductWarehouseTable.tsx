import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";

// собственные компоненты
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { TPurchase, TPurchaseFilter, TPurchaseRow, TPurchaseSortFields } from "../../types/purchase-types.ts";
import { TPageableResponse } from "../../utils/types.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { getPurchases } from "../../services/PurchaseService.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { Pagination } from "../global/Pagination.tsx";
import { Loader } from "@consta/uikit/Loader/index";

interface TProductWarehouseTableProps {
                updateFlag: boolean;
                setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
                currentPage: number;
                setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
                getColumnSortOrder: GetColumnSortOrder<TPurchaseSortFields>;
                getColumnSortOrderIndex: GetColumnSortOrderIndex<TPurchaseSortFields>;
                columnSort: Sort<TPurchaseSortFields>;
                onColumnSort: OnColumnSort<TPurchaseSortFields>;
                setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
                filterValues: TPurchaseFilter;
                count: number | null;
                setCount: React.Dispatch<React.SetStateAction<number | null>>;
                setId: React.Dispatch<React.SetStateAction<number | undefined>>;
    }

const ProductWarehouseTable = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TProductWarehouseTableProps) => {

const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
        const [pagination, setPagination] = useState<IPagination>({
                        totalPages: 0,
                        totalElements: 0,
                        offset: 0,
                        pageSize: getStoredPageSize(),
                });        
        const [rows, setRows] = useState<TPurchaseRow[]>([]);
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
                 const sortParam: TSortParam<TPurchase>[] = columnSort.map(value => ({
                fieldname: value.column,
                isAsc: value.sortOrder === 'asc',
            }));
    
        const filterParam : TPurchaseFilter = {
            batchStatus: ['COMPLETED'],
            sumMin: filterValues.sumMin,
            sumMax: filterValues.sumMax,
            dateMin: filterValues.dateMin,
            dateMax: filterValues.dateMax,
            batchNumber: filterValues.batchNumber
        }
    
        const getData = async () => {
                try {
                    const serverData: TPageableResponse<TPurchase> = await getPurchases({
                        page: currentPage,
                        size: pagination.pageSize,
                        sortParam: sortParam,
                        filterParam: filterParam,
                    });
                    const dataRes: TPurchaseRow[] = [];
                    const spacerRow: TPurchaseRow = {} as TPurchaseRow;
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
 

    const columns: ColumnType<TPurchaseRow>[] = [
        {
            title: (
                <TableColumnHeader
                    header="Номер партии"
                    sortOrder={getColumnSortOrder('batchNumber')}
                    sortOrderIndex={getColumnSortOrderIndex('batchNumber')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('batchNumber', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            align: 'left',
            width: '150px',
            render: (value: string, record: TPurchaseRow) => {
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
                    header="Дата получения"
                    withoutSort
                />
            ),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseRow) => {
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
                    header="Комментарий"
                    withoutSort
                />
            ),
            dataIndex: 'comment',
            key: 'comment',
            align: 'left',
            width: '100%',
            render: (value: string, record: TPurchaseRow) => {
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
        rowKey: (row: { batchId: number }) => row.batchId,

    } as TableProps<TPurchaseRow>;

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
                            onClick: () => {
                                if (!record.spacer) {
                                    setIsEditModalOpen(true);
                                    setId(record.batchId);
                                } 
                            },
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
export default ProductWarehouseTable