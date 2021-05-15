import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import SignIn from './pages/Login/SignIn';
import SignUp from "./pages/SignUp";
import PasswordRecovery from "./pages/PasswordRecovery";
import Group from "./pages/Group/Group";
import Dashboard from "./pages/Dashboard/Dashboard";
import Notice from './pages/Notice/Notice';
import Order from "./pages/Order/Order";
import GroupDetail from './pages/Group/GroupDetail/GroupDetail';
import SupportDetail from "./pages/Support/SupportDetail/SupportDetail";
import Support from "./pages/Support/Support";
import Service from "./pages/Service/Service";
import Connection from "./pages/Connection/Connection";
import User from "./pages/User/User";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/register" component={SignUp}/>
                    <Route exact path="/login" component={SignIn}/>
                    <Route exact path="/forget" component={PasswordRecovery}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route exact path="/dashboard/notice" component={Notice}/>
                    <Route exact path="/dashboard/group" component={Group}/>
                    <Route exact path="/dashboard/group/:id" component={GroupDetail}/>
                    <Route exact path="/dashboard/support" component={Support}/>
                    <Route exact path="/dashboard/support/:id" component={SupportDetail}/>
                    <Route exact path="/dashboard/order" component={Order}/>
                    <Route exact path="/dashboard/service" component={Service}/>
                    <Route exact path="/dashboard/connection" component={Connection}/>
                    <Route exact path="/dashboard/user" component={User}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
