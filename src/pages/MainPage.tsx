import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"

// компоненты Consta
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Button } from "@consta/uikit/Button/index";
import { Tabs } from '@consta/uikit/Tabs';

// иконки
import { IconCalculator } from '@consta/icons/IconCalculator';
import { IconBackward } from '@consta/icons/IconBackward';
import { IconForward } from '@consta/icons/IconForward';
import { IconCards } from '@consta/icons/IconCards';
import { IconLineAndBarChart } from '@consta/icons/IconLineAndBarChart';
import { IconPaste } from '@consta/icons/IconPaste';
import { IconStorage } from '@consta/icons/IconStorage';
import { IconSettings } from '@consta/icons/IconSettings';
import { BarcodeOutlined } from "@ant-design/icons";
import { IconExit } from '@consta/icons/IconExit';
import { IconColoredEconomics } from '@consta/icons/IconColoredEconomics';
import { IconListNumbered } from '@consta/icons/IconListNumbered';

// собственные компоненты
import { DefaultTabs } from "../utils/types.ts";
import { concatUrl } from "../utils/urlUtils.ts";
import { routeTarget } from "../routers/routes.ts";
import { Card } from "@consta/uikit/Card/index";
import NoneclatureImage from "../assets/NoneclatureImage.tsx";
import SettingsImage from "../assets/SettingsImage.tsx";
import PurchaseImage from "../assets/PurchaseImage.tsx";
import RegistrationImage from "../assets/RegistrationImage.tsx";
import SalesImage from "../assets/SalesImage.tsx";
import AccountingImage from "../assets/AccountingImage.tsx";
import { Avatar } from "@consta/uikit/Avatar/index";
import { getUserInfo } from "../services/AuthorizationService.ts";
import { UserInfo } from "../services/AuthorizationService.ts";


// сервисы

const pages : DefaultTabs[] = [
                {
                        id: 0,
                        label: 'Номенклатура',
                        navTo: routeTarget.nomenclature,
                        leftIcon: IconCards
                },
                {
                        id: 1,
                        label: 'Закупка',
                        navTo: routeTarget.product_purchase,
                        leftIcon: IconPaste,
                },
                {
                        id: 2,
                        label: 'Опр. товара',
                        navTo: routeTarget.product_registration,
                        leftIcon: BarcodeOutlined,
                },
                {
                        id: 3,
                        label: 'Склады',
                        navTo: routeTarget.product_warehouse,
                        leftIcon: IconStorage,
                },
                {
                        id: 4,
                        label: 'Продажи',
                        navTo: routeTarget.sales,
                        leftIcon: IconLineAndBarChart,
                },
                {
                        id: 5,
                        label: 'Аналитика',
                        navTo:  routeTarget.analytics,
                        leftIcon: IconColoredEconomics,
                },
                {
                        id: 6,
                        label: 'Бухгалтерия',
                        navTo:  routeTarget.accounting,
                        leftIcon: IconCalculator,
                },
                {
                        id: 7,
                        label: 'Настройки',
                        navTo: routeTarget.settings,
                        leftIcon: IconSettings,
                },
                 {
                        id: 8,
                        label: 'История',
                        navTo: routeTarget.history,
                        leftIcon: IconListNumbered,
                },

        ]

