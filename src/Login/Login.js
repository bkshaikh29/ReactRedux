import React from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from "react-redux";
import { userLoginThunk } from "../Thunk/LoginThunk";
import { getUserState } from '../selector';

export const Login = ({ onFormSubmitFailed, onLoginPressed, history }) => {
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinish = (values) => {
        onLoginPressed(values, history);
    };

    const onFinishFailed = (errorInfo) => {
        onFormSubmitFailed();
    };
    //const condition = props.logingInUser.isRouteAllowed ? true : false;
    return (
        <Form data-testid="loginForm"
            {...layout}
            style={{
                padding: '30vh',
                alignItems: 'center'
            }}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input data-testid="UsernameInput" placeholder="UserName" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password data-testid="PasswordInput" placeholder="Password" />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button data-testid="submitButton" type="primary" htmlType="submit">
                    Submit
                 </Button>
            </Form.Item>
        </Form>
    );
};


const mapStateToProps = state => ({
    logingIn: getUserState(state),
});

const mapDispatchToProp = dispatch => ({
    onLoginPressed: (userObj, history) => dispatch(userLoginThunk(userObj, history)),
});
export default connect(mapStateToProps,mapDispatchToProp)(Login);