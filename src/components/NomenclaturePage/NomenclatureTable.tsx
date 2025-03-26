import React, {useEffect, useState} from 'react';

import { rcTableAdapter } from '@consta/rc-table-adapter/rcTableAdapter';
import RCTable, { TableProps } from 'rc-table';
import { ColumnType } from 'rc-table/lib/interface';

// компоненты Consta
import { Text } from "@consta/uikit/Text";
import { Layout } from "@consta/uikit/Layout";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Switch } from '@consta/uikit/Switch';
import { Button } from "@consta/uikit/Button/index";
import { Loader } from '@consta/uikit/Loader/index';

//иконки
import { IconTrash } from '@consta/icons/IconTrash';

// собственные компоненты
import { TNomenclature, TNomenclatureFilter, TNomenclatureRow, TNomenclatureSortFields } from "../../types/nomenclature-types";
import { TableColumnHeader } from '../global/TableColumnHeader.tsx';
import { TPageableResponse } from "../../utils/types.ts";
import { GetColumnSortOrder, GetColumnSortOrderIndex, OnColumnSort, Sort } from '../../hooks/useTableSorter.ts';
import { ErrorResponse, IPagination, TSortParam } from '../../services/utils.ts';
import { usePaginationStore } from '../../hooks/usePaginationStore.ts';
import { Pagination } from '../global/Pagination.tsx';
import { deleteNomenclature, getNomenclatures, updateNomenclature } from '../../services/NomenclatureService.ts';


interface TNomenclatureTableProps {
        updateFlag: boolean;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        currentPage: number;
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
        getColumnSortOrder: GetColumnSortOrder<TNomenclatureSortFields>;
        getColumnSortOrderIndex: GetColumnSortOrderIndex<TNomenclatureSortFields>;
        columnSort: Sort<TNomenclatureSortFields>;
        onColumnSort: OnColumnSort<TNomenclatureSortFields>;
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        filterValues: TNomenclatureFilter;
        count: number | null;
        setCount: React.Dispatch<React.SetStateAction<number | null>>;
        setId: React.Dispatch<React.SetStateAction<number | undefined>>;
    }


