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
import { TCategory } from "../../types/settings-types"
import { TextField } from "@consta/uikit/TextField"
import { IconTrash } from "@consta/icons/IconTrash"
import { cnMixSpace } from "@consta/uikit/MixSpace"
import { deleteCategory, getCategories, updateCategories } from "../../services/SettingsService"
import { Loader } from "@consta/uikit/Loader"

// сервисы


const Categories = () => {
        
const [categories, setCategories] = useState<TCategory[]>([]);

const [isLoading, setIsLoading] = useState<boolean>(true);

// Инициализация данных
useEffect(() => {
        const getCategoriesData = async () => {
                await getCategories((resp) => {
                        setCategories(resp.map((item : TCategory) => ({id: item.id, name: item.name})))
                        
                })
        }
        void getCategoriesData().then(()=> {
                setIsLoading(false);
        });
}, [])

const deleteCategoryData = async (accountId: number | undefined) => {
        setIsLoading(true);
        await deleteCategory(accountId).then(()=>{
                const getCategoriesData = async () => {
                        await getCategories((resp) => {
                                setCategories(resp.map((item : TCategory) => ({id: item.id, name: item.name})))
                                
                        })
                }
                void getCategoriesData().then(()=> {
                        setIsLoading(false);
                });
        })
}

const updateCategoriesData = async (categories : TCategory[]) => {
        setIsLoading(true);
        await updateCategories(categories).then(()=>{
                const getCategoriesData = async () => {
                        await getCategories((resp) => {
                                setCategories(resp.map((item : TCategory) => ({id: item.id, name: item.name})))
                                
                        })
                }
                void getCategoriesData().then(()=> {
                        setIsLoading(false);
                });
        })
}


        return (
                <Card border style={{width: '100%', flex: '1'}} className={cnMixSpace({mT: 'm', mL: 'm'})}>
                       <Layout direction="column" className={cnMixSpace({p: 'm'})}>
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems:'center'}}>
                                        <Text view="brand" size="l" weight="semibold">Категории транзакций</Text>
                                        <Layout direction="row">
                                                <Button
                                                        label={'Добавить'}
                                                        iconLeft={IconAdd}
                                                        view="secondary"
                                                        onClick={()=>{
                                                                setCategories(prev => 
                                                                        [...prev, {id: undefined, name: undefined}]
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
                                                                updateCategoriesData(categories);
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                {(categories?.length > 0) && !isLoading && (
                                <Layout direction="row" className={cnMixSpace({mT:'m'})}>
                                        <Text style={{width: '100%'}} size="xs" align="left">Наименование</Text>
                                        <div style={{minWidth: '40px', maxWidth: '40px'}}/>
                                </Layout>
                                )}
                                <Layout direction="column">
                                        {!isLoading && categories?.map((acc : TCategory) => (
                                                <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                                        <TextField
                                                                value={acc?.name}
                                                                size="s"
                                                                style={{width: '100%'}}
                                                                placeholder="Введите категорию"
                                                                onChange={(value)=>{
                                                                        if (value) {
                                                                                setCategories(prev => 
                                                                                prev.map(account => (categories.indexOf(account) === categories.indexOf(acc)) ? 
                                                                                        { ...account, 
                                                                                                name: value,
                                                                                        } : account
                                                                                )
                                                                                );    
                                                                        } else {
                                                                                setCategories(prev => 
                                                                                        prev.map(account => (categories.indexOf(account) === categories.indexOf(acc)) ? 
                                                                                                { ...account, 
                                                                                                        name: undefined,
                                                                                                } : account
                                                                                        )
                                                                                        );   
                                                                        }
                                                                        
                                                                }}
                                                        />
                                                        <div style={{minWidth: '40px', maxWidth: '40px'}}>
                                                                <Button
                                                                        iconLeft={IconTrash}
                                                                        view="clear"
                                                                        size="s"
                                                                        onClick={()=>{
                                                                                if (!acc.id) {
                                                                                        setCategories(prev => prev.filter(account => (categories.indexOf(account) !== categories.indexOf(acc))));  
                                                                                } else {
                                                                                        deleteCategoryData(acc.id)
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                </Layout>
                                        ))}
                                        {(categories?.length === 0 || !categories) && !isLoading && (
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
export default Categories;