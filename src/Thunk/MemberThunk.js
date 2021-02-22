import {
    addMemberDetail,
    loadMemberDetail,
    loadMemberInProgress,
    loadMemberInFailure,
    updateMemberDetail,
    loadMemberInSuccess,
    deleteMemberInSuccess
} from "../actions";

const URI = "http://localhost:8080/";

const displayAlert = text =>  {
    console.log(text)
}

export const loadMembers = () => async (dispatch, getState) => {
    try {
        debugger
        dispatch(loadMemberInProgress());
        const response = await fetch(URI + "members");
        const members = await response.json();
        dispatch(loadMemberInSuccess(members));
    } catch (e) {
        debugger
        dispatch(loadMemberInFailure());
        displayAlert(e);
    }
}

export const deleteMember = (id) => async (dispatch, getState) => {
    try {
        debugger
        dispatch(loadMemberInProgress());
        const response = await fetch(URI + "members/" + id, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'delete',
        });
        const members = await response.json();
        dispatch(deleteMemberInSuccess(members.id));
    } catch (e) {
        debugger
        dispatch(loadMemberInFailure());
        displayAlert(e);
    }
}

export const loadSingleMember = (id, form) => async (dispatch, getState) => {
    try {
        debugger
        dispatch(loadMemberInProgress());
        const response = await fetch(URI + "members/" + id);
        const members = await response.json();
        dispatch(loadMemberDetail(members));
        form.setFieldsValue({
            memberName: members.memberName,
            createdAt: new Date(members.createdAt).toLocaleDateString(),
            memberAge: members.memberAge,
            address: members.address
        })
    } catch (e) {
        debugger
        dispatch(loadMemberInFailure());
        displayAlert(e);
    }
}

export const UpdateSingleMember = (memberId, memberObj, history) => async (dispatch, getState) => {
    try {
        debugger
        dispatch(loadMemberInProgress());
        const body = JSON.stringify({
            member: {
                memberName: memberObj.memberName,
                memberAge: memberObj.memberAge,
                address: memberObj.address,
            }
        });
        const response = await fetch(URI + "members/" + memberId, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'post',
            body,
        });
        const members = await response.json();
        dispatch(updateMemberDetail(members));
    } catch (e) {
        debugger
        dispatch(loadMemberInFailure());
        displayAlert(e);
    }
}

export const AddSingleMember = (memberObj, history) => async (dispatch, getState) => {
    try {
        debugger
        dispatch(loadMemberInProgress());
        const body = JSON.stringify({
            member: {
                memberName: memberObj.memberName,
                memberAge: memberObj.memberAge,
                address: memberObj.address,
            }
        });
        const response = await fetch(URI + "members", {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'post',
            body,
        });
        const members = await response.json();
        dispatch(addMemberDetail(members));
        history.push("../member/view/" + members.id);
    } catch (e) {
        debugger
        dispatch(loadMemberInFailure());
        displayAlert(e);
    }
}