import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, FormInstance, Input, message } from "antd";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (values) => {
    message.loading("Logging in...");

    // Try to log in with the given username/password
    const success = await api.authLoginWithPassword(
      values.username,
      values.password
    );

    message.destroy();

    if (success) {
      message.info("Logged in!");

      // We just changed the result of getCurrentUserProfile(), so refetch it.
      await queryClient.refetchQueries({
        queryKey: ["getCurrentUserProfile"],
      });

      // Go back to landing page
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
