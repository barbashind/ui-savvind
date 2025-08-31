 
import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';


import { getAccounts } from "../../services/SettingsService.ts";
import { TAccount } from "../../types/settings-types.ts";
import { Combobox } from "@consta/uikit/Combobox/index";
import { TextField } from "@consta/uikit/TextField/index";
import TextHighlith from "../global/TextHighlith.tsx";
import { getUserInfo } from "../../services/AuthorizationService.ts";





interface TAccountingAccModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }

const AccountingAccModal = ({isOpen, setIsOpen} : TAccountingAccModalProps) => {
        

        const closeWindow = () => {
                setIsOpen(false);
        }

const [accounts, setAccounts] = useState<TAccount[]>([]);
const [accountsDef, setAccountsDef] = useState<TAccount[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [currencies, setCurrencies] = useState<(string | undefined)[]>([]);
const [currency, setCurrency] = useState<string | undefined>(undefined);
const [searchText, setSearchText] = useState<string | null>(null);

const [user, setUser] = useState<string | undefined>(undefined);
                
// Инициализация данных
useEffect(() => {
        setIsLoading(true);
        const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp.username);
                        })
                };
                
        void getUserInfoData();
        const getAccountsData = async () => {
                await getAccounts((resp) => {
                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, value: item.value, currency: item.currency})))
                        setAccountsDef(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, value: item.value, currency: item.currency})))
                        setCurrencies([...new Set(resp.map((item: TAccount) => item.currency))]);
                })
        }
        


        void getAccountsData().then(()=> {
                setIsLoading(false);
        });
}, [isOpen])

useEffect(() => {
        setAccounts((prev) => prev.filter(item => item.currency === currency))
}, [currency])

useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText) {
                setAccounts((prev) => prev.filter(item => item.name && item.name.toLowerCase().includes(searchText.toLowerCase())))
            } else {
                setAccounts(accountsDef);
            }
        }, 1000); // 1000 миллисекунд = 1 секунда

        return () => clearTimeout(timer); // Очистка таймера при изменении searchText
    }, [accountsDef, setAccounts, searchText]);


                
        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onEsc={() => {
                                closeWindow();
                        }}
                        style={{width: '50%'}}
                >
                        <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        <Text view="brand" size="l" weight="semibold">Счета</Text>
                                        <Layout direction="row">
                                                <TextField 
                                                        placeholder="Введите для поиска"
                                                        size="s"
                                                        style={{ minWidth: '250px'}}
                                                        className={cnMixSpace({mR: 's'})}
                                                        value={searchText}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setSearchText(value);
                                                                } else {
                                                                        setSearchText(null);
                                                                }
                                                        }}
                                                />
                                                <Combobox
                                                        items={currencies}
                                                        size="s"
                                                        placeholder="Выберите валюту"
                                                        value={currency} 
                                                        style={{ minWidth: '200px'}}
                                                        multiple={false}
                                                        getItemLabel={(item: string | undefined) => item ?? ''}
                                                        getItemKey={(item: string | undefined) => item ?? ''}
                                                        onChange={(value)=>{
                                                                if (value) {
                                                                        setCurrency(value)       
                                                                } else {
                                                                        setCurrency(undefined)
                                                                        setAccounts(accountsDef)  
                                                                }
                                                        }}
                                                /> 
                                                <Button
                                                        label={'Закрыть'}
                                                        view="secondary"
                                                        size="s"
                                                        onClick={()=>{
                                                                closeWindow();
                                                        }}
                                                        className={cnMixSpace({mL:'m'})}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {(accounts?.length > 0) && !isLoading && (
                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} className={cnMixSpace({ mL:'s'})} size="xs" align="left" view="secondary">ID</Text>
                                        <Text style={{width: '100%'}} size="xs" align="left" view="secondary">Наименование</Text>
                                        <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} size="xs" align="left" view="secondary">Объём (руб)</Text>
                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} className={cnMixSpace({ mL:'s', mR:'m'})} size="xs" align="left" view="secondary">Валюта</Text>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && user !== 'Matvei' && accounts?.map((acc : TAccount) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's', p:'s'})} style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px'}}>
                                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} size="s">{acc?.accountId?.toString()}</Text>
                                                        <Text style={{width: '100%'}} size="s">{TextHighlith(acc?.name, searchText)}</Text>
                                                        <Text style={{minWidth: '150px', maxWidth: '150px'}} size="s">{acc.value?.toString()}</Text>
                                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} size="s" className={cnMixSpace({mL: 's'})}>{acc?.currency}</Text>
                                                </Layout>
                                        ))}
                                        {!isLoading && user === 'Matvei' && accounts?.filter((el) => (el.name !== 'Матвей Старцев'))?.map((acc : TAccount) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's', p:'s'})} style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px'}}>
                                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} size="s">{acc?.accountId?.toString()}</Text>
                                                        <Text style={{width: '100%'}} size="s">{TextHighlith(acc?.name, searchText)}</Text>
                                                        <Text style={{minWidth: '150px', maxWidth: '150px'}} size="s">{acc.value?.toString()}</Text>
                                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} size="s" className={cnMixSpace({mL: 's'})}>{acc?.currency}</Text>
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
                </Modal>
        )
}
export default AccountingAccModal