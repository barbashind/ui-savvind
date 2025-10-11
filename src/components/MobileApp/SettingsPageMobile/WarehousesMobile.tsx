import { useEffect, useState } from "react"

// компоненты Consta

import { Button } from "@consta/uikit/Button"
import { Card } from "@consta/uikit/Card"
import { Layout } from "@consta/uikit/Layout"
import { Text } from "@consta/uikit/Text"



// иконки
import { SaveOutlined } from "@ant-design/icons"
import { IconAdd } from "@consta/icons/IconAdd";

// собственные компоненты
import { cnMixFontSize } from "../../../utils/MixFontSize"
import { AntIcon } from "../../../utils/AntIcon"
import { TWarehouse } from "../../../types/settings-types"
import { TextField } from "@consta/uikit/TextField"
import { IconTrash } from "@consta/icons/IconTrash"
import { cnMixSpace } from "@consta/uikit/MixSpace"
import { deleteWarehouse, getWarehouses, updateWarehouses } from "../../../services/SettingsService"
import { Loader } from "@consta/uikit/Loader"

// сервисы


const WarehousesMobile = () => {
        
const [warehouses, setWarehouses] = useState<TWarehouse[]>([]);

const [isLoading, setIsLoading] = useState<boolean>(true);
// Инициализация данных
useEffect(() => {
        const getWarehousesData = async () => {
                await getWarehouses((resp) => {
                        setWarehouses(resp.map((item : TWarehouse) => ({
                                warehouseId: item.warehouseId, 
                                name: item.name, 
                        })))
                });
        }
        void getWarehousesData().then(()=>{
                setIsLoading(false);
        });
}, [])

const deleteWarehousesData = async (id: number | undefined) => {
        setIsLoading(true);
        await deleteWarehouse(id).then(()=>{
                const getWarehousesData = async () => {
                        await getWarehouses((resp) => {
                                setWarehouses(resp.map((item : TWarehouse) => ({
                                        warehouseId: item.warehouseId, 
                                        name: item.name, 
                                })))
                        });
                }
                void getWarehousesData().then(()=>{
                        setIsLoading(false);
                });
        })
}

const updateWarehousesData = async (warehouses : TWarehouse[]) => {
        setIsLoading(true);
        await updateWarehouses(warehouses).then(()=>{
                const getWarehousesData = async () => {
                        await getWarehouses((resp) => {
                                setWarehouses(resp.map((item : TWarehouse) => ({
                                        warehouseId: item.warehouseId, 
                                        name: item.name, 
                                })))
                        });
                }
                void getWarehousesData().then(()=>{
                        setIsLoading(false);
                });
        })
}

        return (
                <Card border style={{width: '100%'}} className={cnMixSpace({mT: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="column" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        
                                        <Layout direction="row" style={{justifyContent: 'left', alignItems:'center'}}>
                                                <Text view="brand" size="s" weight="semibold" className={cnMixSpace({mR: 'm'})}>Склады</Text>
                                                <Button
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setWarehouses(prev => 
                                                                        [...prev, {warehouseId: undefined, name: undefined}]
                                                                )
                                                        }}
                                                        size="xs"
                                                        className={cnMixSpace({mR: 'm'})}
                                                />
                                                <Button
                                                        iconLeft={AntIcon.asIconComponent(() => (
                                                                <SaveOutlined
                                                                className={cnMixFontSize('m')}
                                                                />
                                                        ))}
                                                        view="primary"
                                                        size="xs"
                                                        onClick={()=>{
                                                                updateWarehousesData(warehouses);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {!isLoading && (warehouses?.length > 0) && (
                                <Layout direction="row" style={{justifyContent: 'space-between'}} className={cnMixSpace({mT:'m'})}>
                                        <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} align="left" size="xs">ID</Text>
                                        <Text style={{width: '100%'}} align="left" size="xs">Наименование</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && warehouses?.map((acc : TWarehouse) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        <TextField
                                                                value={acc?.warehouseId?.toString()}
                                                                size="xs"
                                                                placeholder="ID"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                            setWarehouses(prev => 
                                                                                prev.map(account => (warehouses.indexOf(account) === warehouses.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                warehouseId: Number(value),
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setWarehouses(prev => 
                                                                                        prev.map(account => (warehouses.indexOf(account) === warehouses.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        warehouseId: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                style={{minWidth: '50px', maxWidth: '50px'}}
                                                                disabled
                                                        />
                                                        <TextField
                                                                value={acc?.name}
                                                                size="xs"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите наименованование"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setWarehouses(prev => 
                                                                                prev.map(account => (warehouses.indexOf(account) === warehouses.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                name: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setWarehouses(prev => 
                                                                                        prev.map(account => (warehouses.indexOf(account) === warehouses.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        name: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({mL:'m'})}
                                                        />
                                                        <div style={{minWidth: '40px', maxWidth: '40px'}}>
                                                                <Button
                                                                        iconLeft={IconTrash}
                                                                        view="clear"
                                                                        size="xs"
                                                                        onClick={()=>{
                                                                                if (!acc.warehouseId) {
                                                                                        setWarehouses(prev => prev.filter(account => (warehouses.indexOf(account) !== warehouses.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteWarehousesData(acc.warehouseId)
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {!isLoading && (warehouses?.length === 0 || !warehouses) && (
                                                <Text 
                                                        view="secondary" 
                                                        size="xs" 
                                                        weight="semibold"
                                                        className={cnMixSpace({mT:'m'})}
                                                >
                                                        Добавьте хотя бы одну запись
                                                </Text>
                                        )}
                                        {isLoading && (
                                                <Layout style={{width: '100%', height: '50px', justifyContent: 'center', alignItems: 'center'}}>
                                                        <Loader/>
                                                </Layout>
                                        )}
                                </Layout>
                       </Layout>
                </Card>
                
                
        )
}
export default WarehousesMobile;