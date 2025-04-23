import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from "@consta/uikit/Loader/index";

import { TCheckFilter,  TCheckSortFields,  TSale,  TSaleRow } from "../../types/sales-types.ts";
import { TPageableResponse } from "../../utils/types.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { getSales } from "../../services/SalesService.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { Pagination } from "../global/Pagination.tsx";


interface TSalesTableProductsProps {
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

const SalesTableProducts = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TSalesTableProductsProps) => {

            const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
                const [pagination, setPagination] = useState<IPagination>({
                                totalPages: 0,
                                totalElements: 0,
                                offset: 0,
                                pageSize: getStoredPageSize(),
                        });        
                const [rows, setRows] = useState<TSaleRow[]>([]);
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
                         const sortParam: TSortParam<TSale>[] = columnSort.map(value => ({
                        fieldname: value.column,
                        isAsc: value.sortOrder === 'asc',
                    }));
            
                const filterParam : TCheckFilter = {
                    searchText: filterValues.searchText,
                    dateMin: filterValues.dateMin,
                    dateMax: filterValues.dateMax,
                    customer: filterValues.customer,
                    isUnpaid: true,
                    isBooking: true,
                    isPaid: true
                }
            
                const getData = async () => {
                        try {
                            const serverData: TPageableResponse<TSale> = await getSales({
                                page: currentPage,
                                size: pagination.pageSize,
                                sortParam: sortParam,
                                filterParam: filterParam,
                            });
                            const dataRes: TSaleRow[] = [];
                            const spacerRow: TSaleRow = {} as TSaleRow;
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
 

    const columns: ColumnType<TSaleRow>[] = [
        {
            title: (
                <TableColumnHeader
                    header="ID товара"
                    withoutSort
                />
            ),
            dataIndex: 'saleId',
            key: 'saleId',
            align: 'left',
            width: '150px',
            render: (_value: string, record: TSaleRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="column" style={{minWidth: '150px'}}>
                        <Text size="s" weight="medium">
                            {record.saleId || '-'}
                        </Text>
                        <Text size="xs" weight="medium" view="secondary">
                            {'№ чека: ' + (record.checkId || '-')}
                        </Text>
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Дата продажи"
                    sortOrder={getColumnSortOrder('createdAt')}
                    sortOrderIndex={getColumnSortOrderIndex('createdAt')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('createdAt', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'left',
            width: '200px',
            render: (value: string, record: TSaleRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        <Text size="s" weight="medium" style={{minWidth: '200px'}}>
                            {value || '-'}
                        </Text>
                    </div>
                );
            },
        },
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
                width: '300px',
                render: (value: string, record: TSaleRow) => {
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
                        header="Наименование"
                        withoutSort
                    />
                ),
                dataIndex: 'name',
                key: 'name',
                align: 'left',
                width: '30%',
                render: (value: string, record: TSaleRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Text size="s" weight="medium" style={{minWidth: '150px'}}>
                                {value || '-'}
                            </Text>
                        </div>
                    );
                },
        },

        {
            title: (
                <TableColumnHeader
                    header="Цена продажи"
                    withoutSort
                />
            ),
            dataIndex: 'salePrice',
            key: 'salePrice',
            align: 'left',
            width: '140px',
            render: (value: string, record: TSaleRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        <Text size="s" weight="medium" style={{minWidth: '250px'}}>
                            {value + ' руб'  || '-'}
                        </Text>
                    </div>
                );
            },
    },

    {
        title: (
            <TableColumnHeader
                header="Прибыль"
                withoutSort
            />
        ),
        dataIndex: 'costPrice',
        key: 'costPrice',
        align: 'left',
        width: '140px',
        render: (_value: string, record: TSaleRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <div>
                    <Text size="s" weight="medium" style={{minWidth: '250px'}}>
                        {Number( Number(record.salePrice) - Number(record.costPrice)).toString() + ' руб' || '-'}
                    </Text>
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
        rowKey: (row: { saleId: number }) => row.saleId,

    } as TableProps<TSaleRow>;

        return (
            <Layout flex={1} direction="column" style={{ height: '100%' }}>
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
export default SalesTableProducts;