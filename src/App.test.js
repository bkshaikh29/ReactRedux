import configureMockStore from 'redux-mock-store';
import { render, screen } from "@testing-library/react";
import React from "react";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from "react-redux";
import store from "./store";
import MyRoute from './MyRoute';
import thunk from 'redux-thunk';
import App from './App'
import {
    userLogout,
    loadUserInFailure,
    loadUserInSuccess,
    loadUserInProgress,
    loadMemberInProgress,
    loadMemberInSuccess,
    loadMemberInFailure,
    deleteMemberInSuccess,
    loadMemberDetail,
    updateMemberDetail,
    addMemberDetail
} from "./actions";

global.matchMedia = global.matchMedia || function () {
    return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};

const history = createMemoryHistory();
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);
const storeMock = mockStore(store.getState());
describe("Without Store", () => {
    test("Main App Test At Start", () => {
        render(
            <Router history={history}>
                <MyRoute />
            </Router>
        )
        expect(screen.getByText(/Home/i)).toBeInTheDocument()
    });
    test("Main App Test At Wrong URL", () => {
        var temphistory = createMemoryHistory();
        temphistory.push('/wrongroute')
        render(
            <Router history={temphistory}>
                <MyRoute />
            </Router>
        )
        expect(screen.getByText(/ERROR PAGE WRONG URL/i)).toBeInTheDocument()
    });
    test("Main App without Router", () => {
        render(
            <App />
        )
        expect(screen.getByText(/Home/i)).toBeInTheDocument()
    });
});

describe("With Store", () => {
    test("Main App Test At Login Pressed on Home", () => {
        render(
            <Provider store={storeMock}>
                <Router history={history}>
                    <MyRoute />
                </Router>
            </Provider>
        )
        const leftClick = { button: 0 }
        userEvent.click(screen.getByTestId(/loginButton/i), leftClick)

        expect(screen.getByTestId(/loginForm/i)).toBeInTheDocument()
    });

    test("Main App Test At Login URL", () => {
        var temphistory = createMemoryHistory();
        temphistory.push('/login');
        render(
            <Provider store={storeMock}>
                <Router history={temphistory}>
                    <MyRoute />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/loginForm/i)).toBeInTheDocument()
    });
    test("Main App Test At Dashboard URL Redirected to Login", () => {
        var temphistory = createMemoryHistory();
        const route = '/dashboard'
        temphistory.push(route);
        render(
            <Provider store={storeMock}>
                <Router history={temphistory}>
                    <MyRoute />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/loginForm/i)).toBeInTheDocument()
    });
    test("Main App Test At Dashboard URL", () => {
        var temphistory = createMemoryHistory();
        const route = '/dashboard'
        temphistory.push(route);

        const fakeUser = {
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            userName: 'admin',
            password: 'admin'
        }
        const storeMockTest = mockStore({
            users: { isProcessLoading: false, isRouteAllowed: true, data: [fakeUser] },
            members: { isProcessLoading: false, list: [], detail: null },
            _persist: { version: -1, rehydrated: false }
        });
        render(
            <Provider store={storeMockTest}>
                <Router history={temphistory}>
                    <MyRoute />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/DashBoardBase/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome to DashBoard/i)).toBeInTheDocument();
    });
});

describe("Actions Test", () => {
    beforeEach(() => {
        storeMock.clearActions();
    });
    const fakeMember = {
        id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
        key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
        memberName: 'Member 1',
        memberAge: 32,
        address: 'Address 1',
        createdAt: '01/01/2020',
    }
    test("User Login", () => {
        storeMock.dispatch(loadUserInProgress());
        const fakeUser = {
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            userName: 'admin',
            password: 'admin'
        }
        storeMock.dispatch(loadUserInSuccess(fakeUser));
        const expectedActions = [
            { type: 'loadProgressUser' },
            { type: 'loadSuccessUser', payload: { list: fakeUser } }
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("User Logout", () => {
        storeMock.dispatch(userLogout());
        const expectedActions = [
            { type: 'logout' },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("User Failure", () => {
        storeMock.dispatch(loadUserInFailure());
        const expectedActions = [
            { type: 'loadFailureUser' },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });

    test("Member Load Sucess", () => {

        storeMock.dispatch(loadMemberInProgress());
        storeMock.dispatch(loadMemberInSuccess(fakeMember));
        const expectedActions = [
            { type: 'loadProgressMember' },
            { type: 'loadSuccessMember', payload: { members: fakeMember } }
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("Member Failure", () => {
        storeMock.dispatch(loadMemberInFailure());
        const expectedActions = [
            { type: 'loadFailureMember' },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("Member Delete", () => {
        storeMock.dispatch(deleteMemberInSuccess(fakeMember.id));
        const expectedActions = [
            { type: 'memberDelete', payload: { id: fakeMember.id } },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("Member Detail View", () => {
        storeMock.dispatch(loadMemberDetail(fakeMember));
        const expectedActions = [
            { type: 'memberView', payload: { member: fakeMember } },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("Member Update", () => {
        storeMock.dispatch(updateMemberDetail(fakeMember));
        const expectedActions = [
            { type: 'memberEdit', payload: { member: fakeMember } },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
    test("Member Add", () => {
        storeMock.dispatch(addMemberDetail(fakeMember));
        const expectedActions = [
            { type: 'memberAdd', payload: { member: fakeMember } },
        ]
        expect(storeMock.getActions()).toEqual(expectedActions);
    });
});