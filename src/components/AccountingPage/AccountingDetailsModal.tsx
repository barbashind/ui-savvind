 
import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { IconClose } from '@consta/icons/IconClose';

import { TAccounting } from "../../types/accounting-types.ts";
import { addAccounting, getAccounting, updateAccounting } from "../../services/AccountingService";
// import { Combobox } from "@consta/uikit/Combobox"
import { getAccounts, getCategories } from "../../services/SettingsService.ts";
import { TAccount, TCategory } from "../../types/settings-types.ts";
import { Combobox } from "@consta/uikit/Combobox/index";
import { TextField } from "@consta/uikit/TextFieldCanary/index";
import NumberMaskTextField from "../../utils/NumberMaskTextField.tsx";
import { getUserInfo } from "../../services/AuthorizationService.ts";
import { DatePicker } from "@consta/uikit/DatePicker/index";





interface TAccountingDetailsModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        id: number | undefined;
        setId: React.Dispatch<React.SetStateAction<number | undefined>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const AccountingDetailsModal = ({isOpen, setIsOpen, id, setId,  setUpdateFlag} : TAccountingDetailsModalProps) => {
        const defaultData : TAccounting = {
                id: undefined,
                accountFrom: undefined,
                accountTo: undefined,
                justification: undefined,
                form: undefined,
                isDraft: undefined,
                value: undefined,
                category: undefined,
                createdAt: null,
                updatedAt: null,
        }

        const closeWindow = () => {
                setData(defaultData);
                setIsOpen(false);
                setId(undefined);
        }
        const [data, setData] = useState<TAccounting>(defaultData);
        const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);
        const [accounts, setAccounts] = useState<TAccount[]>([]);
        const [categories, setCategories] = useState<TCategory[]>([]);

        const [role, setRole] = useState<string | undefined>(undefined);
        const [user, setUser] = useState<string | undefined>(undefined);
                
        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setRole(resp.role);
                                setUser(resp.username);
                        })
                };
                
                void getUserInfoData();
        }, []);

        // Инициализация данных выпадающих списков
        useEffect(() => {
                const getAccountsData = async () => {
                        await getAccounts((resp) => {
                                if (role === 'KUR') {
                                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, currency: item.currency})).filter((item)=>(item.name === 'Деньги в офисе')))
                                } else {
                                        setAccounts(resp.map((item : TAccount) => ({accountId: item.accountId, name: item.name, currency: item.currency})))
                                }
                                
                                
                        })
                }
                const getCategoriesData = async () => {
                        await getCategories((resp) => {
                                setCategories(resp.map((item : TCategory) => ({id: item.id, name: item.name})))
                                
                        })
                }
                void getAccountsData();
                void getCategoriesData();
        }, [role])
        // Инициализация данных записи
        useEffect(() => {
                if (id) {
                        setIsLoading(true);
                } else {
                        setIsLoading(false);
                }
        }, [id, isOpen, setIsLoading]);

        useEffect(() => {
                const getAccountingData = async () => {
                        try {
                            if (id) {
                                await getAccounting(id, (resp) => {
                                    setData({...resp, createdAt: resp.createdAt ? new Date(resp.createdAt) : null});
                                    setIsLoading(false);
                                });
                            }
                        } catch (errorResponse: unknown) {
                                console.log(errorResponse);
                        }
                    };
                    void getAccountingData();                
            }, [id, setData, isOpen]);


        const createAccounting = async (e: React.MouseEvent<Element, MouseEvent>) => {
                        e.preventDefault();
                        const updatedData = {...data, author: user}
                        await addAccounting(updatedData).then(
                               () => { 
                                setUpdateFlag(true);
                                closeWindow();
                                }
                        );
                }
        
        const updateAccountingData = async (e: React.MouseEvent<Element, MouseEvent>, id: number | undefined) => {
                        e.preventDefault();
                        await updateAccounting( id, data).then(
                               () => { 
                                setUpdateFlag(true);
                                closeWindow();
                                }
                        );
                }
                
        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onEsc={() => {
                                closeWindow();
                        }}
                        style={{width: '75%'}}
                >
                        {!isLoading && (
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xl' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Layout direction="row" >
                                                <Text size="xl" view="brand" style={{width: '100%'}}  className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                        {id ? 'Транзакция ' +  data.id?.toString() : 'Новая транзакция'}
                                                </Text>
                                        </Layout>
                                        
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        closeWindow()
                                                }}
                                        />
                                </Layout>

                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        <Text size="s" style={{minWidth: '200px', maxWidth: '200px'}} className={cnMixSpace({mR:'m'})}>Счет списания</Text>
                                        <Text size="s" style={{minWidth: '200px', maxWidth: '200px'}} className={cnMixSpace({mR:'m'})}>Счет пополнения</Text>
                                        <Text size="s" style={{width: '100%', minWidth: '150px'}} >Обоснование</Text>
                                        <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} className={cnMixSpace({mH:'m'})}>Категория</Text>
                                        <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} className={cnMixSpace({mR:'m'})}>Объем</Text>
                                        <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} className={cnMixSpace({mR:'m'})}>Дата создания</Text>
                                        {/* <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}}>Форма</Text> */}
                                </Layout>
                                <Layout direction="row" className={cnMixSpace({mT:'xs'})}>
                                        <Combobox
                                                items={accounts}
                                                getItemLabel={(item)=> (item.name ?? '')}
                                                getItemKey={(item) => (item.accountId ?? 0)}
                                                value={accounts.find(el => (el.name === data?.accountFrom))}
                                                size="s"
                                                style={{minWidth: '200px', maxWidth: '200px'}}
                                                placeholder="Выберите счет"
                                                onChange={(value) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, accountFrom: value?.name, currency: value?.currency}))
                                                        } else {
                                                                setData(prev => ({...prev, accountFrom: undefined, currency: undefined}))
                                                        }
                                                }}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={!!data.id}
                                        />
                                        <Combobox
                                                items={accounts}
                                                getItemLabel={(item)=> (item.name ?? '')}
                                                getItemKey={(item) => (item.accountId ?? 0)}
                                                value={accounts.find(el => (el.name === data?.accountTo))}
                                                size="s"
                                                style={{minWidth: '200px', maxWidth: '200px'}}
                                                placeholder="Выберите счет"
                                                onChange={(value) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, accountTo: value?.name, currency: value?.currency}))
                                                        } else {
                                                                setData(prev => ({...prev, accountTo: undefined, currency: undefined}))
                                                        }
                                                }}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={!!data.id}
                                                caption={(data.accountFrom === data.accountTo && !!data.accountFrom)? 'Счета совпадают' : (accounts.find(el => (el.name === data?.accountFrom))?.currency !== accounts.find(el => (el.name === data?.accountTo))?.currency && !!data.accountFrom && !!data.accountTo) ? 'Валюта отличается' : undefined }
                                                status={((data.accountFrom === data.accountTo && !!data.accountFrom) || (accounts.find(el => (el.name === data?.accountFrom))?.currency !== accounts.find(el => (el.name === data?.accountTo))?.currency && !!data.accountFrom && !!data.accountTo)) ? 'alert' : undefined}
                                        />
                                        <TextField 
                                                value={data.justification}
                                                onChange={(value) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, justification: value}))
                                                        } else {
                                                                setData(prev => ({...prev, justification: undefined}))
                                                        }
                                                }}
                                                size="s"
                                                style={{width: '100%', minWidth: '150px', maxHeight: '20px'}}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={data.category === 'Продажа товара' || data.category === 'Продажа товара контрагента'}
                                        />
                                        <Combobox
                                                items={categories}
                                                getItemLabel={(item)=> (item.name ?? '')}
                                                getItemKey={(item) => (item.id ?? 0)}
                                                value={categories.find(el => (el.name === data?.category))}
                                                size="s"
                                                style={{minWidth: '150px', maxWidth: '150px'}}
                                                placeholder="Выберите категорию"
                                                onChange={(value) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, category: value?.name}))
                                                        } else {
                                                                setData(prev => ({...prev, category: undefined}))
                                                        }
                                                }}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={data.category === 'Продажа товара' || data.category === 'Продажа товара контрагента'}
                                        />
                                       
                                        <NumberMaskTextField
                                                value={data.value?.toString()}
                                                onChange={(value : number) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, value: value}))
                                                        } else {
                                                                setData(prev => ({...prev, value: undefined}))
                                                        }
                                                 }}
                                                size={'s'}
                                                style={{minWidth: '150px', maxWidth: '150px', maxHeight: '20px'}}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={data.category === 'Продажа товара' || data.category === 'Продажа товара контрагента'}
                                         />
                                         <DatePicker
                                                value={data.createdAt}
                                                onChange={(value : Date | null) => {
                                                        if (value) {
                                                                const utcDate = (value);
                                                                utcDate.setUTCHours(0, 0, 0, 0); 
                                                                utcDate.setDate(value.getDate() + 1);
                                                                setData(prev => ({ ...prev, createdAt: utcDate }));
                                                        } else {
                                                                setData(prev => ({...prev, createdAt: null}))
                                                        }
                                                 }}
                                                size={'s'}
                                                style={{minWidth: '150px', maxWidth: '150px', maxHeight: '20px'}}
                                                className={cnMixSpace({mR:'m'})}
                                                disabled={data.category === 'Продажа товара' || data.category === 'Продажа товара контрагента'}
                                                />
                                          {/* <Select
                                                items={[{id: 'replenishment', label: 'Пополнение'}, {id: 'deduction', label: 'Расходы'}]}
                                                getItemLabel={(item)=> (item.label ?? '')}
                                                getItemKey={(item) => (item.id ?? 0)}
                                                value={{id: data.form, label: data.form === 'replenishment' ? 'Пополнение' :  'Расходы'} }
                                                size="s"
                                                style={{minWidth: '150px', maxWidth: '150px'}}
                                                placeholder="Выберите форму"
                                                onChange={(value) => {
                                                        if (value) {
                                                                setData(prev => ({...prev, form: value?.id}))
                                                        } else {
                                                                setData(prev => ({...prev, form: undefined}))
                                                        }
                                                }}
                                                className={cnMixSpace({mR:'m'})}
                                        /> */}

                                </Layout>

                               
                                
                                
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'end'}}  flex={1} className={cnMixSpace({ mT:'l' })}>
                                        <Layout direction="row" style={{justifyContent: 'right'}}>
                                                <Button 
                                                        label={'Отменить'}
                                                        view="secondary"
                                                        size="s"
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={()=>{
                                                                closeWindow();
                                                        }}
                                                />
                                                <Button 
                                                        label={'Сохранить'}
                                                        view="primary"
                                                        size="s"
                                                        disabled={((data.accountFrom === data.accountTo && !!data.accountFrom) || (accounts.find(el => (el.name === data?.accountFrom))?.currency !== accounts.find(el => (el.name === data?.accountTo))?.currency && !!data.accountFrom && !!data.accountTo) || (!data.value))}
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={(e)=>{
                                                                if (data.id) {
                                                                        updateAccountingData(e, data.id)
                                                                } else {
                                                                       createAccounting(e) 
                                                                }
                                                                closeWindow();
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                        </Layout>
                        )}
                        {isLoading && (
                                <Layout style={{ minHeight: '450px', alignItems: 'center', justifyContent: 'center'}}>
                                        <Loader size="m" />
                                </Layout>
                        )}
                </Modal>
        )
}
export default AccountingDetailsModal