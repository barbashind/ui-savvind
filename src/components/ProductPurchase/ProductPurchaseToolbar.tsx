import React from "react"

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { cnMixSpace } from "@consta/uikit/MixSpace";

// иконки
import { IconAdd } from '@consta/icons/IconAdd';
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter';

export interface TPurchaseToolbarProps {
        setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductPurchaseToolbar = ({setIsEditModalOpen, setIsFilterModalOpen} : TPurchaseToolbarProps) => {


        return (
                <Layout direction="row" style={{ justifyContent: 'space-between', borderBottom: '2px solid #56b9f2'}} className={cnMixSpace({mB: 'm', p:'m'})} >
                        <Layout direction="row">
                                <Text size='2xl' weight="semibold" view="brand" >
                                        Закупка товара
                                </Text>
                        </Layout>
                        <Layout direction="row">
                                <Button size='s' view='secondary' label={'Добавить'} iconLeft={IconAdd} onClick={()=>{setIsEditModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                                <Button size='s' view='secondary' iconLeft={IconSortDownCenter} title="Фильтр" onClick={()=>{setIsFilterModalOpen(true)}} className={cnMixSpace({mL: 's'})}/>
                        </Layout>
                        
                </Layout>
        )
}
export default ProductPurchaseToolbar