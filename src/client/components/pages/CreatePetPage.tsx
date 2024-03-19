import { Button, Form, FormInstance, Input, Typography, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useRefetchQuery } from "../../hooks/useQuery";
import { useSetupProfileModal } from "../../hooks/useSetupProfileModal";

export function CreatePetPage() {
  const navigate = useNavigate();
  const refetchQuery = useRefetchQuery();
  const { openSetupProfileModal } = useSetupProfileModal();
  const user = useCurrentUserProfile();

  const onSubmit = async (values) => {
    // TODO: Add values to database
    message.loading("Creating Pet Profile...");
    const success = await api.updatePetAccount(
      values.name,
      values.description,
      values.pictureURL,
      values.breed,
      values.color,
      values.age,
      user!.id
    );

    if (success) {
      message.destroy();
      message.info("Created Pet Account!");

      navigate("/");
    } else {
      message.error("Pet Account Creation Failed");
    }
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <Container>
      <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
        <Typography.Title>Create Pet Profile</Typography.Title>
        <div>
          <FormItem label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>

          <FormItem
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="Picture Url"
            name="pictureURL"
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>

          <FormItem label="Breed" name="breed" rules={[{ required: true }]}>
            <Input />
          </FormItem>

          <FormItem label="Color" name="color" rules={[{ required: true }]}>
            <Input />
          </FormItem>

          <FormItem label="Age" name="age" rules={[{ required: true }]}>
            <Input />
          </FormItem>

          <Button type="primary" htmlType="submit">
            Create Pet Account!
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
