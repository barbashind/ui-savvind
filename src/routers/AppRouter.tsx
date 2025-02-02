import { Navigate, Route, Routes } from "react-router-dom";

// ссылки
import { routeTarget } from "./routes.ts";

// страницы
import MainPage from "../pages/MainPage.tsx";
import Nomenclature from "../pages/Nomenclature.tsx";
import Sales from "../pages/Sales.tsx";
import ProductRegistration from "../pages/ProductRegistration.tsx";
import ProductWarehouse from "../pages/ProductWarehouse.tsx";
import Accounting from "../pages/Accounting.tsx";
import Purchase from "../pages/Purchase.tsx";
import Settings from "../pages/Settings.tsx";
import { concatUrl } from "../utils/urlUtils.ts";


const AppRouter = () => {
        return (
                <Routes>
                        <Route element={<MainPage />}>
                                <Route element={<Nomenclature />} path={concatUrl([routeTarget.main, routeTarget.nomenclature])} />
                                <Route element={<Sales />} path={concatUrl([routeTarget.main, routeTarget.sales])} />
                                <Route element={<ProductRegistration />} path={concatUrl([routeTarget.main, routeTarget.product_registration])} />
                                <Route element={<Purchase />} path={concatUrl([routeTarget.main, routeTarget.product_purchase])} />
                                <Route element={<ProductWarehouse />} path={concatUrl([routeTarget.main, routeTarget.product_warehouse])} />
                                <Route element={<Accounting />} path={concatUrl([routeTarget.main, routeTarget.accounting])} />
                                <Route element={<Settings />} path={concatUrl([routeTarget.main, routeTarget.settings])} />
                        </Route>
                        <Route
                                path=""
                                element={
                                        <Navigate to={{ pathname: concatUrl([routeTarget.main, routeTarget.sales])}} relative="path" />
                                }
                        />
                        <Route
                                path="*"
                                element={<Navigate to={{ pathname: concatUrl([routeTarget.main, routeTarget.sales]) }} relative="path" />}
                        />
                </Routes>
        );
};
export default AppRouter;