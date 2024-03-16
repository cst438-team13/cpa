import { Button, Flex, Form, Input, Modal, Select, Typography } from "antd";
import React from "react";

type ProfileInfo = {
  displayName: string;
  location: string;
  language: string;
};

export function useSetupProfileModal() {
  const openSetupProfileModal = () =>
    new Promise<ProfileInfo>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as ProfileInfo);
      };

      const { destroy } = Modal.info({
        title: "Set up your profile",
        centered: true,
        closable: false,
        footer: null,
        content: (
          <Flex vertical>
            <Typography.Paragraph>
              Almost done! Now it&lsquo;s time to set up your profile.
            </Typography.Paragraph>
            <Form onFinish={onFinish} initialValues={{ language: "en" }}>
              <Form.Item
                label="Name"
                name="displayName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Language (preferred)" name="language">
                <Select
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                  ]}
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Ok
              </Button>
            </Form>
          </Flex>
        ),
      });
    });

  return { openSetupProfileModal };
}
