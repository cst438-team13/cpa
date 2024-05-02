import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import nullthrows from "nullthrows";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";

export function ManageAccountPage() {
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const symbols = ["!", "@", "#", "$", "%", "&", "-", "_"];
  const user = useCurrentUserProfile();
  const navigate = useNavigate();

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

    const success = await api.updateUserAccount(
      nullthrows(user).id,
      values.password
    );

    if (success) {
      message.info("Account updated!");

      // Go back to landing page
      navigate("/");
    } else {
      message.error("Error");
    }
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Typography.Title>Manage Account</Typography.Title>
        <div>
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
