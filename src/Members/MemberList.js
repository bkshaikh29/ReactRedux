import React, { useEffect } from 'react';
import { Table, Space, Button, Spin } from 'antd';
import { connect } from "react-redux";
import {
    getMemberLoading,
    getMemberState,
} from "../selector";
import {
    loadMembers,
    deleteMember
} from "../Thunk/MemberThunk";

const MemberList = ({ isProcessLoading, membersData, startLoadingMembers, deleteMemberFromState, history }) => {
    useEffect(() => {
        debugger
        startLoadingMembers();
    }, []);

    const columns = [
        {
            title: 'Member Name',
            dataIndex: 'memberName',
            key: 'memberName',
        },
        {
            title: 'Age',
            dataIndex: 'memberAge',
            key: 'memberAge',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button data-testid="viewButton" type="link" onClick={() => actionOnMember('view', record.id)}>View</Button>
                    <Button data-testid="editButton" type="link" onClick={() => actionOnMember('edit', record.id)}>Edit</Button>
                    <Button data-testid="deleteButton" type="link" onClick={() => actionOnMember('delete', record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];
    const actionOnMember = (actionPerformed, memberId) => {
        if (actionPerformed !== 'delete') {
            history.push("member/" + actionPerformed + "/" + memberId);
        } else {
            if (window.confirm('Do you want to delete this memeber') === true) {
                deleteMemberFromState(memberId)
            }
        }
    }
    return (
        <div data-testid="MemberListComponent">
            <Spin size="large"
                tip="Loading..."
                spinning={isProcessLoading}>
                <Table rowKey={'id'} columns={columns} dataSource={membersData} />
            </Spin>
        </div>
    );
};

const mapStateToProps = state => ({
    isProcessLoading: getMemberLoading(state),
    membersData: getMemberState(state),

});

const mapDispatchToProp = dispatch => ({
    startLoadingMembers: () => dispatch(loadMembers()),
    deleteMemberFromState: (id) => dispatch(deleteMember(id))
});

export default connect(mapStateToProps, mapDispatchToProp)(MemberList);