import React, { useEffect, useState } from "react"

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

// компоненты Consta
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Button } from "@consta/uikit/Button/index";
import { Loader } from "@consta/uikit/Loader/index";

// иконки
import { IconTrash } from '@consta/icons/IconTrash';

// собственные компоненты
import { TableColumnHeader } from "../global/TableColumnHeader.tsx";
import { TPageableResponse } from "../../utils/types.ts";
import { deletePurchase, getPurchases } from "../../services/PurchaseService.ts";
import { TPurchase, TPurchaseFilter, TPurchaseRow, TPurchaseSortFields } from "../../types/purchase-types.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from "../../hooks/useTableSorter.ts";
import { ErrorResponse, IPagination, TSortParam } from "../../services/utils.ts";
import { usePaginationStore } from "../../hooks/usePaginationStore.ts";
import { Pagination } from "../global/Pagination.tsx";
import { Modal } from "@consta/uikit/Modal/index";



interface TProductPurchaseTableProps {
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

const ProductPurchaseTable = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TProductPurchaseTableProps) => {

    const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
        const [pagination, setPagination] = useState<IPagination>({
                        totalPages: 0,
                        totalElements: 0,
                        offset: 0,
                        pageSize: getStoredPageSize(),
                });        
        const [rows, setRows] = useState<TPurchaseRow[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isDeletingModal, setIsDeletingModal] = useState<boolean>(false);
        const [currentBatchId, setCurrentBatchId] = useState<number | undefined>(undefined);
       
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
            sumMin: filterValues.sumMin,
            sumMax: filterValues.sumMax,
            dateMin: filterValues.dateMin,
            dateMax: filterValues.dateMax,
            batchNumber: filterValues.batchNumber,
            product: filterValues.product,
            batchStatus: filterValues.batchStatus
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
    
    const deleteBatchData = async (itemId: number | undefined) => {
        await deletePurchase(itemId).then(()=>{
            setUpdateFlag(true);
        })
    }
 

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
            width: '100%',
            minWidth: 200,
            render: (value: string, record: TPurchaseRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <div>
                        <Text size="s" weight="medium">
                            {value ?  value : 'Разовая закупка'}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: (
                <TableColumnHeader
                    header="Объем закупа ($)"
                    sortOrder={getColumnSortOrder('sum')}
                    sortOrderIndex={getColumnSortOrderIndex('sum')}
                    onSort={(sortOrder, isAdd) => {
                        onColumnSort('sum', sortOrder, isAdd);
                    }}
                />
            ),
            minWidth: 200,
            dataIndex: 'sum',
            key: 'sum',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '200px' }}>
                        <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                            {record.batchNumber !== 0 ? '(' + (value?.toString() || '0') + ' $)' : '(' + (value?.toString() || '0') + ' ₽)' }
                        </Text>
                    </Layout>
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
            minWidth: 200,
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '200px' }}>
                        <Text size="s" weight="medium">
                            {value ? value : '-'}
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
            minWidth: 200,
            dataIndex: 'comment',
            key: 'comment',
            align: 'left',
            width: '200px',
            render: (value: string, record: TPurchaseRow) => {
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
        {
            title: (
                <TableColumnHeader
                    header="Автор"
                    withoutSort
                />
            ),
            minWidth: 150,
            dataIndex: 'author',
            key: 'author',
            align: 'left',
            width: '150px',
            render: (value: string, record: TPurchaseRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '150px' }}>
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
                    header="Статус"
                    withoutSort
                />
            ),
            dataIndex: 'batchStatus',
            key: 'batchStatus',
            align: 'left',
            width: '200px',
            minWidth: 200,
            render: (value: string, record: TPurchaseRow) => {
                return record.spacer ? (
                    <></>
                ) : (
                    <Layout direction="row" style={{ width: '200px' }}>
                        {value === 'CREATED' && (
                            <Text size="s" weight="medium" view="link" className={cnMixSpace({mL:'2xs'})}>
                            Создан
                            </Text>)}
                        {value === 'REGISTRATION' && (<Text size="s" weight="medium" view="caution" className={cnMixSpace({mL:'2xs'})}>
                            На оприходовании
                        </Text>)}
                        {value === 'COMPLETED' && (<Text size="s" weight="medium" view="success" className={cnMixSpace({mL:'2xs'})}>
                            Принят на склад
                        </Text>)}
                    </Layout>
                );
            },
        },
            {
                title: (
                    <TableColumnHeader
                        header=""
                        withoutSort
                    />
                ),
                dataIndex: 'idBatch',
                key: 'idBatch',
                align: 'center',
                width: '150px',
                minWidth: 150,
                render: (_value: boolean, record: TPurchaseRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div>
                            <Button 
                                size="s" 
                                iconLeft={IconTrash} 
                                view="clear" 
                                onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeletingModal(true);
                                        setCurrentBatchId(record.batchId);
                                        // deleteBatchData(record.batchId);
                                }}
                                />
                                    <Modal
                                        isOpen={isDeletingModal && currentBatchId === record.batchId}
                                        hasOverlay={false}
                                    >
                                        <Layout direction="column" className={cnMixSpace({p:'xl'})}>
                                            <Text size="m" >{`Партия № ${record.batchNumber}`}</Text>
                                            <Text size="s" view="secondary" className={cnMixSpace({mT:'2xl'})}>Вы уверены, что хотите удалить закупку?</Text>
                                            <Layout direction="row" style={{justifyContent: 'right'}} className={cnMixSpace({mT:'2xl'})}>
                                                <Button
                                                    view="primary"
                                                    label={'Да, удалить'}
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        deleteBatchData(record.batchId);
                                                        setIsDeletingModal(false);
                                                    }}
                                                    size="s"
                                                />
                                                <Button
                                                    view="secondary"
                                                    label={'Отмена'}
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        setIsDeletingModal(false);
                                                    }}
                                                    size="s"
                                                    className={cnMixSpace({mL:'m'})}
                                                />
                                            </Layout>
                                        </Layout>
                                        
                                    </Modal>
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
        rowKey: (row: { batchId: number }) => row.batchId,

    } as TableProps<TPurchaseRow    >;

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
export default ProductPurchaseTable