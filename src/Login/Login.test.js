import configureMockStore from 'redux-mock-store';
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from "react-redux";
import store from "../store";
import thunk from 'redux-thunk';
import LoginComponent, { Login } from './Login'

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

let oldFetch;
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
describe("Login Page", () => {
    beforeAll(() => {
        oldFetch = global.fetch
    })
    afterAll(() => {
        global.fetch = oldFetch
    })

    test("Login On Submit Successful with mock fetch", async () => {
        mockFetch({
            user: {
                id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
                userName: 'admin',
                password: 'admin'
            }
        })
        const loginMockStore = mockStore({
            users: { isProcessLoading: false, isRouteAllowed: false, data: [] },
            members: { isProcessLoading: false, list: [], detail: null }
        });

        const { debug } = render(
            <Provider store={loginMockStore}>
                <LoginComponent />
            </Provider>
        );
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.click(screen.getByTestId("submitButton"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
    test("Login On Submit Failed with mock fetch", async () => {
        global.console.log = jest.fn();
        mockFetchFailed({
            user: {
                id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
                userName: 'admin',
                password: 'admin'
            }
        })
        const loginMockStore = mockStore({
            users: { isProcessLoading: false, isRouteAllowed: false, data: [] },
            members: { isProcessLoading: false, list: [], detail: null }
        });

        const { debug } = render(
            <Provider store={loginMockStore}>
                <LoginComponent />
            </Provider>
        );
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.click(screen.getByTestId("submitButton"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            expect(global.console.log).toHaveBeenCalled();
        });
    });
    test("Login Page", () => {
        render(
            <Provider store={storeMock}>
                <Login />
            </Provider>
        )
        expect(screen.getByTestId(/loginForm/i)).toBeInTheDocument()
    });
    test("Login Page Renders Correctly", () => {
        render(
            <Provider store={storeMock}>
                <Login />
            </Provider>
        )
        expect(screen.getByTestId(/UsernameInput/i)).toBeTruthy();
        expect(screen.getByTestId(/PasswordInput/i)).toBeTruthy();
        expect(screen.getByTestId(/submitButton/i)).toBeTruthy();
    });
    test("Login Page Renders Values Change Correctly", () => {
        render(
            <Provider store={storeMock}>
                <Login />
            </Provider>
        )
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: "admin" }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: "admin" }
        });
        expect(screen.getByTestId(/UsernameInput/i).value).toBe("admin");
        expect(screen.getByTestId(/PasswordInput/i).value).toBe("admin");
    });
    test("Login On Submit", async () => {
        const loginButton = jest.fn();
        const { debug } = render(<Login onLoginPressed={loginButton} />);
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.click(screen.getByTestId("submitButton"));

        await waitFor(() => {
            expect(loginButton).toHaveBeenCalled();
        });
    });
    test("Login On Submit Failed Due to Password", async () => {
        const loginButton = jest.fn();
        const { debug } = render(<Login onFormSubmitFailed={loginButton} />);
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: '' }
        });
        fireEvent.click(screen.getByTestId("submitButton"));

        await waitFor(() => {
            expect(loginButton).toHaveBeenCalled();
        });
    });

    test("Login On Submit Failed Due to Username", async () => {
        const loginButton = jest.fn();
        const loginMockStore = mockStore({
            users: { isProcessLoading: false, isRouteAllowed: false, data: [] },
            members: { isProcessLoading: false, list: [], detail: null }
        });

        const { debug } = render(
            <Provider store={loginMockStore}>
                <LoginComponent onFormSubmitFailed={loginButton} />
            </Provider>
        );
        fireEvent.change(screen.getByTestId(/UsernameInput/i), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByTestId(/PasswordInput/i), {
            target: { value: '' }
        });
        fireEvent.click(screen.getByTestId("submitButton"));
        await waitFor(() => {
            expect(loginButton).toHaveBeenCalled();
        });
    });
});