import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import SignIn from './pages/Login/SignIn';
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
import Token from "./pages/Token/Token";
import JPNIC from "./pages/JPNIC/JPNIC";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/login" exact/>
                    <Route exact path="/login" component={SignIn}/>
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
                    <Route exact path="/dashboard/token" component={Token}/>
                    <Route exact path="/dashboard/jpnic" component={JPNIC}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
