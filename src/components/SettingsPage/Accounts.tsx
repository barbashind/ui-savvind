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
import { cnMixFontSize } from "../../utils/MixFontSize"
import { AntIcon } from "../../utils/AntIcon"
import { TAccount } from "../../types/settings-types"
import { TextField } from "@consta/uikit/TextField"
import { IconTrash } from "@consta/icons/IconTrash"
import { cnMixSpace } from "@consta/uikit/MixSpace"
import { deleteAccount, getAccounts, updateAccounts } from "../../services/SettingsService"
import { Loader } from "@consta/uikit/Loader"

// сервисы


const Accounts = () => {
        
const [accounts, setAccounts] = useState<TAccount[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

// Инициализация данных
useEffect(() => {
        const getAccountsData = async () => {
                await getAccounts((resp) => {
                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
                        
                })
        }
        void getAccountsData().then(()=> {
                setIsLoading(false);
        });
}, [])

const deleteAccountData = async (accountId: number | undefined) => {
        setIsLoading(true);
        await deleteAccount(accountId).then(()=>{
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
                        })
                }
                void getAccountsData().then(()=> {
                        setIsLoading(false);
                });
        })
}

const updateAccountsData = async (accounts : TAccount[]) => {
        setIsLoading(true);
        await updateAccounts(accounts).then(()=>{
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
                        })
                }
                void getAccountsData().then(()=> {
                        setIsLoading(false);
                });
        })
}

        return (
                <Card border style={{width: '100%', flex: '2'}} className={cnMixSpace({mT: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        <Text view="brand" size="l" weight="semibold">Счета</Text>
                                        <Layout direction="row">
                                                <Button
                                                        label={'Добавить'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setAccounts(prev => 
                                                                        [...prev, {accountId: undefined, name: undefined}]
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
                                                                updateAccountsData(accounts);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {(accounts?.length > 0) && !isLoading && (
                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} size="xs" align="left">ID</Text>
                                        <Text style={{width: '100%'}} size="xs" align="left">Наименование</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && accounts?.map((acc : TAccount) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        <TextField
                                                                value={acc?.accountId?.toString()}
                                                                size="s"
                                                                placeholder="ID"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                            setAccounts(prev => 
                                                                                prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                accountId: Number(value),
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setAccounts(prev => 
                                                                                        prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        accountId: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                style={{minWidth: '120px', maxWidth: '120px'}}
                                                                disabled
                                                        />
                                                        <TextField
                                                                value={acc?.name}
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите наименованование"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                            setAccounts(prev => 
                                                                                prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                name: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setAccounts(prev => 
                                                                                        prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
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
                                                                        size="s"
                                                                        onClick={()=>{
                                                                                if (!acc.accountId) {
                                                                                        setAccounts(prev => prev.filter(account => (accounts.indexOf(account) !== accounts.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteAccountData(acc.accountId)
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {(accounts?.length === 0 || !accounts) && !isLoading && (
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
export default Accounts