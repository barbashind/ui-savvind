 
import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { SaveOutlined } from "@ant-design/icons"

import { getAccounts, updateAccounts } from "../../services/SettingsService.ts";
import { TAccount } from "../../types/settings-types.ts";
import NumberMaskTextField from "../../utils/NumberMaskTextField.tsx";
import { AntIcon } from "../../utils/AntIcon.ts";
import { cnMixFontSize } from "../../utils/MixFontSize.ts";





interface TAccountingAccModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }

const AccountingAccModal = ({isOpen, setIsOpen} : TAccountingAccModalProps) => {
        

        const closeWindow = () => {
                setIsOpen(false);
        }

const [accounts, setAccounts] = useState<TAccount[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

// Инициализация данных
useEffect(() => {
        setIsLoading(true);
        const getAccountsData = async () => {
                await getAccounts((resp) => {
                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, value: item.value})))
                        
                })
        }
        void getAccountsData().then(()=> {
                setIsLoading(false);
        });
}, [isOpen])

const updateAccountsData = async (accounts : TAccount[]) => {
        setIsLoading(true);
        await updateAccounts(accounts).then(()=>{
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, value: item.value})))
                        })
                }
                void getAccountsData().then(()=> {
                        setIsLoading(false);
                });
        })
}
                
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
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && accounts?.map((acc : TAccount) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's', p:'s'})} style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px'}}>
                                                        <Text style={{minWidth: '50px', maxWidth: '50px'}} size="s">{acc?.accountId?.toString()}</Text>
                                                        <Text style={{width: '100%'}} size="s">{acc?.name}</Text>
                                                        <NumberMaskTextField
                                                                value={acc.value?.toString()}
                                                                onChange={(value : string | null) => {
                                                                        if (value) {
                                                                                setAccounts(prev => 
                                                                                    prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
                                                                                            { ...account, 
                                                                                                    value: Number(value),
                                                                                            } : account
                                                                                    )
                                                                                    );    
                                                                            } else {
                                                                                    setAccounts(prev => 
                                                                                            prev.map(account => (accounts.indexOf(account) === accounts.indexOf(acc)) ? 
                                                                                                    { ...account, 
                                                                                                        value: undefined,
                                                                                                    } : account
                                                                                            )
                                                                                            );   
                                                                            }
                                                                }}
                                                                style={{minWidth: '150px', maxWidth: '150px'}}
                                                                size='s'
                                                        />
                                                                
                                                        
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