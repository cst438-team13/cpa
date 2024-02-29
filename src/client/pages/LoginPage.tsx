import React, { useRef } from "react";
import styled from "styled-components";
import { Button, Form, Input, FormInstance } from "antd";

export function LoginPage() {
  const formRef = useRef<FormInstance>();

  const onSubmit = (values) => {
    console.log(values);
  };

  const autofill = () => {
    formRef.current.setFieldValue("username", "dev");
    formRef.current.setFieldValue("password", "somePassword");
  };

  return (
    <Container>
      <Form name="basic" onFinish={onSubmit} autoComplete="off" ref={formRef}>
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
          <Button type="link" htmlType="button" onClick={autofill}>
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
