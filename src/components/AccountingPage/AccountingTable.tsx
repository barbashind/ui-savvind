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
import { IconTrash } from '@consta/icons/IconTrash';

// собственные компоненты
import { Pagination } from "../global/Pagination.tsx";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { TAccounting, TAccountingFilter, TAccountingRow, TAccountingSortFields } from "../../types/accounting-types.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { TPageableResponse } from "../../utils/types.ts";


// сервисы
import { deleteAccounting, getAccountings } from "../../services/AccountingService.ts";
import { Button } from "@consta/uikit/Button/index";
import { formatNumber } from "../../utils/formatNumber.ts";

interface TProductAccountingTableProps {
        updateFlag: boolean;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        currentPage: number;
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
        getColumnSortOrder: GetColumnSortOrder<TAccountingSortFields>;
        getColumnSortOrderIndex: GetColumnSortOrderIndex<TAccountingSortFields>;
        columnSort: Sort<TAccountingSortFields>;
        onColumnSort: OnColumnSort<TAccountingSortFields>;
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TAccountingFilter;
        count: number | null;
        setCount: React.Dispatch<React.SetStateAction<number | null>>;
        setId: React.Dispatch<React.SetStateAction<number | undefined>>;
    }

const AccountingTable = ({
    updateFlag,
        setUpdateFlag, 
        currentPage,
        setCurrentPage,
        getColumnSortOrder,
        getColumnSortOrderIndex,
        columnSort,
        onColumnSort,
        setIsEditModalOpen,
        filterValues,
        count,
        setCount,
        setId,
} : TProductAccountingTableProps) => {

    const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
    const [pagination, setPagination] = useState<IPagination>({
                    totalPages: 0,
                    totalElements: 0,
                    offset: 0,
                    pageSize: getStoredPageSize(),
            });        
    const [rows, setRows] = useState<TAccountingRow[]>([]);
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
             const sortParam: TSortParam<TAccounting>[] = columnSort.map(value => ({
            fieldname: value.column,
            isAsc: value.sortOrder === 'asc',
        }));
    const filterParam : TAccountingFilter = {
        searchText: filterValues.searchText,
        accountFrom: filterValues.accountFrom,
        accountTo: filterValues.accountTo,
        valueFrom: filterValues.valueFrom,
        valueTo: filterValues.valueTo,
        dateFrom: filterValues.dateFrom,
        dateTo: filterValues.dateTo,
    }

    const getData = async () => {
            try {
                const serverData: TPageableResponse<TAccounting> = await getAccountings({
                    page: currentPage,
                    size: pagination.pageSize,
                    sortParam: sortParam,
                    filterParam: filterParam,
                });
                const dataRes: TAccountingRow[] = [];
                const spacerRow: TAccountingRow = {} as TAccountingRow;
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


const deleteAccountingData = async (id: number | undefined) => {
    await deleteAccounting(id).then(()=>{
        setUpdateFlag(true);
    })
}

const columns: ColumnType<TAccountingRow>[] = [
    {
        title: (
            <TableColumnHeader
                header="ID операции"
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
        width: '150px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <div>
                    <Text size="s" weight="medium" style={{ minWidth: '150px', maxWidth: '150px'  }}>
                        {value || '-'}
                    </Text>
                </div>
            );
        },
    },
    {
        title: (
            <TableColumnHeader
                header="Дата создания"
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
        width: '150px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
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
                header="Счет списания"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'accountFrom',
        key: 'accountFrom',
        align: 'left',
        width: '150px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                    
                <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
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
                header="Счет пополнения"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'accountTo',
        key: 'accountTo',
        align: 'left',
        width: '150px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
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
                header="Сумма"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'value',
        key: 'value',
        align: 'left',
        width: '110px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '110px', maxWidth: '110px'  }}>
                    <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                        {formatNumber(value) + ' ' }
                    </Text>
                    <Text size="s" weight="regular" view="secondary" className={cnMixSpace({mL:'2xs'})}>
                        { (record.currency ?? 'RUB')}
                    </Text>
                </Layout> 
            );
        },
    },
    {
        title: (
            <TableColumnHeader
                header="Обоснование"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'justification',
        key: 'justification',
        align: 'left',
        width: '100%',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ width: '100%' }}>
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
                header="Категория"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'category',
        key: 'category',
        align: 'left',
        width: '110px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '110px', maxWidth: '110px'  }}>
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
                header="Создал"
                withoutSort={true}
                align="left"
            />
        ),
        dataIndex: 'author',
        key: 'author',
        align: 'left',
        width: '110px',
        render: (value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '110px', maxWidth: '110px'  }}>
                    <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                        {value}
                    </Text>
                </Layout> 
            );
        },
    },
    // {
    //     title: (
    //         <TableColumnHeader
    //             header="Форма транзакции"
    //             withoutSort={true}
    //             align="left"
    //         />
    //     ),
    //     dataIndex: 'justification',
    //     key: 'justification',
    //     align: 'left',
    //     width: '150px',
    //     render: (value: string, record: TAccountingRow) => {
    //         return record.spacer ? (
    //             <></>
    //         ) : (
    //                 (value === 'replenishment') ? (
    //                     <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
    //                         <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
    //                             Пополнение
    //                         </Text>
    //                     </Layout>   
    //                 ) : (value === 'deduction') ? (

    //                     <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
    //                         <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
    //                             Списание
    //                         </Text>
    //                     </Layout> 
    //                 ) : (
    //                     <Layout direction="row" style={{ minWidth: '150px', maxWidth: '150px'  }}>
    //                         <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
    //                             Внутренний перевод
    //                         </Text>
    //                     </Layout>
    //                 )
    //         );
    //     },
    // },
    // {
    //     title: (
    //         <TableColumnHeader
    //             header="Черновик"
    //             sortOrder={getColumnSortOrder('isDraft')}
    //             sortOrderIndex={getColumnSortOrderIndex('isDraft')}
    //             onSort={(sortOrder, isAdd) => {
    //                 onColumnSort('isDraft', sortOrder, isAdd);
    //             }}
    //         />
    //     ),
    //     dataIndex: 'isDraft',
    //     key: 'isDraft',
    //     align: 'left',
    //     width: '100px',
    //     render: (value: string, record: TAccountingRow) => {
    //         return record.spacer ? (
    //             <></>
    //         ) : (
    //             <Layout direction="row" style={{ minWidth: '100px', maxWidth: '100px'  }}>
    //                 {value ? (
    //                     <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})} style={{ minWidth: '100px', maxWidth: '100px'  }}>
    //                         Черновик
    //                     </Text>
    //                 )  : (
    //                     <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})} style={{ minWidth: '100px', maxWidth: '100px'  }}>
    //                         Подтвержден
    //                     </Text> 
    //                 )}
    //             </Layout>
    //         );
    //     },
    // },
    {
        title: (
            <TableColumnHeader
                header=""
                withoutSort={true}
                align="center"
            />
        ),
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: '40px',
        render: (_value: string, record: TAccountingRow) => {
            return record.spacer ? (
                <></>
            ) : (
                <Layout direction="row" style={{ minWidth: '40px', maxWidth: '40px'  }}>
                    <Button 
                        view={'clear'}  
                        size='s' 
                        iconLeft={IconTrash}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteAccountingData(record.id);
                        }}
                        disabled={record.category === 'Продажа товара' || record.category === 'Продажа товара контрагента' }
                    />
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

} as TableProps<TAccountingRow>;

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
                                if (!record.spacer) {
                                    setIsEditModalOpen(true);
                                    setId(record.id);
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
export default AccountingTable;