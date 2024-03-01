import React, { useRef } from "react";
import styled from "styled-components";
import { Button, Form, Input, FormInstance, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const formRef = useRef<FormInstance>();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const res = await axios.post("/api/login", values);

    if (res.data.success) {
      message.info("Logged in!");
      navigate("/");
    } else {
      message.error("Username or password was incorrect");
    }
  };

  const onClickAutofill = () => {
    formRef.current.setFieldValue("username", "dev");
    formRef.current.setFieldValue("password", "somePassword");
  };

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
