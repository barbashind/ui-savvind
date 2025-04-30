import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';
import classNames from "classnames";

// компоненты Consta
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from "@consta/uikit/Loader/index";

// иконки

// собственные компоненты
import { Pagination } from "../global/Pagination.tsx";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { TPageableResponse } from "../../utils/types.ts";


// сервисы
import { TProdData, TProdDataFilter, TProdDataRow, TProdDataSortFields } from "../../types/analytic-types.ts";
import { getAnalyticProd } from "../../services/SalesService.ts";
import { formatNumber } from "../../utils/formatNumber.ts";

interface AnalyticsProductsTableTableProps {
        updateFlag: boolean;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        currentPage: number;
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
        getColumnSortOrder: GetColumnSortOrder<TProdDataSortFields>;
        getColumnSortOrderIndex: GetColumnSortOrderIndex<TProdDataSortFields>;
        columnSort: Sort<TProdDataSortFields>;
        onColumnSort: OnColumnSort<TProdDataSortFields>;
        filterValues: TProdDataFilter;
        count: number | null;
        setCount: React.Dispatch<React.SetStateAction<number | null>>;
        isWithPartner: boolean;
    }

const AnalyticsProductsTable = ({
    updateFlag,
        setUpdateFlag, 
        currentPage,
        setCurrentPage,
        getColumnSortOrder,
        getColumnSortOrderIndex,
        columnSort,
        onColumnSort,
        filterValues,
        count,
        setCount,
        isWithPartner
} : AnalyticsProductsTableTableProps) => {

    const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
    const [pagination, setPagination] = useState<IPagination>({
                    totalPages: 0,
                    totalElements: 0,
                    offset: 0,
                    pageSize: getStoredPageSize(),
            });        
    const [rows, setRows] = useState<TProdDataRow[]>([]);
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
             const sortParam: TSortParam<TProdData>[] = columnSort.map(value => ({
            fieldname: value.column,
            isAsc: value.sortOrder === 'asc',
        }));
    const startDate = filterValues.startDate ?? null;
    const endDate = filterValues.endDate ?? null;
    const filterParam : TProdDataFilter = {
        startDate,
        endDate
    }

    const getData = async () => {
            try {
                const serverData: TPageableResponse<TProdData> = await getAnalyticProd({
                    page: currentPage,
                    size: pagination.pageSize,
                    sortParam: sortParam,
                    filterParam: filterParam,
                });
                const dataRes: TProdDataRow[] = [];
                const spacerRow: TProdDataRow = {} as TProdDataRow;
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



const columns: ColumnType<TProdDataRow>[] = [
    {
        title: (
            <TableColumnHeader
                header="Позиция"
                withoutSort
            />
        ),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '200px',
        render: (value: string, record: TProdDataRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <div>
                    <Text size="s" weight="medium" style={{ minWidth: '200px', maxWidth: '200px'  }}>
                        {value || '-'}
                    </Text>
                </div>
            );
        },
    },
    {
        title: (
            <TableColumnHeader
                header="Количество продано"
                sortOrder={getColumnSortOrder('quantAll')}
                sortOrderIndex={getColumnSortOrderIndex('quantAll')}
                onSort={(sortOrder, isAdd) => {
                    onColumnSort('quantAll', sortOrder, isAdd);
                }}
            />
        ),
        dataIndex: 'quantAll',
        key: 'quantAll',
        align: 'left',
        width: '200px',
        render: (value: number, record: TProdDataRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="column" style={{ minWidth: '300px', maxWidth: '300px'  }}>
                    {!isWithPartner &&
                                <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                                        {formatNumber(value?.toFixed(2)) + ' ₽'}
                                </Text>
                }
                    {isWithPartner &&
                        <Layout direction="column">
                                <Text style={{border: '1px solid var(--color-typo-success)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Мои: ' + record.quantMy}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-link)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Партнеров: ' + record.quantPartner}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-secondary)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Суммарно: ' + formatNumber(value?.toFixed(2))}
                                </Text>
                        </Layout>
                        }
                    
                </Layout>
            );
        },
    },
    {
        title: (
            <TableColumnHeader
                header="Выручка"
                sortOrder={getColumnSortOrder('revenueAll')}
                sortOrderIndex={getColumnSortOrderIndex('revenueAll')}
                onSort={(sortOrder, isAdd) => {
                    onColumnSort('revenueAll', sortOrder, isAdd);
                }}
            />
        ),
        dataIndex: 'revenueAll',
        key: 'revenueAll',
        align: 'left',
        width: '400px',
        render: (value: number, record: TProdDataRow) => {
            return record.spacer ? (
                <></>
            ) : (
                    
                <Layout direction="column" style={{ minWidth: '400px', maxWidth: '400px'  }}>
                        {!isWithPartner &&
                                <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                                        {formatNumber(value?.toFixed(2)) + ' ₽'}
                                </Text>
                        }
                        {isWithPartner &&
                        <Layout direction="column" style={{ minWidth: '400px', maxWidth: '400px', flexWrap: 'wrap'}}>
                                <Text style={{border: '1px solid var(--color-typo-success)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Мои: ' + formatNumber(record.revenueMy?.toFixed(2)) + ' ₽'}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-link)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Партнеров: ' + formatNumber(record.revenuePartner?.toFixed(2)) + ' ₽'}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-secondary)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Суммарно: ' + formatNumber(value?.toFixed(2)) + ' ₽'}
                                </Text>
                        </Layout>
                        }
                    
                </Layout>
            );
        },
    },
    {
        title: (
            <TableColumnHeader
                header="Маржа"
                sortOrder={getColumnSortOrder('margAll')}
                sortOrderIndex={getColumnSortOrderIndex('margAll')}
                onSort={(sortOrder, isAdd) => {
                    onColumnSort('margAll', sortOrder, isAdd);
                }}
            />
        ),
        dataIndex: 'margAll',
        key: 'margAll',
        align: 'left',
        width: '400px',
        render: (value: number, record: TProdDataRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="column" style={{ minWidth: '400px', maxWidth: '400px'  }}>
                        {!isWithPartner &&
                                <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                                        {formatNumber(value?.toFixed(2)) + ' ₽'}
                                </Text>
                        }
                        {isWithPartner &&
                        <Layout direction="column" style={{ minWidth: '400px', maxWidth: '400px', flexWrap: 'wrap'}}>
                                <Text style={{border: '1px solid var(--color-typo-success)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Мои: ' + formatNumber(record.margMy?.toFixed(2)) + ' ₽'}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-link)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Партнеров: ' + formatNumber(record.margPartner?.toFixed(2)) + ' ₽'}
                                </Text>
                                <Text style={{border: '1px solid var(--color-typo-secondary)', borderRadius:'4px', padding: '4px'}} size="xs" weight="medium" className={cnMixSpace({mL:'2xs', mT: '3xs'})}>
                                        {'Суммарно: ' + formatNumber(value?.toFixed(2)) + ' ₽'}
                                </Text>
                        </Layout>
                        }
                    
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
    rowKey: (row: { name: string }) => row.name,

} as TableProps<TProdDataRow>;

tableProps.className = (classNames(
   tableProps.className,
//    classes.table,
    cnMixSpace({ pH: 'xs' }) 
));

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
export default AnalyticsProductsTable;