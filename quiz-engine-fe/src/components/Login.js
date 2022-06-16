import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import userService from "../service/userService";
import {UserContext} from "../context/userContext";
import {Button, Card, Form, Input, notification, Row} from "antd";

function Login() {
  const [form] = Form.useForm();
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const onSubmit = (value) => {
    userService
      .signin(value)
      .then((result) => {
        localStorage.setItem("token", result.data.result.accessToken);
        localStorage.setItem("Rtoken", result.data.result.refreshToken);
        localStorage.setItem("email", result.data.result.email);
        localStorage.setItem("userId", result.data.result.userId);
        updateUser();
        notification.open({
          type: "success",
          message: "Login Successfully!",
        });
        navigate("/quiz/list");
      })
      .catch((error) => {
        notification.open({
          type: "error",
          message: error.response.data.message,
        });
      })
      .finally(() => form.resetFields());
  };
  return (
    <div className="site-card-border-less-wrapper">
      <Row justify="center">
        <Card title="Login" bordered={true} style={{ width: 600 }}>
          <Form
            form={form}
            name="basic"
            onFinish={onSubmit}
            layout={"vertical"}
            style={{ padding: "20px" }}
          >
            <Form.Item
              label="Email"
              name="email"
              labelCol={{
                span: 4,
              }}
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              labelCol={{
                span: 4,
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password autoComplete="password" />
            </Form.Item>
            <Row justify="end">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Row>
          </Form>
          <Row justify="center" align="middle">
            New User? &nbsp;
            <Button type="primary">
              <Link to="/register">Register</Link>
            </Button>
          </Row>
        </Card>
      </Row>
    </div>
  );
}

export default Login;
