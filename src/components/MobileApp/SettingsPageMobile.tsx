
// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Card } from '@consta/uikit/Card';
import AccountsMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/AccountsMobile"
import WarehousesMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/WarehousesMobile";
import ContractorsMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/ContractorsMobile";
import DeliversMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/DeliversMobile";
import UsersMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/UsersMobile";
import { Text } from "@consta/uikit/Text";
import CategoriesMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/CategoriesMobile";
import { useEffect, useState } from "react";
import { getUserInfo } from "d:/ui-savvind/src/services/AuthorizationService";
import CurrenciesMobile from "d:/ui-savvind/src/components/MobileApp/SalesPageMobile/CurrenciesMobile";

// иконки

// собственные компоненты

// сервисы

const SettingsPageMobile = () => {
        const [role, setRole] = useState<string | undefined>(undefined);
        
                     useEffect(() => {
                                
                                const getUserInfoData = async () => {
                                        await getUserInfo().then((resp) => {
                                                setRole(resp.role);
                                        })
                                };
                                
                                void getUserInfoData();
                        }, []);

        return (
                        <Card style={{width: '100%'}} className={cnMixSpace({p: 's'})}>
                        {role === 'ADM' && (
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <Text size='2xl' view='brand' weight="semibold" align="left">Настройки системы</Text>
                                        <Layout direction="column" style={{width: '100%'}}>
                                                <AccountsMobile />
                                                <CategoriesMobile />
                                        </Layout>
                                        <CurrenciesMobile />
                                        <WarehousesMobile />
                                        <ContractorsMobile />
                                        <DeliversMobile />
                                        <UsersMobile />
                                </Layout>
                        )}
                        {role !== 'ADM' && (
                                <Text>Нет полномочий</Text>
                        )}
                                
                </Card>
        )
}
export default SettingsPageMobile