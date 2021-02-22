import users from './UserReducer';
import actionTypes from '../actionTypes';

const intialState = { isProcessLoading: false, isRouteAllowed: false, data: [] }
describe("The User Login Reducer", () => {
    test("Login User reducer", () => {
        const fakeUser = {
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            userName: 'admin',
            password: 'admin'
        }
        const fakeLoginAction = {
            type: actionTypes.LOAD_USER_SUCCESS,
            payload: {
                list: fakeUser
            },
        }
        const expectedUserLogin = {
            isProcessLoading: false, isRouteAllowed: true, data: fakeUser
        }
        const actual = users(intialState, fakeLoginAction);
        expect(actual).toEqual(expectedUserLogin);
    });
    test("Logout User reducer", () => {
        const fakeLogoutAction = {
            type: actionTypes.USER_LOGOUT,
        }
        const expectedUserLogout = {
            isProcessLoading: false, isRouteAllowed: false, data: []
        }
        const actualLogout = users(intialState, fakeLogoutAction);
        expect(actualLogout).toEqual(expectedUserLogout);
    });
    test("Progress User reducer", () => {
        const fakeProgressAction = {
            type: actionTypes.LOAD_USER_PROGRESS,
        }
        const expectedUserProgress = {
            isProcessLoading: true, isRouteAllowed: false, data: []
        }
        const actualProgress = users(intialState, fakeProgressAction);
        expect(actualProgress).toEqual(expectedUserProgress);
    });
    test("Failure User reducer", () => {
        const fakeFailureAction = {
            type: actionTypes.LOAD_USER_FAILURE,
        }
        const expectedUserFailure = {
            isProcessLoading: false, isRouteAllowed: false, data: []
        }
        const actualFailure = users(intialState, fakeFailureAction);
        expect(actualFailure).toEqual(expectedUserFailure);
    });
    test("Default Case", () => {
        const fakeDefaultAction = {
            type: actionTypes.USER_LOGIN,
        }
        const expectedDefaultUser = {
            isProcessLoading: false, isRouteAllowed: false, data: []
        }
        const actualFailure = users(undefined, fakeDefaultAction);
        expect(actualFailure).toEqual(expectedDefaultUser);
    });
});








