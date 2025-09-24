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
import { cnMixFontSize } from "d:/ui-savvind/src/utils/MixFontSize"
import { AntIcon } from "d:/ui-savvind/src/utils/AntIcon"
import { TCurrency } from "d:/ui-savvind/src/types/settings-types"
import { TextField } from "@consta/uikit/TextField"
import { IconTrash } from "@consta/icons/IconTrash"
import { cnMixSpace } from "@consta/uikit/MixSpace"
import { deleteCurrency, getCurrencies, updateCurrencies } from "d:/ui-savvind/src/services/SettingsService"
import { Loader } from "@consta/uikit/Loader"

// сервисы


const CurrenciesMobile = () => {
        
const [currencies, setCurrencies] = useState<TCurrency[]>([]);

const [isLoading, setIsLoading] = useState<boolean>(true);
// Инициализация данных
useEffect(() => {
        const getCurrenciesData = async () => {
                await getCurrencies((resp) => {
                        setCurrencies(resp.map((item : TCurrency) => ({
                                id: item.id, 
                                currency: item.currency, 
                        })))
                });
        }
        void getCurrenciesData().then(()=>{
                setIsLoading(false);
        });
}, [])

const deleteCurrencyData = async (id: number | undefined) => {
        setIsLoading(true);
        await deleteCurrency(id).then(()=>{
                const getCurrenciesData = async () => {
                        await getCurrencies((resp) => {
                                setCurrencies(resp.map((item : TCurrency) => ({
                                        id: item.id, 
                                currency: item.currency, 
                                })))
                        });
                }
                void getCurrenciesData().then(()=>{
                        setIsLoading(false);
                });
        })
}

const updateCurrenciesData = async (warehouses : TCurrency[]) => {
        setIsLoading(true);
        await updateCurrencies(warehouses).then(()=>{
                const getCurrenciesData = async () => {
                        await getCurrencies((resp) => {
                                setCurrencies(resp.map((item : TCurrency) => ({
                                        id: item.id, 
                                        currency: item.currency, 
                                })))
                        });
                }
                void getCurrenciesData().then(()=>{
                        setIsLoading(false);
                });
        })
}

        return (
                <Card border style={{width: '100%'}} className={cnMixSpace({mT: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        <Text view="brand" size="l" weight="semibold">Валюты</Text>
                                        <Layout direction="row">
                                                <Button
                                                        label={'Добавить'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setCurrencies(prev => 
                                                                        [...prev, {id: undefined, currency: undefined}]
                                                                )
                                                        }}
                                                        size="s"
                                                        className={cnMixSpace({mR: 'm'})}
                                                />
                                                <Button
                                                        label={'Сохранить'}
                                                        iconLeft={AntIcon.asIconComponent(() => (
                                                                <SaveOutlined
                                                                className={cnMixFontSize('m') + ' ' + cnMixSpace({mR:'xs'})}
                                                                />
                                                        ))}
                                                        view="primary"
                                                        size="s"
                                                        onClick={()=>{
                                                                updateCurrenciesData(currencies);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {!isLoading && (currencies?.length > 0) && (
                                <Layout direction="row" style={{justifyContent: 'space-between'}} className={cnMixSpace({mT:'m'})}>
                                        <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} align="left" size="xs">ID</Text>
                                        <Text style={{width: '100%'}} align="left" size="xs">Наименование</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && currencies?.map((acc : TCurrency) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        <TextField
                                                                value={acc?.id?.toString()}
                                                                size="s"
                                                                placeholder="ID"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                            setCurrencies(prev => 
                                                                                prev.map(account => (currencies.indexOf(account) === currencies.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                id: Number(value),
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setCurrencies(prev => 
                                                                                        prev.map(account => (currencies.indexOf(account) === currencies.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        id: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                style={{minWidth: '120px', maxWidth: '120px'}}
                                                                disabled
                                                        />
                                                        <TextField
                                                                value={acc?.currency}
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите наименованование"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setCurrencies(prev => 
                                                                                prev.map(account => (currencies.indexOf(account) === currencies.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                currency: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setCurrencies(prev => 
                                                                                        prev.map(account => (currencies.indexOf(account) === currencies.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        currency: undefined,
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
                                                                        size="s"
                                                                        onClick={()=>{
                                                                                if (!acc.id) {
                                                                                        setCurrencies(prev => prev.filter(account => (currencies.indexOf(account) !== currencies.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteCurrencyData(acc.id)
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {!isLoading && (currencies?.length === 0 || !currencies) && (
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
export default CurrenciesMobile;