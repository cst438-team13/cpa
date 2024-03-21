import { Button, Card, Flex, Form, FormInstance, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

export function CreatePostPage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  const onSubmit = async (values) => {
    // TODO: Add values to database
    message.loading("Posting...");
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
      message.info("Posted!");

      navigate("/");
    } else {
      message.error("Post Creation Failed");
    }
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="New Post" style={{ width: 650 }}>
          <Container>
            <div>
              <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
                {/* TEMP */}
                <FormItem
                  label="Picture Url"
                  name="pictureURL"
                  rules={[{ required: true }]}
                >
                  <Input />
                </FormItem>

                <FormItem
                  label="Caption"
                  name="description"
                  rules={[{ required: true }]}
                >
                  <Input />
                </FormItem>

                {/* TEMP */}
                <FormItem label="Pet Tags" name="petTags">
                  <Input />
                </FormItem>

                <Button type="primary" htmlType="submit">
                  Post!
                </Button>
              </Form>
            </div>
          </Container>
        </Card>
      </Flex>
    </MainLayout>
  );
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
