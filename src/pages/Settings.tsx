

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';
import Accounts from "../components/SettingsPage/Accounts";
import Warehouses from "../components/SettingsPage/Warehouses";
import Contractors from "../components/SettingsPage/Contractors";
import Delivers from "../components/SettingsPage/Delivers";
import Users from "../components/SettingsPage/Users";
import { Text } from "@consta/uikit/Text";
import Categories from "../components/SettingsPage/Categories";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/AuthorizationService";

// собственные компоненты



const Settings = () => {

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
                                        <Layout direction="row" style={{width: '100%'}}>
                                                <Accounts />
                                                <Categories />
                                        </Layout>
                                        <Warehouses />
                                        <Contractors />
                                        <Delivers />
                                        <Users />
                                </Layout>
                        )}
                        {role !== 'ADM' && (
                                <Text>Нет полномочий</Text>
                        )}
                                
                </Card>

        )
}
export default Settings;