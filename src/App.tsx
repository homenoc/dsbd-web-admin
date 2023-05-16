import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './pages/Login/SignIn'
import Group from './pages/Group/Group'
import Dashboard from './pages/Dashboard/Dashboard'
import Notice from './pages/Notice/Notice'
import GroupDetail from './pages/Group/GroupDetail/GroupDetail'
import SupportDetail from './pages/Support/SupportDetail/SupportDetail'
import Support from './pages/Support/Support'
import Service from './pages/Service/Service'
import Connection from './pages/Connection/Connection'
import User from './pages/User/User'
import Token from './pages/Token/Token'
import ServiceAdd from './pages/Add/ServiceAdd'
import ConnectionAdd from './pages/Add/ConnectionAdd'
import NotFound from './pages/Etc/404'
import UserDetail from './pages/User/UserDetail/UserDetail'
import NoticeAdd from './pages/Notice/NoticeAdd'
import NoticeDetail from './pages/Notice/NoticeDetail'
import ConnectionDetail from './pages/Connection/ConnectionDetail/ConnectionDetail'
import ServiceDetail from './pages/Service/ServiceDetail/ServiceDetail'
import SupportAdd from './pages/Support/SupportAdd'

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<SignIn />} /> {}
          <Route path="/login" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/notice" element={<Notice />} />
          <Route path="/dashboard/notice/add" element={<NoticeAdd />} />
          <Route path="/dashboard/notice/:id" element={<NoticeDetail />} />
          <Route path="/dashboard/group" element={<Group />} />
          <Route path="/dashboard/group/:id" element={<GroupDetail />} />
          <Route
            path="/dashboard/group/:id/add/service"
            element={<ServiceAdd />}
          />
          <Route
            path="/dashboard/group/:id/add/connection"
            element={<ConnectionAdd />}
          />
          <Route path="/dashboard/support" element={<Support />} />
          <Route path="/dashboard/support/add" element={<SupportAdd />} />
          <Route path="/dashboard/support/:id" element={<SupportDetail />} />
          <Route path="/dashboard/service" element={<Service />} />
          <Route path="/dashboard/service/:id" element={<ServiceDetail />} />
          <Route path="/dashboard/connection" element={<Connection />} />
          <Route
            path="/dashboard/connection/:id"
            element={<ConnectionDetail />}
          />
          <Route path="/dashboard/user" element={<User />} />
          <Route path="/dashboard/user/:id" element={<UserDetail />} />
          <Route path="/dashboard/token" element={<Token />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
