import { Button, Form, FormInstance, Input, message } from "antd";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const onSubmit = async (values) => {
    message.loading("Logging in...");
    const success = await loginUser(values.username, values.password);
    message.destroy();

    if (success) {
      message.info("Logged in!");
      navigate("/");
    } else {
      message.error("Username or password was incorrect");
    }
  };

  const onClickAutofill = () => {
    formRef.current?.setFieldValue("username", "dev");
    formRef.current?.setFieldValue("password", "somePassword");
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <div>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
          <Button type="link" htmlType="button" onClick={onClickAutofill}>
            Autofill (dev)
          </Button>
        </div>
      </Form>
    </Container>
  );
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
