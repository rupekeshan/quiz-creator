import React from "react";
import userService from "../service/userService";
import {Link, useNavigate} from "react-router-dom";
import {Button, Card, Form, Input, notification, Row} from "antd";

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onSubmit = (value) => {
    userService
      .signup(value)
      .then((result) => {
        if (result.data.result) {
          notification.open({
            type: "success",
            message: "User Registration Successfull!",
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
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
        <Card title="Register" bordered={true} style={{ width: 600 }}>
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
              hasFeedback
              labelCol={{
                span: 4,
              }}
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter valid email",
                },
                {
                  max: 50,
                  message: "Maximum 50 characters",
                },
              ]}
            >
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              labelCol={{
                span: 4,
              }}
              rules={[
                {
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  required: true,
                  message:
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
                },
                {
                  max: 20,
                  message: "Maximum 20 characters",
                },
              ]}
            >
              <Input.Password autoComplete="password" />
            </Form.Item>
            <Row justify="end">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </Row>
          </Form>
          <Row justify="center" align="middle">
            Have a account? &nbsp;
            <Button type="primary">
              <Link to="/login">Login</Link>
            </Button>
          </Row>
        </Card>
      </Row>
    </div>
  );
}

export default Register;
