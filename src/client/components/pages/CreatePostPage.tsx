import { Button, Card, Flex, Form, FormInstance, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

export function CreatePostPage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  const onSubmit = async (values) => {
    // TODO: Add values to database
    message.loading("Posting...");
    if (values.petTags == null) {
      values.petTags = "";
    }
    const success = await api.createPost(
      values.pictureURL,
      values.caption,
      values.petTags,
      "public",
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
          <Flex vertical align="center" style={{ width: "100%" }}>
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
                name="caption"
                rules={[{ required: true }]}
              >
                <Input />
              </FormItem>

              {/* TEMP */}
              <FormItem
                label="Pet/s in Post"
                name="petTags"
                rules={[{ required: true }]}
              >
                <Input />
              </FormItem>

              <Button type="primary" htmlType="submit">
                Post!
              </Button>
            </Form>
          </Flex>
        </Card>
      </Flex>
    </MainLayout>
  );
}
