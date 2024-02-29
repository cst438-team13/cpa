import React, { useRef } from "react";
import styled from "styled-components";
import { Button, Form, Input, FormInstance } from "antd";
import axios from "axios";

export function LoginPage() {
  const formRef = useRef<FormInstance>();

  const onSubmit = async (values) => {
    const res = await axios.post("/api/login", values);

    if (res.data.success) {
      window.location.href = "/";
    } else {
      // TODO: show error message
    }
  };

  const onClickAutofill = () => {
    formRef.current.setFieldValue("username", "dev");
    formRef.current.setFieldValue("password", "somePassword");
  };

  return (
    <Container>
      <Form
        name="basic"
        action="/api/login"
        onFinish={onSubmit}
        autoComplete="off"
        ref={formRef}
      >
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
