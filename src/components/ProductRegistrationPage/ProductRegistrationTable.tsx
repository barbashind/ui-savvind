import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

// компоненты Consta
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from "@consta/uikit/Loader/index";

// собственные компоненты
import { Pagination } from "../global/Pagination.tsx";
import { TPurchaseReg, TPurchaseRegFilter, TPurchaseRegRow, TPurchaseRegSortFields } from "../../types/registration-types.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { TPageableResponse } from "../../utils/types.ts";
import { getPurchasesReg } from "../../services/RegistrationService.ts";
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";


interface TProductRegistrationTableProps {
                updateFlag: boolean;
                setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
                currentPage: number;
                setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
                getColumnSortOrder: GetColumnSortOrder<TPurchaseRegSortFields>;
                getColumnSortOrderIndex: GetColumnSortOrderIndex<TPurchaseRegSortFields>;
                columnSort: Sort<TPurchaseRegSortFields>;
                onColumnSort: OnColumnSort<TPurchaseRegSortFields>;
                setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
                filterValues: TPurchaseRegFilter;
                count: number | null;
                setCount: React.Dispatch<React.SetStateAction<number | null>>;
                setId: React.Dispatch<React.SetStateAction<number | undefined>>;
    }

const ProductRegistrationTable = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TProductRegistrationTableProps) => {

        const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
                const [pagination, setPagination] = useState<IPagination>({
                                totalPages: 0,
                                totalElements: 0,
                                offset: 0,
                                pageSize: getStoredPageSize(),
                        });        
                const [rows, setRows] = useState<TPurchaseRegRow[]>([]);
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
                         const sortParam: TSortParam<TPurchaseReg>[] = columnSort.map(value => ({
                        fieldname: value.column,
                        isAsc: value.sortOrder === 'asc',
                    }));
            
                const filterParam : TPurchaseRegFilter = {
                    batchStatus: ['REGISTRATION']
                }
            
                const getData = async () => {
                        try {
                            const serverData: TPageableResponse<TPurchaseReg> = await getPurchasesReg({
                                page: currentPage,
                                size: pagination.pageSize,
                                sortParam: sortParam,
                                filterParam: filterParam,
                            });
                            const dataRes: TPurchaseRegRow[] = [];
                            const spacerRow: TPurchaseRegRow = {} as TPurchaseRegRow;
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
 

    const columns: ColumnType<TPurchaseRegRow>[] = [
        {
            title: (
                <TableColumnHeader
                    header="Номер партии"
                    withoutSort
                />
            ),
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            align: 'left',
            width: '100%',
            render: (value: string, record: TPurchaseRegRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        <Text size="s" weight="medium">
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
                    sortOrder={getColumnSortOrder('updatedAt')}
                    sortOrderIndex={getColumnSortOrderIndex('updatedAt')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('updatedAt', sortOrder, isAdd);
                    }}
                />
            ),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseRegRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '200px' }}>
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
            width: '200px',
            render: (value: string, record: TPurchaseRegRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '200px' }}>
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

    } as TableProps<TPurchaseRegRow>;

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
export default ProductRegistrationTable