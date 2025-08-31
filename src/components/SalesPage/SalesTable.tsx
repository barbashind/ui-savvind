import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

import { Loader } from "@consta/uikit/Loader/index";
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Badge } from '@consta/uikit/Badge';

// собственные компоненты
import { TCheck, TCheckFilter, TCheckRow, TCheckSortFields } from "../../types/sales-types.ts";
import { TPageableResponse } from "../../utils/types.ts";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { getCheckes } from "../../services/SalesService.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { Pagination } from "../global/Pagination.tsx";
import { formatNumber } from "../../utils/formatNumber.ts";
import { formatDate } from "../../utils/formatDate.ts";


interface TSalesTableProps {
        updateFlag: boolean;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        currentPage: number;
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
        getColumnSortOrder: GetColumnSortOrder<TCheckSortFields>;
        getColumnSortOrderIndex: GetColumnSortOrderIndex<TCheckSortFields>;
        columnSort: Sort<TCheckSortFields>;
        onColumnSort: OnColumnSort<TCheckSortFields>;
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TCheckFilter;
        count: number | null;
        setCount: React.Dispatch<React.SetStateAction<number | null>>;
        setId: React.Dispatch<React.SetStateAction<number | undefined>>;
    }

const SalesTable = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TSalesTableProps) => {

        const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
                const [pagination, setPagination] = useState<IPagination>({
                                totalPages: 0,
                                totalElements: 0,
                                offset: 0,
                                pageSize: getStoredPageSize(),
                        });        
                const [rows, setRows] = useState<TCheckRow[]>([]);
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
                         const sortParam: TSortParam<TCheck>[] = columnSort.map(value => ({
                        fieldname: value.column,
                        isAsc: value.sortOrder === 'asc',
                    }));
            
                const filterParam : TCheckFilter = {
                    searchText: filterValues.searchText,
                    dateMin: filterValues.dateMin,
                    dateMax: filterValues.dateMax,
                    customer: filterValues.customer,
                    isBooking: filterValues.isBooking,
                    isUnpaid: filterValues.isUnpaid,
                    isPaid: filterValues.isPaid,
                }
            
                const getData = async () => {
                        try {
                            const serverData: TPageableResponse<TCheck> = await getCheckes({
                                page: currentPage,
                                size: pagination.pageSize,
                                sortParam: sortParam,
                                filterParam: filterParam,
                            });
                            const dataRes: TCheckRow[] = [];
                            const spacerRow: TCheckRow = {} as TCheckRow;
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
 

    const columns: ColumnType<TCheckRow>[] = [
        
        {
            title: (
                <TableColumnHeader
                    header="№ чека"
                    sortOrder={getColumnSortOrder('checkId')}
                    sortOrderIndex={getColumnSortOrderIndex('checkId')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('checkId', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'checkId',
            key: 'checkId',
            align: 'left',
            width: '140px',
            render: (value: string, record: TCheckRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="column">
                        <Text size="s" weight="medium" style={{minWidth: '140px'}}>
                            {value || '-'}
                        </Text>
                        <Text size="xs" weight="medium" view="secondary" style={{minWidth: '140px'}}>
                            {formatDate(record.createdAt)  || '-'}
                        </Text>
                    </Layout>
                );
            },
        },
        // {
        //     title: (
        //         <TableColumnHeader
        //             header="Дата продажи"
        //             sortOrder={getColumnSortOrder('createdAt')}
        //             sortOrderIndex={getColumnSortOrderIndex('createdAt')}
        //             onSort={(sortOrder, isAdd) => {
        //                 onColumnSort('createdAt', sortOrder, isAdd);
        //             }}
        //         />
        //     ),
        //     dataIndex: 'createdAt',
        //     key: 'createdAt',
        //     align: 'left',
        //     width: '140px',
        //     render: (value: string, record: TCheckRow) => {
        //         return record.spacer ? (
        //             <></>
        //         ) : (
        //             <div>
        //                 <Text size="s" weight="medium" style={{minWidth: '140px'}}>
        //                     {value || '-'}
        //                 </Text>
        //             </div>
        //         );
        //     },
        // },
        {
                title: (
                    <TableColumnHeader
                        header="Клиент"
                        withoutSort
                    />
                ),
                dataIndex: 'customer',
                key: 'customer',
                align: 'left',
                width: '100%',
                render: (value: string, record: TCheckRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Text size="s" weight="medium" style={{minWidth: '250px'}}>
                                {value || '-'}
                            </Text>
                        </div>
                    );
                },
        },
        {
                title: (
                    <TableColumnHeader
                        header="Продавец"
                        withoutSort
                    />
                ),
                dataIndex: 'seller',
                key: 'seller',
                align: 'left',
                width: '100px',
                render: (value: string, record: TCheckRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Text size="s" weight="medium" style={{minWidth: '250px'}}>
                                {value || '-'}
                            </Text>
                        </div>
                    );
                },
        },
        {
                title: (
                    <TableColumnHeader
                        header="Курьер"
                        withoutSort
                    />
                ),
                dataIndex: 'courier',
                key: 'courier',
                align: 'left',
                width: '150px',
                render: (value: string, record: TCheckRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Text size="s" weight="medium" style={{minWidth: '250px'}}>
                                {value || '-'}
                            </Text>
                        </div>
                    );
                },
        },
        {
                title: (
                    <TableColumnHeader
                        header="Сумма продажи"
                        sortOrder={getColumnSortOrder('summ')}
                        sortOrderIndex={getColumnSortOrderIndex('summ')}
                        onSort={(sortOrder, isAdd) => {
                        onColumnSort('summ', sortOrder, isAdd);
                    }}
                    />
                ),
                dataIndex: 'summ',
                key: 'summ',
                align: 'left',
                width: '240px',
                render: (value: string, record: TCheckRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Text size="s" weight="medium" style={{minWidth: '150px'}}>
                                {formatNumber(value || '0') + ' руб' }
                            </Text>
                        </div>
                    );
                },
        },
        {
            title: (
                <TableColumnHeader
                    header="Статус"
                    withoutSort
                />
            ),
            dataIndex: 'checkId',
            key: 'checkId',
            align: 'left',
            width: '140px',
            render: (_value: string, record: TCheckRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        {record.isBooking ? 
                            (<Badge label="Бронь" status="warning"/>) :
                        record.isUnpaid ? 
                            (<Badge label="Не оплачен" status="alert" />) 
                        :
                            (<Badge label="Оплачен" status="success"/>)
                        }
                        
                    </div>
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
        rowKey: (row: { checkId: number }) => row.checkId,

    } as TableProps<TCheckRow>;

        return (
            <Layout flex={1} direction="column" style={{ height: '100%', width: '100%' }}>
            <Layout flex={1} direction="column" style={{
                    minHeight: 'calc(90vh - 203px)',
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
                                    setId(record.checkId);
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
export default SalesTable