const MainPage = () => {
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

        const [isOpenMenu, setIsOpenMenu] = useState<boolean>(true);
        const [user, setUser] = useState<UserInfo | undefined>(undefined);
                
        useEffect(() => {
                const getUserInfoData = async () => {
                        await getUserInfo().then((resp) => {
                                setUser(resp);
                        })
                };
                
                void getUserInfoData();
        }, []);
        

        return (
                <div>
                        <Layout direction="row" className={cnMixSpace({mT: 's'})}>
                                
                                        <Layout direction="column" style={{ height: '100%', borderRight: '3px solid #56b9f2', transition: 'width 0.3s ease'}} >
                                                {isOpenMenu ? (
                                                        <Layout direction="column" style={{ maxWidth: '200px', minWidth: '200px' }}>
                                                                <Button 
                                                                label={"Скрыть меню"} 
                                                                iconLeft={IconBackward} 
                                                                onClick={()=>{setIsOpenMenu(false)}} 
                                                                size='s' 
                                                                view="ghost" 
                                                                className={cnMixSpace({mH: 's'})}
                                                                />
                                                                <Text view="primary" weight="bold" size="l" className={cnMixSpace({mL: 's', mT: 'm'})}>
                                                                        Сервисы
                                                                </Text>
                                                                <Tabs 
                                                                        items={pages}
                                                                        value={activePage}
                                                                        onChange={(item)=>{
                                                                                goNavigate(item.navTo);
                                                                                setActivePage(item);
                                                                        }}
                                                                        linePosition="left"
                                                                        getItemLabel={(item)=>item.label} 
                                                                        view="bordered"
                                                                        className={cnMixSpace({mT: 's', mH: 's'})}
                                                                />
                                                                <Layout direction="row" className={cnMixSpace({mT: '2xl', mL: 's'})} style={{alignItems: 'center', justifyContent: 'left'}}>
                                                                        <Avatar name={user?.username} className={cnMixSpace({mR: 'xs'})}/>
                                                                        <Text view="secondary" weight="semibold">{user?.username}</Text>
                                                                </Layout>
                                                                <Button 
                                                                        label={'Выйти из системы'}
                                                                        onClick={()=>{
                                                                                localStorage.removeItem('token');
                                                                                window.location.reload();
                                                                        }}
                                                                        view="primary"
                                                                        className={cnMixSpace({mT: 's', mH: 's'})}
                                                                        iconLeft={IconExit}
                                                                        size="s"
                                                                />
                                                                
                                                        </Layout>
                                                
                                                ) : (
                                                        <Layout direction="column" style={{ maxWidth: '60px', minWidth: '60px' }}>
                                                                <Button 
                                                                                iconLeft={IconForward} 
                                                                                onClick={()=>{setIsOpenMenu(true)}} 
                                                                                size='s' 
                                                                                view="ghost" 
                                                                                className={cnMixSpace({mH: 's'})}
                                                                        />
                                                                        <div style={{ height: 37}}/>
                                                                <Tabs 
                                                                        items={pages}
                                                                        value={activePage}
                                                                        onChange={(item)=>{
                                                                                goNavigate(item.navTo);
                                                                                setActivePage(item);
                                                                        }}
                                                                        linePosition="left"
                                                                        getItemLabel={(item)=>item.label} 
                                                                        view="bordered"
                                                                        className={cnMixSpace({mT: 's', mH: 's'})}
                                                                        onlyIcon
                                                                />
                                                        </Layout>   
                                                )}
                                        </Layout>
                                {activePage ? (
                                        <Layout style={{ width: isOpenMenu ? 'calc(100% - 222px)' : 'calc(100% - 72px)'}}>
                                                <Outlet />          
                                        </Layout>
                                ) : (
                                        <Layout style={{ width: isOpenMenu ? 'calc(100% - 222px)' : 'calc(100% - 72px)'}}>
                                                <Layout direction="column">
                                                        <Layout direction="row" >
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.settings);
                                                                                setActivePage(pages[6]);
                                                                        }}
                                                                >
                                                                        <SettingsImage/>
                                                                        <Text view="link" weight="semibold">Настройки</Text>
                                                                </Card>
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.nomenclature);
                                                                                setActivePage(pages[0]);
                                                                        }}
                                                                >
                                                                        <NoneclatureImage/>
                                                                        <Text view="link" weight="semibold">Номенклатура</Text>
                                                                </Card>
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.product_purchase);
                                                                                setActivePage(pages[1]);
                                                                        }}
                                                                >
                                                                        <PurchaseImage/>
                                                                        <Text view="link" weight="semibold">Закупка</Text>
                                                                </Card>
                                                        </Layout>
                                                        <Layout direction="row">
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.product_registration);
                                                                                setActivePage(pages[2]);
                                                                        }}
                                                                >
                                                                        <RegistrationImage/>
                                                                        <Text view="link" weight="semibold">Оприходование товаров</Text>
                                                                </Card>
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.sales);
                                                                                setActivePage(pages[4]);
                                                                        }}
                                                                >
                                                                        <SalesImage/>
                                                                        <Text view="link" weight="semibold">Продажи</Text>
                                                                </Card>
                                                                <Card 
                                                                        style={{height: 'fit-content'}} 
                                                                        className={cnMixSpace({p:'m', m: '3xl'}) + ' CardIcon'}
                                                                        onClick={()=> {
                                                                                goNavigate(routeTarget.accounting);
                                                                                setActivePage(pages[5]);
                                                                        }}
                                                                >
                                                                        <AccountingImage/>
                                                                        <Text view="link" weight="semibold">Бухгалтерия</Text>
                                                                </Card>
                                                                
                                                        </Layout>
                                                </Layout>        
                                        </Layout>
                                )}
                                

                                
                                   

                        </Layout>
                </div>
                
                
        )
}
export default MainPage