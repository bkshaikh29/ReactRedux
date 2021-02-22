import React from 'react';
import renderer from 'react-test-renderer';
import MemberList from './MemberList';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history'

global.matchMedia = global.matchMedia || function () {
    return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};
let oldFetch;
const tempHistory = createMemoryHistory();
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
const mockFetch = (payload) => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(payload)
    }));
}
const mockFetchFailed = (payload) => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.reject("Server Error")
    }));
}
describe('Member List Page Snapshots', () => {
    it('Member List Page Snapshot Test With Data', () => {
        mockFetch({
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '1/1/2020'
        });
        const tree = renderer.create(
            <Provider store={storeMock}>
                <MemberList />
            </Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Member List Page Snapshot Test Without Data', () => {
        mockFetch({});
        const storeMockWithoutData = mockStore({
            users: { isProcessLoading: false, isRouteAllowed: false, data: [] },
            members: {
                isProcessLoading: false, list: [], detail: null
            }
        });
        const tree = renderer.create(
            <Provider store={storeMockWithoutData}>
                <MemberList />
            </Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
describe('Member List Page Testing', () => {
    beforeAll(() => {
        oldFetch = global.fetch
    })
    afterAll(() => {
        global.fetch = oldFetch
    })
    test('Basic Member List Page Render', async () => {
        const actionClicked = jest.fn();
        render(
            <Provider store={storeMock}>
                <MemberList history={tempHistory} actionOnMember={actionClicked} />
            </Provider>
        );
        const temp = screen.getByTestId("viewButton")
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    })
});
describe('Member List Page Action Testing', () => {
    beforeAll(() => {
        oldFetch = global.fetch
    })
    afterAll(() => {
        global.fetch = oldFetch
    })

    test('Action Performed View on Member List Page', async () => {
        const spy = jest.spyOn(tempHistory, 'push');
        render(
            <Provider store={storeMock}>
                <MemberList history={tempHistory} />
            </Provider>
        )
        fireEvent.click(screen.getByTestId("viewButton"));
        expect(spy).toHaveBeenCalledWith("member/view/ae06181d-92c2-4fed-a29d-fb53a6301eb9");
    });
    test('Action Performed Edit on Member List Page', async () => {
        const spy = jest.spyOn(tempHistory, 'push');
        render(
            <Provider store={storeMock}>
                <MemberList history={tempHistory} />
            </Provider>
        )
        fireEvent.click(screen.getByTestId("editButton"));
        expect(spy).toHaveBeenCalledWith("member/edit/ae06181d-92c2-4fed-a29d-fb53a6301eb9");
    });
    test('Action Performed Delete on Member List Page', async () => {
        window.confirm = jest.fn(() => true);
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
                <MemberList history={tempHistory} />
            </Provider>
        )
        fireEvent.click(screen.getByTestId("deleteButton"));
        // expect(deleteMember).toHaveBeenCalled();
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
    test('Action Performed Delete on Member List Page but server error happended', async () => {
        window.confirm = jest.fn(() => true);
        mockFetchFailed({
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '1/1/2020'
        })
        render(
            <Provider store={storeMock}>
                <MemberList history={tempHistory} />
            </Provider>
        )
        fireEvent.click(screen.getByTestId("deleteButton"));
        // expect(deleteMember).toHaveBeenCalled();
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
    test('Action Performed Delete Rejected on Member List Page', async () => {
        window.confirm = jest.fn(() => false);
        render(
            <Provider store={storeMock}>
                <MemberList history={tempHistory} />
            </Provider>
        )
        fireEvent.click(screen.getByTestId("deleteButton"));
        // expect(deleteMember).toHaveBeenCalled();
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
})