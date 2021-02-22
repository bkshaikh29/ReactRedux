import actionTypes from '../actionTypes'

const intialState = { isProcessLoading: false, isRouteAllowed: false, data: [] }

export default function users(userState = intialState, action) {
    switch (action.type) {
        case actionTypes.USER_LOGOUT:
            return {
                ...userState,
                data: [],
                isProcessLoading: false,
                isRouteAllowed: false,
            }
        case actionTypes.LOAD_USER_PROGRESS:
            return {
                ...userState,
                isProcessLoading: true,
                isRouteAllowed: false,
            };
        case actionTypes.LOAD_USER_SUCCESS:
            console.log("inside reducer",action.payload)
            return {
                ...userState,
                data: action.payload.list,
                isRouteAllowed: true,
                isProcessLoading: false
            }
        case actionTypes.LOAD_USER_FAILURE:
            return {
                ...userState,
                isProcessLoading: false,
                isRouteAllowed: false,
            };
        default:
            return userState;
    }
}