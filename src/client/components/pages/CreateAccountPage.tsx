import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { api } from "../../api";
import { useRefetchQuery } from "../../hooks/useQuery";
import { useSetupProfileModal } from "../../hooks/useSetupProfileModal";

export function CreateAccountPage() {
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const symbols = ["!", "@", "#", "$", "%", "&", "-", "_"];
  const navigate = useNavigate();
  const refetchQuery = useRefetchQuery();
  const { openSetupProfileModal } = useSetupProfileModal();

  const onSubmit = async (values) => {
    if (!numbers.some((v) => values.password.includes(v))) {
      message.error("Password must have a number 0-9.");
      return;
    }
    if (!symbols.some((v) => values.password.includes(v))) {
      message.error("Password must have one of these characters: " + symbols);
      return;
    }
    if (values.password == values.password.toLowerCase()) {
      message.error("Password must have an uppercase letter.");
      return;
    }
    if (values.password != values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const profileInfo = await openSetupProfileModal();

    message.loading("Logging in...");
    const success = await api.authSignupWithPassword(
      values.username,
      values.password,
      profileInfo
    );

    if (success) {
      // We just changed the result of getCurrentUserProfile(), so refetch it.
      await refetchQuery("getCurrentUserProfile");
      sessionStorage.clear();

      message.destroy();
      message.info("Logged in!");

      navigate("/");
    } else {
      message.error("Username is already taken.");
    }
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Typography.Title>Create Account</Typography.Title>
        <div>
          <FormItem
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </FormItem>

          <FormItem
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </FormItem>

          <Button type="primary" htmlType="submit">
            Create Account!
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
