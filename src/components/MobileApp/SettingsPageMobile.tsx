
// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Card } from '@consta/uikit/Card';
import { Text } from "@consta/uikit/Text";
import { useEffect, useState } from "react";
import AccountsMobile from './SettingsPageMobile/AccountsMobile';
import CategoriesMobile from './SettingsPageMobile/CategoriesMobile';
import CurrenciesMobile from './SettingsPageMobile/CurrenciesMobile';
import WarehousesMobile from './SettingsPageMobile/WarehousesMobile';
import ContractorsMobile from './SettingsPageMobile/ContractorsMobile';
import DeliversMobile from './SettingsPageMobile/DeliversMobile';
import UsersMobile from './SettingsPageMobile/UsersMobile';
import { getUserInfo } from '../../services/AuthorizationService';

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
                                <Layout direction="column" style={{width: '100%'}} >
                                        <Text size='m' view='brand' weight="semibold" align="left">Настройки системы</Text>
                                        <AccountsMobile />
                                        <CategoriesMobile />
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