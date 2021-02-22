import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom';
import MemberList from '../Members/MemberList';
import MemberView from '../Members/MemberView';
import About from "../About";
import DashBoardWelcome from './DashBoardWelcome';
import store from "../store";
import { userLogout } from "../actions";
const { Header, Content } = Layout;

class DashBoard extends Component {
    onLogout() {
        store.dispatch(userLogout());
        this.props.history.push("../..");
    }
    render() {
        return (
            <Layout data-testid="DashBoardBase" className="layout">
                <Header>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item  >Members List
                            <Link exact to="/dashboard/memberlist">
                            </Link>
                        </Menu.Item>
                        <Menu.Item  >Members Add
                            <Link exact to="/dashboard/memberadd/add">
                            </Link>
                        </Menu.Item>
                        <Menu.Item  >About
                            <Link exact to="/dashboard/about">
                            </Link>
                        </Menu.Item>
                        <Menu.Item data-testid="LogoutButton" style={{ float: 'right' }} onClick={() => this.onLogout()}>Logout
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ minHeight: '100vh', padding: '0 50px', backgroundColor: 'rgba(0, 0, 0, 0.015)' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                    </Breadcrumb>
                    <Route path="/dashboard/memberlist" component={MemberList} />
                    <Route path="/dashboard/member/:slug/:id" component={MemberView} />
                    <Route path="/dashboard/memberadd/:slug" component={MemberView} />
                    <Route path="/dashboard/about" component={About} />
                    <Route path="/dashboard" exact={true} component={DashBoardWelcome} />
                </Content>
            </Layout>
        );
    }
}

export default DashBoard;