export const getUserState = state => state.users.data;
export const getUserAllowed = state => state.users;
export const getUserLoading = state => state.users.isProcessLoading;

export const getMemberState = state => state.members.list;
export const getMemberLoading = state => state.members.isProcessLoading;


export const singleMemberData = state => state.members.detail;
// export const getSelectedMember = (memberId) => createSelector( // it takes variable number of arguments each of which is some sort of selector 
//     getMemberState,  // can pass as many selector we want
//     (membersData) => membersData.filter(member => member.id === memberId),  // at last we pass a function who's return
//     //value is the reutrn value of complete selector
// );