import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { api } from "../api";

export function CreateAccountPage() {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    // TODO: Check if Password is a valid format
    if (values.password != values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const success = await api.registerUser(
      values.username,
      values.password,
      values.name
    );

    if (success) {
      message.info("Account created!");
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
          <FormItem label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>

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
