import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"

// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { cnMixSpace } from '@consta/uikit/MixSpace';

// иконки
import { IconCalculator } from '@consta/icons/IconCalculator';
import { IconCards } from '@consta/icons/IconCards';
import { IconSettings } from '@consta/icons/IconSettings';

// собственные компоненты
import { DefaultTabs } from "../../utils/types.ts";
import { concatUrl } from "../../utils/urlUtils.ts";
import { routeTarget } from "../../routers/routes.ts";

import { getUserInfo } from "../../services/AuthorizationService.ts";
import { UserInfo } from "../../services/AuthorizationService.ts";
import { Button } from "@consta/uikit/Button/index";
import { Avatar } from "@consta/uikit/Avatar/index";
import { DollarOutlined, LineChartOutlined, ReadOutlined, SettingOutlined, ShopOutlined } from "@ant-design/icons";
import { AntIcon } from "../../utils/AntIcon.ts";
import { cnMixFontSize } from "../../utils/MixFontSize.ts";

// сервисы

const pages : DefaultTabs[] = [
                
                
                {
                        id: 0,
                        label: 'Аналитика',
                        navTo:  routeTarget.analytics,
                        leftIcon: LineChartOutlined,
                },
                {
                        id: 1,
                        label: 'Продажи',
                        navTo: routeTarget.sales,
                        leftIcon: DollarOutlined,
                },
                {
                        id: 2,
                        label: 'Номенклатура',
                        navTo: routeTarget.nomenclature,
                        leftIcon: IconCards
                },
                {
                        id: 3,
                        label: 'Бухгалтерия',
                        navTo:  routeTarget.accounting,
                        leftIcon: IconCalculator,
                },
                {
                        id: 4,
                        label: 'Настройки',
                        navTo: routeTarget.settings,
                        leftIcon: IconSettings,
                },

        ]

const MainPageMobile = () => {
        const navigate = useNavigate()
        

        const goNavigate = (navTo: string) => {
                navigate(concatUrl([routeTarget.main, navTo]));
            };

        const [activePage, setActivePage] = useState<DefaultTabs | null>(null);
       

        useEffect(() => {
                const currentPath = window.location.pathname;

                
                const currentPage = pages.find(page =>  currentPath.includes(page.navTo) );

                if (currentPage) {
                        setActivePage(currentPage);
                }
            }, []);

        
        const [user, setUser] = useState<UserInfo | undefined>(undefined);
                
        useEffect(() => {
                
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp);
                        })
                };
                
                void getUserInfoData();
        }, [user?.role, user?.username]);
       
        
        
        useEffect(() => {
                const getUserInfoData = async () => {
                        await getUserInfo()
                };
                
                void getUserInfoData();
        }, [user?.role, user?.username]);
        

        return (
                <div>
                        <Layout direction="column" >
                                <Layout direction="row" className={cnMixSpace({p: 'xs'})} style={{justifyContent: 'space-between', borderBottom: '1px solid var(--color-typo-brand)', alignItems: 'center'}}>
                                        <Layout direction="row"  style={{alignItems: 'center', justifyContent: 'left'}}>
                                                <Text view="brand" size="xs" weight="semibold" className={cnMixSpace({mL: 'xs'})}>ERP-ELECTRONICS</Text>
                                        </Layout>
                                        <Layout direction="row"  style={{alignItems: 'center', justifyContent: 'right'}}>
                                                <Text size="2xs" view="secondary" weight="semibold" className={cnMixSpace({mR: 'xs'})}>{user?.username}</Text>
                                                <Avatar size="s" name={user?.username} />
                                        </Layout>
                                </Layout>
                                <Layout 
                                        direction="row" 
                                        className={cnMixSpace({p: 'xs'})} 
                                        style={{justifyContent: 'space-between', borderBottom: '1px solid var(--color-typo-brand)', alignItems: 'center'}}
                                >
                                        <Button
                                                iconLeft={AntIcon.asIconComponent(() => (
                                                        <LineChartOutlined 
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ))}
                                                onClick={()=>{
                                                        goNavigate(routeTarget.analytics);
                                                        setActivePage(pages[0]);
                                                }}
                                                form="round"
                                                view={activePage?.id === 0 ? 'primary' : 'ghost'}
                                        />
                                        <Button
                                                iconLeft={AntIcon.asIconComponent(() => (
                                                        <DollarOutlined 
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ))}
                                                onClick={()=>{
                                                        goNavigate(routeTarget.sales);
                                                        setActivePage(pages[1]);
                                                }}
                                                form="round"
                                                view={activePage?.id === 1 ? 'primary' : 'ghost'}
                                        />
                                        <Button
                                                iconLeft={AntIcon.asIconComponent(() => (
                                                        <ShopOutlined
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ))}
                                                onClick={()=>{
                                                        goNavigate(routeTarget.nomenclature);
                                                        setActivePage(pages[2]);
                                                }}
                                                form="round"
                                                view={activePage?.id === 2 ? 'primary' : 'ghost'}
                                        />
                                        <Button
                                                iconLeft={AntIcon.asIconComponent(() => (
                                                        <ReadOutlined
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ))}
                                                onClick={()=>{
                                                        goNavigate(routeTarget.accounting);
                                                        setActivePage(pages[3]);
                                                }}
                                                form="round"
                                                view={activePage?.id === 3 ? 'primary' : 'ghost'}
                                        />
                                        <Button
                                                iconLeft={AntIcon.asIconComponent(() => (
                                                        <SettingOutlined
                                                                className={cnMixFontSize('l')}
                                                        />
                                                ))}
                                                onClick={()=>{
                                                        goNavigate(routeTarget.settings);
                                                        setActivePage(pages[4]);
                                                }}
                                                form="round"
                                                view={activePage?.id === 4 ? 'primary' : 'ghost'}
                                        />
                                </Layout>
                                <Outlet/>
                        </Layout>
                </div>
                
                
        )
}
export default MainPageMobile