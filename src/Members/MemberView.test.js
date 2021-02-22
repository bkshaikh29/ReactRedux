import React from 'react';
import renderer from 'react-test-renderer';
import MemberView from './MemberView';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

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
        isProcessLoading: false, list: [], detail: {
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            memberName: 'Member 1',
            memberAge: 32,
            address: 'Address 1',
            createdAt: '1/1/2020'
        }
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
describe('Member View Page', () => {
    beforeAll(() => {
        oldFetch = global.fetch
    })
    afterAll(() => {
        global.fetch = oldFetch
    })
    test("Member View  Page Renders Values Change Correctly on Add", () => {
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'add' } }
                } />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        expect(screen.getByTestId(/memberNameField/i).value).toBe("admin");
        expect(screen.getByTestId(/memberAgeField/i).value).toBe("11");
        expect(screen.getByTestId(/addressField/i).value).toBe("admin");
    });
    test("Member View  Page Renders Values Change Correctly On Edit", () => {
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'edit' } }
                } />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "1/1/2020" }
        });
        expect(screen.getByTestId(/memberNameField/i).value).toBe("admin");
        expect(screen.getByTestId(/memberAgeField/i).value).toBe("11");
        expect(screen.getByTestId(/addressField/i).value).toBe("admin");
        expect(screen.getByTestId(/createdOnField/i).value).toBe("1/1/2020");
    });
    test("Member View Page Fields Rendered Check on Edit", async () => {
        const updateButton = jest.fn();
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
                <MemberView match={
                    { params: { slug: 'edit', id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        await waitFor(() => {
            expect(screen.getByTestId(/memberNameField/i).value).toBe("Member 2");
            expect(screen.getByTestId(/memberAgeField/i).value).toBe("33");
            expect(screen.getByTestId(/addressField/i).value).toBe("Address 2");
            expect(screen.getByTestId(/createdOnField/i).value).toBe("1/1/2020");
        });
    });
    test("Member View Page Fields Rendered on View", async () => {
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
                <MemberView match={
                    { params: { slug: 'view', id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4' } }
                } />
            </Provider>
        )
        await waitFor(() => {
            expect(screen.getByTestId(/memberNameField/i).value).toBe("Member 2");
            expect(screen.getByTestId(/memberAgeField/i).value).toBe("33");
            expect(screen.getByTestId(/addressField/i).value).toBe("Address 2");
            expect(screen.getByTestId(/createdOnField/i).value).toBe("1/1/2020");
        });
    });
});
describe('Member View Page Edit Actions', () => {
    beforeAll(() => {
        oldFetch = global.fetch
    })
    afterAll(() => {
        global.fetch = oldFetch
    })
    test("Member View  Page Update Action Failed Due to Name Missing", async () => {
        const updateButton = jest.fn();
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'edit' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "1/1/2020" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(updateButton).toHaveBeenCalled();
        });
    });
    test("Member View  Page Update Action Failed Due to Age Missing", async () => {
        const updateButton = jest.fn();
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'edit' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "1/1/2020" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(updateButton).toHaveBeenCalled();
        });
    });
    test("Member View  Page Update Action Failed Due to Date Missing", async () => {
        const updateButton = jest.fn();
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'edit' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(updateButton).toHaveBeenCalled();
        });
    });
    test("Member View  Page Update Action Success", async () => {
        const updateButton = jest.fn();
        mockFetch({
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '1/1/2020'
        })
        render(
            <Provider store={storeMock}>
                <MemberView match={
                    { params: { slug: 'edit' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "1/1/2020" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
    test("Member View  Page Update Action Failed From Server", async () => {
        const updateButton = jest.fn();
        // const consoleMock = jest.spyOn(global.console, 'log');
        console.log = jest.fn();
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
                <MemberView match={
                    { params: { slug: 'edit' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/createdOnField/i), {
            target: { value: "1/1/2020" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            // expect(consoleMock).toHaveBeenCalled();
        });
    });
});

describe('Member View Page Add Actions', () => {
    test("Member View  Page Add Action Success", async () => {
        const updateButton = jest.fn();
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
                <MemberView match={
                    { params: { slug: 'add' } }
                } onFormSubmitFailed={updateButton} />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/memberNameField/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/memberAgeField/i), {
            target: { value: "11" }
        });
        fireEvent.change(screen.getByTestId(/addressField/i), {
            target: { value: "admin" }
        });
        fireEvent.click(screen.getByTestId("memberViewSubmitButton"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
})