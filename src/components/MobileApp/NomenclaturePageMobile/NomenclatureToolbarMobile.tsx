import { useEffect, useState } from "react";

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { TNomenclatureFilter } from "../../../types/nomenclature-types";
import { updateNomenclatureRemains } from "../../../services/NomenclatureService";
import { IconRevert } from "@consta/icons/IconRevert";
import { Combobox } from "@consta/uikit/Combobox";
import { getWarehouses } from "../../../services/SettingsService";
import { TWarehouse } from "../../../types/settings-types";
import { AntIcon } from "../../../utils/AntIcon";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { cnMixFontSize } from "../../../utils/MixFontSize";
import { Card } from "@consta/uikit/Card";
import { Text } from "@consta/uikit/Text";

export interface TNomeclatureToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TNomenclatureFilter>>;
        searchText: string | null;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const NomenclatureToolbarMobile = ({setIsEditModalOpen, setFilterValues,  setSearchText,  searchText, setUpdateFlag } : TNomeclatureToolbarProps) => {
        
        const updateRemains = async () => {
                await updateNomenclatureRemains(warehousesFilter).then(()=> {
                        setUpdateFlag(true);
                        setIsLoading(false);
                })
        }
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);
        const [warehousesFilter, setWarehousesFilter] = useState<TWarehouse[]>([]);
        
        useEffect(() => {
                        
                const getWarehousesData = async () => {
                        await getWarehouses((resp) => {
                                setWarehouses(resp.map((item : TWarehouse) => ({
                                        warehouseId: item.warehouseId, 
                                        name: item.name, 
                                })))
                        });
                }
                void getWarehousesData()
                
        }, []);
                
        const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
        return (
                <Layout direction="column"  >
                        <Layout direction="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }} className={cnMixSpace({pH: 'xs', pT:'xs', mB:'m'})} >
                                <Button 
                                        label={'Обновить остатки товаров'}
                                        size='m' 
                                        view='primary' 
                                        onClick={()=>{
                                                updateRemains();
                                                setIsLoading(true);
                                        }}
                                        iconLeft={IconRevert}
                                        loading={isLoading}
                                        form='round'
                                />
                                <Layout direction="row">
                                        <Button 
                                                size='m' 
                                                view='secondary' 
                                                iconLeft={IconAdd} 
                                                onClick={()=>{setIsEditModalOpen(true)}} 
                                        />
                                        <Button 
                                                size='m' 
                                                view='ghost' 
                                                iconLeft={AntIcon.asIconComponent(() => !isOpenFilter ? (
                                                                <DownOutlined
                                                                        className={cnMixFontSize('l')}
                                                                />
                                                        ) : (
                                                                <UpOutlined 
                                                                        className={cnMixFontSize('l')}
                                                                />
                                                        )
                                                )}
                                                // title="Поиск"  
                                                className={cnMixSpace({mL: 's'})}
                                                onClick={() => {
                                                        setIsOpenFilter(!isOpenFilter);
                                                }}
                                        />
                                </Layout>
                                
                        </Layout>
                        {isOpenFilter && (
                                                <Card className={cnMixSpace({ mB:'m', mH: 's'})} style={{border: '1px solid var(--color-typo-brand)'}}>
                                                        <Layout direction="column"  className={cnMixSpace({pH: 'xs', pT:'m'})}>
                                                                <TextField
                                                                        size='s'
                                                                        placeholder="Поиск по наименованию"
                                                                        value={searchText}
                                                                        onChange={(value) => {
                                                                                setSearchText(value);
                                                                                setFilterValues(prev => ({...prev, searchText: value}))
                                                                                if (!value) {
                                                                                        setUpdateFlag(true);
                                                                                }
                                                                        }}
                                                                        onKeyPress={(event) => {
                                                                                if (event.key === 'Enter') {
                                                                                        setUpdateFlag(true);
                                                                                }
                                                                        }}
                                                                        withClearButton
                                                                />
                                                                <Layout direction="row" className={cnMixSpace({mV: 's'})}>
                                                                        <Combobox
                                                                                placeholder="Выберите склад"
                                                                                multiple={true}
                                                                                items={warehouses}
                                                                                getItemKey={item => item.warehouseId ?? 0}
                                                                                getItemLabel={item => item.name ?? ''}
                                                                                size='s'
                                                                                value={warehousesFilter}
                                                                                onChange={(value)=> {
                                                                                        if (value) {
                                                                                                setWarehousesFilter(value);
                                                                                        } else {
                                                                                                setWarehousesFilter([]);
                                                                                        }
                                                                                        }
                                                                                        } 
                                                                                onKeyPress={(event) => {
                                                                                        if (event.key === 'Enter') {
                                                                                                setUpdateFlag(true);
                                                                                        }
                                                                                        }}
                                                                                className={'selectMobile'}
                                                                                renderValue={(item) => {
                                                                                        const count = warehousesFilter?.length || 0;
                                                                                        const selected = warehousesFilter ?? [];
                                                                                        const primary = selected[0];
                                                                                        if (count === 0) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>-</Text>;
                                                                                        if (count === 1) return <Text size="m" className={cnMixSpace({ mT:'2xs' })}>{warehousesFilter ? warehousesFilter[0].name : '-'}</Text>;
                                                                                        return (item.item === primary) ? <Text size="m" className={cnMixSpace({ mT:'2xs' })} >{`Выбрано: ${count}`}</Text> : null;
                                                                                }}
                                                                        />
                                                                        <Button 
                                                                        size='s' 
                                                                        view='secondary' 
                                                                        iconLeft={IconSearchStroked} 
                                                                        title="Поиск"  
                                                                        className={cnMixSpace({mL: 's'})}
                                                                        onClick={() => {
                                                                                setUpdateFlag(true);
                                                                        }}
                                                                />
                                                                </Layout>
                                                                
                                                               
                                                                
                                                                
                                                        </Layout>
                                                </Card>
                        )}
                </Layout>
        )
}
export default NomenclatureToolbarMobile;