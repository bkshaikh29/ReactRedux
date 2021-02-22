import { members } from './MemberReducer';
import actionTypes from '../actionTypes';

const fakeMember = {
    id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    memberName: 'Member 1',
    memberAge: 32,
    address: 'Address 1',
    createdAt: '01/01/2020',
}
const intialState = { isProcessLoading: false, list: [], detail: null }
describe("The Default Member List Reducer", () => {
    test("Default Member Reducer", () => {
        const fakeDefaultAction = {
            type: 'dafault',
        }
        const expectedDefaultMember = {
            isProcessLoading: intialState.isProcessLoading, list: intialState.list, detail: intialState.detail
        }
        const actualDefaultMember = members(undefined, fakeDefaultAction);
        expect(actualDefaultMember).toEqual(expectedDefaultMember);

    });
});
describe("The Member List Reducer", () => {
    beforeAll(() => {
        for (let i = 0; i < 3; i++) {
            intialState.list.push(fakeMember);
        }
        const fakeMemberForDelete = {
            id: '1',
            key: '1',
            memberName: 'Member Delete',
            memberAge: 32,
            address: 'Address Delete',
            createdAt: '01/01/2020',
        }
        intialState.list.concat(fakeMemberForDelete);
    });
    test("Member Add Reducer", () => {
        const fakeMember = {
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '01/01/2020',
        }
        const fakeMemberAdd = {
            type: actionTypes.MEMBER_ADD,
            payload: {
                member: fakeMember
            },
        }
        const expectedAddMember = {
            isProcessLoading: false, list: intialState.list, detail: fakeMember
        }
        const actualAddMember = members(intialState, fakeMemberAdd);
        expect(actualAddMember).toEqual(expectedAddMember);

    });
    test("Get Single Member Reducer", () => {
        const fakeMember = {
            id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
            memberName: 'Member 2',
            memberAge: 33,
            address: 'Address 2',
            createdAt: '01/01/2020',
        }
        const fakeMemberDetails = {
            type: actionTypes.MEMBER_DETAIL_SUCCESS,
            payload: {
                member: fakeMember
            },
        }
        const expectedMemberDetails = {
            isProcessLoading: false, list: intialState.list, detail: fakeMember
        }
        const actualGetSinglMember = members(intialState, fakeMemberDetails);
        expect(actualGetSinglMember).toEqual(expectedMemberDetails);

    });
    test("Member Edit Reducer", () => {
        const fakeMember = {
            id: '2e538cc5-b734-4771-a109-dfcd204bb38b',
            key: '2e538cc5-b734-4771-a109-dfcd204bb38b',
            memberName: 'Member 3',
            memberAge: 33,
            address: 'Address 3',
            createdAt: '01/01/2020',
        }
        const fakeMemberEdit = {
            type: actionTypes.MEMBER_EDIT,
            payload: {
                member: fakeMember
            },
        }
        const expectedEditMember = {
            isProcessLoading: false, list: intialState.list, detail: fakeMember
        }
        const actualEditedMember = members(intialState, fakeMemberEdit);
        expect(actualEditedMember).toEqual(expectedEditMember);
    });
    test("Member Delete Reducer", () => {
        const fakeMember = {
            id: '1',
            key: '1',
            memberName: 'Member Delete',
            memberAge: 32,
            address: 'Address Delete',
            createdAt: '01/01/2020',
        }
        const fakeMemberDelete = {
            type: actionTypes.MEMBER_DELETE,
            payload: {
                id: fakeMember.id
            },
        }
        const expectedDeleteMember = {
            isProcessLoading: false, list: intialState.list.filter(member => member.id !== fakeMemberDelete.id), detail: intialState.detail
        }
        const actualDeletedMember = members(intialState, fakeMemberDelete);
        expect(actualDeletedMember).toEqual(expectedDeleteMember);
    });
    test("Member Progress Reducer", () => {
        const fakeMemberProgress = {
            type: actionTypes.LOAD_MEMBER_PROGRESS,
        }
        const expectedProgressMember = {
            isProcessLoading: true, list: intialState.list, detail: intialState.detail
        }
        const actualProgressMember = members(intialState, fakeMemberProgress);
        expect(actualProgressMember).toEqual(expectedProgressMember);
    });
    test("Member Failure Reducer", () => {
        const fakeMemberFailure = {
            type: actionTypes.LOAD_MEMBER_FAILURE,
        }
        const expectedFailureMember = {
            isProcessLoading: false, list: intialState.list, detail: intialState.detail
        }
        const actualFailure = members(intialState, fakeMemberFailure);
        expect(actualFailure).toEqual(expectedFailureMember);
    });
    test("Member Success Reducer", () => {
        const fakeMember = {
            id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
            memberName: 'Member 1',
            memberAge: 32,
            address: 'Address 1',
            createdAt: '01/01/2020',
        }
        const fakeMemberSuccess = {
            type: actionTypes.LOAD_MEMBER_SUCCESS,
            payload: {
                members: fakeMember
            },
        }
        const expectedSuccessMember = {
            isProcessLoading: false, list: fakeMember, detail: intialState.detail
        }
        const actualSuccess = members(intialState, fakeMemberSuccess);
        expect(actualSuccess).toEqual(expectedSuccessMember);
    });
});