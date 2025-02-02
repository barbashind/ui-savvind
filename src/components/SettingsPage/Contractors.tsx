import { useEffect, useState } from "react"

// компоненты Consta
import { Button } from "@consta/uikit/Button"
import { Card } from "@consta/uikit/Card"
import { Layout } from "@consta/uikit/Layout"
import { Text } from "@consta/uikit/Text"
import { Loader } from "@consta/uikit/Loader"
import { Combobox } from "@consta/uikit/Combobox"
import { TextField } from "@consta/uikit/TextField"
import { cnMixSpace } from "@consta/uikit/MixSpace"

// иконки
import { SaveOutlined } from "@ant-design/icons"
import { IconAdd } from "@consta/icons/IconAdd";
import { IconRevert } from "@consta/icons/IconRevert";
import { IconTrash } from "@consta/icons/IconTrash"

// собственные компоненты
import { cnMixFontSize } from "../../utils/MixFontSize"
import { AntIcon } from "../../utils/AntIcon"
import { TAccount, TContractor } from "../../types/settings-types"
import { getContractors } from "../../services/PurchaseService"
import { deleteContractor, getAccounts, updateContractors } from "../../services/SettingsService"


// сервисы


const Contractors = () => {
        
const [contractors, setContractors] = useState<TContractor[]>([]);
const [accounts, setAccounts] = useState<TAccount[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

// Инициализация данных
useEffect(() => {
        const getContractorsData = async () => {
                await getContractors((resp) => {
                        setContractors(resp.map((item : TContractor) => ({contractorId: item.contractorId, contractor: item.contractor, account: item.account})))
                        
                })
        }
        const getAccountsData = async () => {
                await getAccounts((resp) => {
                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
                        
                })
        }
        void getAccountsData();
        void getContractorsData().then(()=> {
                        setIsLoading(false);
                });
}, [])

const refreshAccountsData = async () => {
        await getAccounts((resp) => {
                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name})))
        })
}

const deleteContractorData = async (contractorId: number | undefined) => {
        setIsLoading(true);
        await deleteContractor(contractorId).then(()=>{
                const getContractorsData = async () => {
                        await getContractors((resp) => {
                                setContractors(resp.map((item : TContractor) => ({contractorId: item.contractorId, contractor: item.contractor, account: item.account})))
                        });
                }
                void getContractorsData().then(()=> {
                        setIsLoading(false);
                });;
        })
}

const updateContractorData = async (contractors : TContractor[]) => {
        setIsLoading(true);
        await updateContractors(contractors).then(()=>{
                const getContractorsData = async () => {
                        await getContractors((resp) => {
                                setContractors(resp.map((item : TContractor) => ({contractorId: item.contractorId, contractor: item.contractor, account: item.account})))
                        });
                }
                void getContractorsData().then(()=> {
                        setIsLoading(false);
                });;
        })
}


        return (
                <Card border style={{width: '100%'}} className={cnMixSpace({mT: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        <Text view="brand" size="l" weight="semibold">Поставщики</Text>
                                        <Layout direction="row">
                                                <Button
                                                        iconLeft={IconRevert}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                refreshAccountsData();
                                                        }}
                                                        size="s"
                                                        className={cnMixSpace({mR: 'm'})}
                                                        title="Обновить список счетов"
                                                />
                                                <Button
                                                        label={'Добавить'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setContractors(prev => 
                                                                        [...prev, {contractorId: undefined, contractor: undefined, account: undefined}]
                                                                )
                                                        }}
                                                        size="s"
                                                        className={cnMixSpace({mR: 'm'})}
                                                />
                                                <Button
                                                        label={'Сохранить'}
                                                        iconLeft={AntIcon.asIconComponent(() => (
                                                                <SaveOutlined
                                                                className={cnMixFontSize('m')+ ' ' + cnMixSpace({mR:'xs'})}
                                                                />
                                                        ))}
                                                        view="primary"
                                                        size="s"
                                                        onClick={() => {
                                                                updateContractorData(contractors);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {(contractors?.length > 0) && !isLoading && (
                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        <Text style={{minWidth: '120px', maxWidth: '120px'}} className={cnMixSpace({mR:'m'})} size="xs" align="left">ID</Text>
                                        <Text style={{width: '100%'}} size="xs" align="left">Наименование</Text>
                                        <Text style={{minWidth: '200px', maxWidth: '200px'}} className={cnMixSpace({mL:'m'})} size="xs" align="left">Счет</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                
                                <Layout direction="column">
                                        {!isLoading && contractors?.map((acc : TContractor) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        <TextField
                                                                value={acc?.contractorId?.toString()}
                                                                size="s"
                                                                placeholder="ID"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setContractors(prev => 
                                                                                prev.map(account => (contractors.indexOf(account) === contractors.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                contractorId: Number(value),
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setContractors(prev => 
                                                                                        prev.map(account => (contractors.indexOf(account) === contractors.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        contractorId: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                style={{minWidth: '120px', maxWidth: '120px'}}
                                                                disabled
                                                        />
                                                        <TextField
                                                                value={acc?.contractor}
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите наименованование"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setContractors(prev => 
                                                                                prev.map(account => (contractors.indexOf(account) === contractors.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                contractor: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setContractors(prev => 
                                                                                        prev.map(account => (contractors.indexOf(account) === contractors.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        contractor: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                                className={cnMixSpace({mL:'m'})}
                                                        />
                                                        <Combobox
                                                                items={accounts}
                                                                getItemLabel={(item)=> (item.name ?? '')}
                                                                getItemKey={(item) => (item.accountId ?? 0)}
                                                                value={accounts.find(el => (el.name === acc?.account))}
                                                                size="s"
                                                                style={{minWidth: '200px', maxWidth: '200px'}}
                                                                placeholder="Выберите счет"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setContractors(prev => 
                                                                                prev.map(elem => (contractors.indexOf(elem) === contractors.indexOf(acc)) ? 
                                                                                        { ...elem, 
                                                                                                account: value.name,
                                                                                        } : elem
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setContractors(prev => 
                                                                                        prev.map(elem => (contractors.indexOf(elem) === contractors.indexOf(acc)) ? 
                                                                                                { ...elem, 
                                                                                                        account: undefined,
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
                                                                                if (!acc.contractorId) {
                                                                                        setContractors(prev => prev.filter(account => (contractors.indexOf(account) !== contractors.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteContractorData(acc.contractorId);
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {(contractors?.length === 0 || !contractors) && !isLoading && (
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
export default Contractors