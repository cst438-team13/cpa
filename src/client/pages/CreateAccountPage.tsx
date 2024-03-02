import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

export function CreateAccountPage() {
  const navigate = useNavigate();
  // const { loginUser } = useAuth();

  const onSubmit = async (values) => {
    // TODO: check if username is taken
    // TODO: Check if Password is a valid format
    if (values.password != values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    // TODO: encrypt passord before sending to server
    // TODO: create new user with given info
    console.log(values.username);
    console.log(values.password);
  };

  const formRef = useRef<FormInstance>();

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
            <Input />
          </FormItem>

          <FormItem
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true }]}
          >
            <Input />
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
