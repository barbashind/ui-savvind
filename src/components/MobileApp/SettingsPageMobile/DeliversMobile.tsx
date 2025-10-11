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
import { TDeliver } from "../../../types/settings-types"
import { TextField } from "@consta/uikit/TextField"
import { IconTrash } from "@consta/icons/IconTrash"
import { cnMixSpace } from "@consta/uikit/MixSpace"
import NumberMaskTextField from "../../../utils/NumberMaskTextField"
import { getDelivers } from "../../../services/PurchaseService"
import { deleteDeliver, updateDelivers } from "../../../services/SettingsService"
import { Loader } from "@consta/uikit/Loader"

// сервисы


const DeliversMobile = () => {
        
const [delivers, setDelivers] = useState<TDeliver[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
// Инициализация данных
useEffect(() => {
        const getDeliversData = async () => {
                await getDelivers((resp) => {
                        setDelivers(resp.map((item : TDeliver) => ({
                                deliverId: item.deliverId, 
                                name: item.name, priceDeliver: 
                                item.priceDeliver, 
                                insurance: item.insurance
                        })))
                });
        }
        void getDeliversData().then(()=>{
                setIsLoading(false);
        });
}, [])

const deleteDeliverData = async (deliverId: number | undefined) => {
        setIsLoading(true);
        await deleteDeliver(deliverId).then(()=>{
                const getDeliversData = async () => {
                        await getDelivers((resp) => {
                                setDelivers(resp.map((item : TDeliver) => ({
                                        deliverId: item.deliverId, 
                                        name: item.name, priceDeliver: 
                                        item.priceDeliver, 
                                        insurance: item.insurance
                                })))
                        });
                }
                void getDeliversData().then(()=>{
                        setIsLoading(false);
                });
        })
}

const updateDeliversData = async (contractors : TDeliver[]) => {
        setIsLoading(true);
        await updateDelivers(contractors).then(()=>{
                const getDeliversData = async () => {
                        await getDelivers((resp) => {
                                setDelivers(resp.map((item : TDeliver) => ({
                                        deliverId: item.deliverId, 
                                        name: item.name, priceDeliver: 
                                        item.priceDeliver, 
                                        insurance: item.insurance
                                })))
                        });
                }
                void getDeliversData().then(()=>{
                        setIsLoading(false);
                });
        })
}


        return (
                <Card border style={{width: '100%'}} className={cnMixSpace({mT: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        
                                        <Layout direction="row" style={{justifyContent: 'left', alignItems:'center'}}>
                                                <Text view="brand" size="s" weight="semibold" className={cnMixSpace({mR: 'm'})}>Доставщики</Text>
                                                <Button
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setDelivers(prev => 
                                                                        [...prev, {deliverId: undefined, name: undefined, priceDeliver: undefined, insurance: undefined}]
                                                                )
                                                        }}
                                                        size="s"
                                                        className={cnMixSpace({mR: 'm'})}
                                                />
                                                <Button
                                                        iconLeft={AntIcon.asIconComponent(() => (
                                                                <SaveOutlined
                                                                className={cnMixFontSize('m')}
                                                                />
                                                        ))}
                                                        view="primary"
                                                        size="s"
                                                        onClick={()=>{
                                                                updateDeliversData(delivers);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {(delivers?.length > 0) && !isLoading && (
                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        {/* <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} size="xs" align="left">ID</Text> */}
                                        <Text style={{width: '100%'}} size="xs" align="left">Наименование</Text>
                                        <Text style={{minWidth: '60px', maxWidth: '60px'}} className={cnMixSpace({mL:'m'})} size="xs" align="left">Цена за кг</Text>
                                        <Text style={{minWidth: '60px', maxWidth: '60px'}} className={cnMixSpace({mL:'m'})} size="xs" align="left">% страховки</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && delivers?.map((acc : TDeliver) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        {/* <TextField
                                                                value={acc?.deliverId?.toString()}
                                                                size="s"
                                                                placeholder="ID"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setDelivers(prev => 
                                                                                prev.map(account => (delivers.indexOf(account) === delivers.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                deliverId: Number(value),
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setDelivers(prev => 
                                                                                        prev.map(account => (delivers.indexOf(account) === delivers.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        deliverId: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                style={{minWidth: '120px', maxWidth: '120px'}}
                                                                disabled
                                                        /> */}
                                                        <TextField
                                                                value={acc?.name}
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите наименованование"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setDelivers(prev => 
                                                                                prev.map(account => (delivers.indexOf(account) === delivers.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                name: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setDelivers(prev => 
                                                                                        prev.map(account => (delivers.indexOf(account) === delivers.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        name: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                // className={cnMixSpace({mL:'m'})}
                                                        />
                                                        <NumberMaskTextField
                                                                value={acc?.priceDeliver?.toString()}
                                                                size="s"
                                                                style={{minWidth: '60px', maxWidth: '60px'}}
                                                                placeholder="Введите цену доставки за кг"
                                                                onChange={(value : string | null)=>{
                                                                        if (value) {
                                                                                setDelivers(prev => 
                                                                                prev.map(elem => (delivers.indexOf(elem) === delivers.indexOf(acc)) ? 
                                                                                        { ...elem, 
                                                                                                priceDeliver: Number(value),
                                                                                        } : elem
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setDelivers(prev => 
                                                                                        prev.map(elem => (delivers.indexOf(elem) === delivers.indexOf(acc)) ? 
                                                                                                { ...elem, 
                                                                                                        priceDeliver: undefined,
                                                                                                } : elem
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({mL:'m'})}
                                                        />
                                                        <NumberMaskTextField
                                                                value={acc?.insurance?.toString()}
                                                                size="s"
                                                                style={{minWidth: '60px', maxWidth: '60px'}}
                                                                placeholder="Введите % страховки"
                                                                onChange={(value : string | null)=>{
                                                                        if (value) {
                                                                                setDelivers(prev => 
                                                                                prev.map(elem => (delivers.indexOf(elem) === delivers.indexOf(acc)) ? 
                                                                                        { ...elem, 
                                                                                                insurance: Number(value),
                                                                                        } : elem
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setDelivers(prev => 
                                                                                        prev.map(elem => (delivers.indexOf(elem) === delivers.indexOf(acc)) ? 
                                                                                                { ...elem, 
                                                                                                        insurance: undefined,
                                                                                                } : elem
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
                                                                        size="s"
                                                                        onClick={()=>{
                                                                                if (!acc.deliverId) {
                                                                                        setDelivers(prev => prev.filter(account => (delivers.indexOf(account) !== delivers.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteDeliverData(acc.deliverId)
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {!isLoading && (delivers?.length === 0 || !delivers) && (
                                                <Text 
                                                        view="secondary" 
                                                        size="s" 
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
export default DeliversMobile