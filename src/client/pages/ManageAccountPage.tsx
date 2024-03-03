import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { useSessionInfo } from "../hooks/useSessionInfo";
import { useUpdateUser } from "../hooks/useUpdateUser";

export function ManageAccountPage() {
  const user = useLoggedInUser();

  const navigate = useNavigate();
  const { updateUser } = useUpdateUser();

  const userId = useSessionInfo()?.userId;

  const onSubmit = async (values) => {
    // TODO: Check if Password is a valid format
    if (values.password != values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const success = await updateUser(userId, values.name, values.password);

    if (success) {
      message.info("Account updated!");
      navigate("/");
    } else {
      message.error("Error");
    }
  };

  const formRef = useRef<FormInstance>();

  useEffect(() => {
    // Pre-fill default values
    formRef.current?.setFieldValue("name", user?.name);
  }, [user]);

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Typography.Title>Manage Account</Typography.Title>
        <div>
          <FormItem label="Name" name="name" rules={[{ required: true }]}>
            <Input value={user.name} />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter a password: " />
          </FormItem>

          <FormItem
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Confirm your password: " />
          </FormItem>

          <Button type="primary" htmlType="submit">
            Update Account!
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
