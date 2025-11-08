import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

import { Loader } from "@consta/uikit/Loader/index";
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";

// собственные компоненты
import { TPageableResponse } from "../../utils/types.ts";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { Pagination } from "../global/Pagination.tsx";
import { getHistory } from "../../services/HistoryService.ts";
import { THistory, THistoryFilter, THistoryRow, THistorySortFields } from "../../types/history-types.ts";
import { TAccount } from "../../types/settings-types.ts";
import { getAccounts } from "../../services/SettingsService.ts";
import { formatDate } from "../../utils/formatDate.ts";


interface THistoryTableProps {
        updateFlag: boolean;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        currentPage: number;
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
        getColumnSortOrder: GetColumnSortOrder<THistorySortFields>;
        getColumnSortOrderIndex: GetColumnSortOrderIndex<THistorySortFields>;
        columnSort: Sort<THistorySortFields>;
        onColumnSort: OnColumnSort<THistorySortFields>;
        filterValues: THistoryFilter;
        count: number | null;
        setCount: React.Dispatch<React.SetStateAction<number | null>>;
    }

const HistoryTable = ({updateFlag, setUpdateFlag, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort, filterValues, count, setCount} : THistoryTableProps) => {
        const [accounts, setAccounts] = useState<TAccount[]>([]);
        
        const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
                const [pagination, setPagination] = useState<IPagination>({
                                totalPages: 0,
                                totalElements: 0,
                                offset: 0,
                                pageSize: getStoredPageSize(),
                        });        
                const [rows, setRows] = useState<THistoryRow[]>([]);
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
                         const sortParam: TSortParam<THistory>[] = columnSort.map(value => ({
                        fieldname: value.column,
                        isAsc: value.sortOrder === 'asc',
                    }));
            
                const filterParam : THistoryFilter = {
                    searchText: filterValues.searchText,
                    table_name: filterValues.table_name,
                    onlyReturn: filterValues.onlyReturn,
                }
            
                const getData = async () => {
                        try {
                            const serverData: TPageableResponse<THistory> = await getHistory({
                                page: currentPage,
                                size: pagination.pageSize,
                                sortParam: sortParam,
                                filterParam: filterParam,
                            });
                            const dataRes: THistoryRow[] = [];
                            const spacerRow: THistoryRow = {} as THistoryRow;
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
                            const getAccountsData = async () => {
                                    await getAccounts((resp) => {
                                            setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, currency: item.currency})))
                                            
                                    })
                            }
                            void getAccountsData()
            
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
 

    const columns: ColumnType<THistoryRow>[] = [
        
        {
            title: (
                <TableColumnHeader
                    header={filterValues.table_name === 'accounts' ? "№ изменения" : 'Дата изменения'}
                    sortOrder={getColumnSortOrder('id')}
                    sortOrderIndex={getColumnSortOrderIndex('id')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('id', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'id',
            key: 'id',
            align: 'left',
            width: '140px',
            render: (value: string, record: THistoryRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="column">
                        <Text size="s" weight="medium" style={{minWidth: '140px'}}>
                            {filterValues.table_name === 'accounts' ?  (value) : (formatDate(record.action_time)) || '-'}
                        </Text>
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header={filterValues.table_name === 'accounts' ? "Счет" : 'Серийный номер'}
                    withoutSort
                />
            ),
            dataIndex: 'row_id',
            key: 'row_id',
            align: 'left',
            width: '140px',
            render: (value: string, record: THistoryRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="column">
                        <Text size="s" weight="medium" style={{minWidth: '140px'}}>
                            {filterValues.table_name === 'accounts' ? (accounts ? accounts?.find(el => (el.accountId === Number(value)))?.name : '-') : record.serialNumber}
                        </Text>
                        {filterValues.table_name === 'items_batch' && (
                           <Text size="s" weight="medium" style={{minWidth: '140px'}}>
                            {record.row_id}
                        </Text> 
                        )}
                    </Layout>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Изменение"
                    withoutSort
                />
            ),
            dataIndex: 'new_value',
            key: 'new_value',
            align: 'left',
            width: '140px',
            render: (value: string, record: THistoryRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="column">
                        <Text size="s" weight="medium" style={{minWidth: '140px'}}>
                            {filterValues.table_name === 'accounts' ? ((Number(value) - Number(record.old_value)) || '-') : ((record.new_value === '0' || (Number(record.remainder_old) < Number(record.remainder_new) )) ? ('Возврат') : ('Продажа/ списание') )}
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
        rowKey: (row: { id: number }) => row.id,

    } as TableProps<THistoryRow>;

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
                            onClick: () => { },
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
export default HistoryTable