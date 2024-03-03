import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { useSessionInfo } from "../hooks/useSessionInfo";
import { useUpdateUser } from "../hooks/useUpdateUser";

export function ManageAccountPage() {
  const user = useLoggedInUser();

  const navigate = useNavigate();
  const { updateUser } = useUpdateUser();
  const userId = useSessionInfo().userId;

  const onSubmit = async (values) => {
    // TODO: Check if Password is a valid format
    if (values.password != values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    // TODO: update user with given info
    const success = await updateUser(
      userId,
      user.username,
      values.password,
      values.name
    );
    if (success) {
      message.info("Account Updated!");
      navigate("/");
    } else {
      message.error("Error");
    }
  };

  const formRef = useRef<FormInstance>();

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Typography.Title>Manage Account</Typography.Title>
        <div>
          <FormItem label="Name" name="name" rules={[{ required: true }]}>
            {/* Pull name from logged in user, ask ELI */}
            <Input placeholder="user.name" />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="user.password" />
          </FormItem>

          <FormItem
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="user.password" />
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
