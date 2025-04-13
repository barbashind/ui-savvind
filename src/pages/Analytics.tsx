

// компоненты Consta
import { Layout } from "@consta/uikit/Layout"
import { cnMixSpace } from "@consta/uikit/MixSpace/index"
import { Card } from '@consta/uikit/Card';
import { Text } from "@consta/uikit/Text";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/AuthorizationService";
import AnalyticToolbar from "../components/AnalyticsPage/AnalyticsToolbar";
import { TAnalyticFilter } from "../types/analytic-types";
import AnalyticData from "../components/AnalyticsPage/AnalyticsData";

// собственные компоненты



const Analytics = () => {
const defaultFilterValues = {
        users: null,
        startDate: null,
        endDate: null
}
const [role, setRole] = useState<string | undefined>(undefined);
const [updateFlag, setUpdateFlag] = useState<boolean>(false);
const [filterValues, setFilterValues] = useState<TAnalyticFilter>(defaultFilterValues);

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
                        {(role === 'ADM' || role === 'SLR') && (
                                <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({mL: 'm', p: 's'})}>
                                        <Text size='2xl' view='brand' weight="semibold" align="left">Аналитика</Text>
                                        <AnalyticToolbar
                                                filterValues={filterValues}
                                                setFilterValues={setFilterValues}
                                                setUpdateFlag={setUpdateFlag}
                                        />
                                        <AnalyticData
                                                filterValues={filterValues}
                                                setUpdateFlag={setUpdateFlag}
                                                updateFlag={updateFlag}
                                        />
                                </Layout>
                        )}
                        {role !== 'ADM' && role === 'SLR' && (
                                <Text>Нет полномочий</Text>
                        )}
                                
                </Card>

        )
}
export default Analytics;