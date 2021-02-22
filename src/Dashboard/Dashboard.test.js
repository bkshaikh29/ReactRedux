import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history'
import DashBoard from './DashBoard'
import { Router } from 'react-router-dom';

global.matchMedia = global.matchMedia || function () {
    return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};
const mockFetch = (payload) => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(payload)
    }));
}

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);
const storeMock = mockStore({
    users: { isProcessLoading: false, isRouteAllowed: false, data: [] },
    members: {
        isProcessLoading: false, list: [{
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            memberName: 'Member 1',
            memberAge: 32,
            address: 'Address 1',
            createdAt: '1/1/2020'
        }], detail: null
    }
});

describe('Simple Route From Dashboard', () => {
    it('Welcome Dashboard Component', () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard');
        render(
            <Router history={tempHistory}>
                <DashBoard />
            </Router>
        )
        expect(screen.getByTestId(/DashboardWelcomeComponent/i)).toBeInTheDocument()
    });
    it('About Component', () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard/about');
        render(
            <Router history={tempHistory}>
                <DashBoard />
            </Router>
        )
        expect(screen.getByTestId(/AboutComponent/i)).toBeInTheDocument()
    });
});
describe('Simple Route From Dashboard To Connected Components', () => {
    it('Member Add View Component', () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard/memberadd/add');
        render(
            <Provider store={storeMock}>
                <Router history={tempHistory}>
                    <DashBoard />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/MemberViewComponent/i)).toBeInTheDocument()
    });

    it('Member View Component', async () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard/member/view/cda9165d-c263-4ef6-af12-3f1271af5fb4');
        mockFetch({
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '1/1/2020'
        });
        render(
            <Provider store={storeMock}>
                <Router history={tempHistory}>
                    <DashBoard />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/MemberViewComponent/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId(/memberNameField/i).value).toBe("Member 2");
        })
    });
});
describe('Simple Route From Dashboard To Connected Member List Component', () => {
    it('Member View Component', async () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard/memberlist');
        mockFetch({
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '1/1/2020'
        });
        render(
            <Provider store={storeMock}>
                <Router history={tempHistory}>
                    <DashBoard />
                </Router>
            </Provider>
        )
        expect(screen.getByTestId(/MemberListComponent/i)).toBeInTheDocument();
    });
});


describe('Logout', () => {
    it('Logout Application', async () => {
        var tempHistory = createMemoryHistory();
        tempHistory.push('/dashboard');
        const spy = jest.spyOn(tempHistory, 'push');
        render(
            <Router history={tempHistory}>
                <DashBoard history={tempHistory} />
            </Router>
        )
        fireEvent.click(screen.getByTestId("LogoutButton"));
        expect(screen.getByTestId(/LogoutButton/i)).toBeInTheDocument();
        expect(spy).toHaveBeenCalledWith("../..");
    });
});


