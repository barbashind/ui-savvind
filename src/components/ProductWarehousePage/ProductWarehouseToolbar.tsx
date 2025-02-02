import React, { useEffect, useState } from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Radio } from '@consta/uikit/Radio';
import { TextField } from "@consta/uikit/TextField";
import { Combobox } from "@consta/uikit/Combobox";

// иконки
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter';
import { IconFunnelRemove } from '@consta/icons/IconFunnelRemove';
import { IconSearchStroked } from "@consta/icons/IconSearchStroked";


import { TMode } from "../../pages/ProductWarehouse";
import { TPurchaseItemFilter } from "../../types/purchase-types";
import { TWarehouse } from "../../types/settings-types";
import { getWarehouses } from "../../services/SettingsService";
import { getUserInfo } from "../../services/AuthorizationService";

export interface TProductWarehouseToolbarProps {
        setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        mode: TMode;
        setMode: React.Dispatch<React.SetStateAction<TMode>>;
        modes: TMode[];
        setFilterValuesP: React.Dispatch<React.SetStateAction<TPurchaseItemFilter>>;
        filterValuesP: TPurchaseItemFilter;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsReturnModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProductWarehouseToolbar = ({setIsFilterModalOpen, mode, setMode, modes, setFilterValuesP, filterValuesP, setUpdateFlag, setIsReturnModalOpen} : TProductWarehouseToolbarProps) => {
const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);

useEffect(() => {
                
        const getWarehousesData = async () => {
                await getWarehouses((resp) => {
                        setWarehouses(resp.map((item : TWarehouse) => ({
                                warehouseId: item.warehouseId, 
                                name: item.name, 
                        })))
                });
        }
        if (mode.code === 'PRODUCTS') {
                void getWarehousesData()
        }
        
}, [modes, mode]);

const [role, setRole] = useState<string | undefined>(undefined);

useEffect(() => {
        
        const getUserInfoData = async () => {
                await getUserInfo().then((resp) => {
                        setRole(resp.role);
                })
        };
        
        void getUserInfoData();
}, []);

        return (
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({m: 'm', p:'m'})} >
                        <Layout direction="row" >
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Управление складами
                                </Text>
                        </Layout>
                        <Layout direction="row" style={{alignItems: 'center'}} >
                                {mode.code === 'PRODUCTS' && (
                                                <>
                                                <Text size="xs" className={cnMixSpace({mR:'xs'})}>Поиск:</Text>
                                                <TextField
                                                        value={filterValuesP.searchText}
                                                        onChange={(value)=>{
                                                                if (value) {
                                                                        setFilterValuesP(prev => ({ ...prev, searchText: value }));
                                                                } else {
                                                                        setFilterValuesP(prev => ({ ...prev, searchText: null }));
                                                                        setUpdateFlag(true);
                                                                }
                                                                }}
                                                        size="s"
                                                        placeholder="Введите для поиска"
                                                        style={{width: '250px'}}
                                                        className={cnMixSpace({mR:'m'})}
                                                        onKeyPress={(event) => {
                                                                if (event.key === 'Enter') {
                                                                        setUpdateFlag(true);
                                                                }
                                                            }}
                                                        withClearButton
                                                />
                                                <Text size="xs" className={cnMixSpace({mR:'xs'})}>Выберите склад:</Text>
                                                <Combobox 
                                                        items={warehouses}
                                                        getItemKey={item => item.warehouseId ?? 0}
                                                        getItemLabel={item => item.name ?? ''}
                                                        placeholder="Выберите склад"
                                                        value={filterValuesP?.warehouse ? {warehouseId: warehouses?.find(item => (item.name === filterValuesP?.warehouse))?.warehouseId, name: filterValuesP?.warehouse} : null} 
                                                        onChange={(value)=> {
                                                                if (value) {
                                                                        setFilterValuesP(prev => ({ ...prev, warehouse: value.name ?? null }));
                                                                } else {
                                                                        setFilterValuesP(prev => ({ ...prev, warehouse: null }));
                                                                }
                                                                }
                                                                } 
                                                        size="s"
                                                        style={{minWidth:'235px', maxWidth:'235px'}}
                                                        className={cnMixSpace({mR:'m'})}
                                                />
                                                <Button 
                                                        size='s' 
                                                        view='secondary' 
                                                        iconLeft={IconSearchStroked} 
                                                        title="Поиск" 
                                                        onClick={()=>{setUpdateFlag(true)}} 
                                                        className={cnMixSpace({mR: 'm'})}
                                                />
                                        </>
                                )}
                                
                                <Radio checked={mode.code === 'BATCHES'} onClick={()=> {setMode(modes[0])}}/>
                                <Text size="s" className={cnMixSpace({mL: 'xs'})}>По партиям</Text>
                                <Radio checked={mode.code === 'PRODUCTS'} onClick={()=> {setMode(modes[1])}} className={cnMixSpace({mL: 'm'})}/>
                                <Text size="s" className={cnMixSpace({mL: 'xs'})}>По товарам</Text>
                                {role === 'ADM' && (
                                        <Button 
                                        size='s' 
                                        view='secondary'
                                        label={'Списать товар'}
                                        iconLeft={IconFunnelRemove} 
                                        onClick={()=>{setIsReturnModalOpen(true)}} 
                                        className={cnMixSpace({mL: 's'})}
                                />
                                )}
                                <Button 
                                        size='s' 
                                        view='secondary' 
                                        iconLeft={IconSortDownCenter} 
                                        title="Фильтр" 
                                        onClick={()=>{setIsFilterModalOpen(true)}} 
                                        className={cnMixSpace({mL: 's'})}
                                        disabled={mode.code === 'PRODUCTS'}
                                />
                        </Layout>
                        
                </Layout>
        )
}
export default ProductWarehouseToolbar