import actionTypes from '../actionTypes'

const intialState = { isProcessLoading: false, list: [], detail: null }
export function members(memberState = intialState, action) {
    switch (action.type) {
        case actionTypes.LOAD_MEMBER_PROGRESS:
            return {
                ...memberState,
                isProcessLoading: true,
            };
        case actionTypes.LOAD_MEMBER_SUCCESS:
            return {
                ...memberState,
                list: action.payload.members,
                detail: null,
                isProcessLoading: false
            }
        case actionTypes.LOAD_MEMBER_FAILURE:
            return {
                ...memberState,
                isProcessLoading: false,
            };
        case actionTypes.MEMBER_DETAIL_SUCCESS:
            return {
                ...memberState,
                isProcessLoading: false,
                detail: action.payload.member
            }
        case actionTypes.MEMBER_EDIT:
            return {
                ...memberState,
                isProcessLoading: false,
                detail: action.payload.member
            }
        case actionTypes.MEMBER_DELETE:
            return {
                ...memberState,
                isProcessLoading: false,
                list: memberState.list.filter(member => member.id !== action.payload.id)
            }
        case actionTypes.MEMBER_ADD:
            return {
                ...memberState,
                isProcessLoading: false,
                detail: action.payload.member
            }
        default:
            return memberState;
    }
}