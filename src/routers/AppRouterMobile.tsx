import { Navigate, Route, Routes } from "react-router-dom";

// ссылки
import { routeTarget } from "./routes.ts";

// страницы
import MainPageMobile from "../components/MobileApp/MainPageMobile.tsx";
import { concatUrl } from "../utils/urlUtils.ts";
import AnalyticsPageMobile from "../components/MobileApp/AnalyticsPageMobile.tsx";
import SalesPageMobile from "../components/MobileApp/SalesPageMobile.tsx";
import ProductsPageMobile from "../components/MobileApp/ProductsPageMobile.tsx";
import AccountingPageMobile from "../components/MobileApp/AccountingPageMobile.tsx";
import SettingsPageMobile from "../components/MobileApp/SettingsPageMobile.tsx";


const AppRouter = () => {
        return (
                <Routes>
                        <Route element={<MainPageMobile  />} path={routeTarget.main}>
                                <Route element={<AnalyticsPageMobile />} path={concatUrl([routeTarget.main, routeTarget.analytics])} />
                                <Route element={<SalesPageMobile />} path={concatUrl([routeTarget.main, routeTarget.sales])} />
                                <Route element={<ProductsPageMobile />} path={concatUrl([routeTarget.main, routeTarget.nomenclature])} />
                                <Route element={<AccountingPageMobile />} path={concatUrl([routeTarget.main, routeTarget.accounting])} />
                                <Route element={<SettingsPageMobile />} path={concatUrl([routeTarget.main, routeTarget.settings])} />
                        </Route>
                        <Route
                                path=""
                                element={
                                        <Navigate to={{ pathname: routeTarget.main }} relative="path" />
                                }
                        />
                        <Route
                                path="*"
                                element={<Navigate to={{ pathname: routeTarget.main }} relative="path" />}
                        />
                </Routes>
        );
};
export default AppRouter;