const NomenclatureTable = ({updateFlag, setUpdateFlag, setId, currentPage, setCurrentPage, getColumnSortOrder, getColumnSortOrderIndex, columnSort, onColumnSort,   setIsEditModalOpen, filterValues, count, setCount} : TNomenclatureTableProps) => {
const { getStoredPageSize, setStoredPageSize } = usePaginationStore('Records');
    const [pagination, setPagination] = useState<IPagination>({
                    totalPages: 0,
                    totalElements: 0,
                    offset: 0,
                    pageSize: getStoredPageSize(),
            });        
    const [rows, setRows] = useState<TNomenclatureRow[]>([]);
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
             const sortParam: TSortParam<TNomenclature>[] = columnSort.map(value => ({
            fieldname: value.column,
            isAsc: value.sortOrder === 'asc',
        }));
    const searchText = filterValues.searchText ?? null;

    const filterParam : TNomenclatureFilter = {
        searchText: searchText,
        remainsMax: filterValues.remainsMax,
        remainsMin: filterValues.remainsMin,
        remainsSumMin: filterValues.remainsSumMin,
        remainsSumMax: filterValues.remainsSumMax,
        brand: filterValues.brand,
        altName: filterValues.altName,
        productColor: filterValues.productColor,
        productPrice: filterValues.productPrice,
        productModel: filterValues.productModel,
        productCountry: filterValues.productCountry
    }

    const getData = async () => {
            try {
                const serverData: TPageableResponse<TNomenclature> = await getNomenclatures({
                    page: currentPage,
                    size: pagination.pageSize,
                    sortParam: sortParam,
                    filterParam: filterParam,
                });
                const dataRes: TNomenclatureRow[] = [];
                const spacerRow: TNomenclatureRow = {} as TNomenclatureRow;
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

const activeMessageNomenclature = async (record: TNomenclatureRow, itemId: number | undefined) => {
    const body = {
        ...record,
        isMessageActive: !record.isMessageActive
    }
    await updateNomenclature(itemId, body).then(()=>{
        setUpdateFlag(true);
    })
}

const deleteNomenclatureData = async (itemId: number | undefined) => {
    await deleteNomenclature(itemId).then(()=>{
        setUpdateFlag(true);
    })
}
 

    const columns: ColumnType<TNomenclatureRow>[] = [
        {
            title: (
                <TableColumnHeader
                    header="Наименование"
                    sortOrder={getColumnSortOrder('name')}
                    sortOrderIndex={getColumnSortOrderIndex('name')}
                    onSort={(sortOrder, isAdd) => {
                    onColumnSort('name', sortOrder, isAdd);
                }}
                />
            ),
            dataIndex: 'name',
            key: 'name',
            align: 'left',
            width: '100%',
            minWidth: 150,
            render: (value: string, record: TNomenclatureRow) => {
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
                        header="Бренд"
                        withoutSort={true}
                    />
                ),
                dataIndex: 'brand',
                key: 'brand',
                align: 'left',
                width: '240px',
                minWidth: 240,
                render: (value: string, record: TNomenclatureRow) => {
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
                        header="Тип товара"
                        withoutSort={true}
                    />
                ),
                dataIndex: 'productType',
                key: 'productType',
                align: 'left',
                width: '240px',
                minWidth: 240,
                render: (value: string, record: TNomenclatureRow) => {
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
                        header="Последняя цена закупки"
                        sortOrder={getColumnSortOrder('lastCostPrice')}
                        sortOrderIndex={getColumnSortOrderIndex('lastCostPrice')}
                        onSort={(sortOrder, isAdd) => {
                                onColumnSort('lastCostPrice', sortOrder, isAdd);
                                }}
                    />
                ),
                minWidth: 150,
                dataIndex: 'lastCostPrice',
                key: 'lastCostPrice',
                align: 'left',
                width: '150px',
                render: (value: string, record: TNomenclatureRow) => {
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
                        header="Остаток"
                        sortOrder={getColumnSortOrder('remainsSum')}
                        sortOrderIndex={getColumnSortOrderIndex('remainsSum')}
                        onSort={(sortOrder, isAdd) => {
                                onColumnSort('remainsSum', sortOrder, isAdd);
                                }}
                    />
                ),
                dataIndex: 'remainsSum',
                key: 'remainsSum',
                align: 'left',
                width: '120px',
                minWidth: 120,
                render: (value: number, record: TNomenclatureRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <Layout direction="row" style={{ width: '120px' }}>
                            <Text size="s" weight="medium">
                                {value ? Math.round(value) + ' шт' : '0 шт'}
                            </Text>
                            
                        </Layout>
                    );
                },
            },
            {
                title: (
                    <TableColumnHeader
                        header="Остаток в $"
                        withoutSort={true}
                    />
                ),
                dataIndex: 'remainsSum',
                key: 'remainsSum',
                align: 'left',
                width: '200px',
                minWidth: 200,
                render: (value: string, record: TNomenclatureRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <Layout direction="row" style={{ width: '200px' }}>
                            
                            <Text size="s" weight="medium" className={cnMixSpace({mL:'2xs'})}>
                                {(Number(Number(value) * Number(record?.lastCostPrice)).toFixed(2) || '0') + ' $' }
                            </Text>
                        </Layout>
                    );
                },
            },
            {
                title: (
                    <TableColumnHeader
                        header="Активировать бота"
                        withoutSort
                    />
                ),
                dataIndex: 'isMessageActive',
                key: 'isMessageActive',
                align: 'center',
                width: '150px',
                minWidth: 150,
                render: (value: boolean, record: TNomenclatureRow) => {
                    return record.spacer ? (
                        <></>
                    ) : (
                        <div style={{minWidth: '150px'}}>
                                <Switch 
                                        size="s" 
                                        checked={value}
                                        onClick={(e) => {
                                                e.stopPropagation();
                                        }}
                                        onChange={(e)=>{
                                                e.stopPropagation();
                                                activeMessageNomenclature(record, record.itemId);
                                        }}
                                />
                        </div>
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
                dataIndex: 'isMessageActive',
                key: 'isMessageActive',
                align: 'center',
                width: '150px',
                minWidth: 150,
                render: (_value: boolean, record: TNomenclatureRow) => {
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
                                        deleteNomenclatureData(record.itemId);
                                }}
                                />
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
        rowKey: (row: { itemId: number }) => row.itemId,

    } as TableProps<TNomenclatureRow>;

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
                                    setId(record.itemId);
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
export default NomenclatureTable