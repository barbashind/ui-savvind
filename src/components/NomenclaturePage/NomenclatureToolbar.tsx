import { useEffect, useRef, useState } from "react";

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { FileField } from '@consta/uikit/FileField';

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { TNomenclatureFilter } from "../../types/nomenclature-types";
import { IconUpload } from '@consta/icons/IconUpload';
import { updateNomenclatureRemains, uploadProductsFile } from "../../services/NomenclatureService";
import { IconRevert } from "@consta/icons/IconRevert";
import { getUserInfo } from "../../services/AuthorizationService";
import { Combobox } from "@consta/uikit/Combobox";
import { getWarehouses } from "../../services/SettingsService";
import { TWarehouse } from "../../types/settings-types";

export interface TNomeclatureToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setSearchText: React.Dispatch<React.SetStateAction<string | null>>;
        setFilterValues: React.Dispatch<React.SetStateAction<TNomenclatureFilter>>;
        searchText: string | null;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
        setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NomenclatureToolbar = ({setIsEditModalOpen, setFilterValues,  setSearchText,  searchText, setUpdateFlag, setIsFilterModalOpen } : TNomeclatureToolbarProps) => {
        
        const element = useRef<HTMLInputElement>(null);
        const updateRemains = async () => {
                await updateNomenclatureRemains(warehousesFilter).then(()=> {
                        setUpdateFlag(true);
                        setIsLoading(false);
                })
        }
        const [role, setRole] = useState<string | undefined>(undefined);
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
                
        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setRole(resp.role);
                        })
                };
                
                void getUserInfoData();
        }, []);
        
        return (
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Номенклатура
                                </Text>
                        </Layout>
                        <Layout direction="row">
                                <Button 
                                        label={'Обновить остатки товаров'}
                                        view="secondary"
                                        onClick={()=>{
                                                updateRemains();
                                                setIsLoading(true);
                                        }}
                                        iconLeft={IconRevert}
                                        size="s"
                                        loading={isLoading}
                                />
                                <Text size="s" className={cnMixSpace({mL: 'xl', mT: 's'})}>
                                        Поиск:
                                </Text>
                                <TextField
                                        size='s'
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
                                        className={cnMixSpace({mL: 's'})}
                                />
                                <Text size="xs" className={cnMixSpace({mR:'xs', mL:'m'})}>Выберите склад:</Text>
                                <Combobox
                                        items={warehouses}
                                        getItemKey={item => item.warehouseId ?? 0}
                                        getItemLabel={item => item.name ?? ''}
                                        placeholder="Выберите склад"
                                        multiple
                                        value={warehousesFilter} 
                                        onChange={(value)=> {
                                                if (value) {
                                                        setWarehousesFilter(value);
                                                } else {
                                                        setWarehousesFilter([]);
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
                                        className={cnMixSpace({mL: 's'})}
                                        onClick={() => {
                                                setUpdateFlag(true);
                                        }}
                                />
                                <Button size='s' view='secondary' label={'Добавить'} iconLeft={IconAdd} onClick={()=>{setIsEditModalOpen(true)}} className={cnMixSpace({mH: 's'})}/>
                                {role !== 'KUR' && (
                                        <div style={{ minWidth: 'fit-content' }}>
                                                <FileField
                                                id="purchase"
                                                inputRef={element}
                                                onChange={() => {
                                                        if (element.current?.files) {
                                                                uploadProductsFile(element.current.files[0]);
                                                        }
                                                        if (element.current) {
                                                        element.current.value = '';
                                                        }
                                                }}
                                                >
                                                {(props) => (
                                                        <Button
                                                        {...props}
                                                        size="s"
                                                        iconLeft={IconUpload}
                                                        label={'Загрузить файл'}
                                                        />
                                                )}
                                                </FileField>
                                        </div>
                                )}
                                <Button size='s' view='secondary' iconLeft={IconSortDownCenter} title="Фильтр" onClick={()=>{setIsFilterModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                        </Layout>
                        
                </Layout>
        )
}
export default NomenclatureToolbar