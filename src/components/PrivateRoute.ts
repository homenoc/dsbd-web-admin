import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {isAuthSelector} from "../../../../../Downloads/web-admin/src/store/auth";

function PrivateRoute(props: any): any {
    const isAuth = useSelector(isAuthSelector);

    // return <Redirect to="/" />;

    return isAuth
    // ? (<Route {...props} />)
    //     ? <Route {...props} />
// : <Redirect to="/pages" />;
}

export default PrivateRoute;
