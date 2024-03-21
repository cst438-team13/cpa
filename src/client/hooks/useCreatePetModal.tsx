import { Button, Flex, Form, Input, Modal, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";
import { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { getScaledImageFromFile } from "../helpers/imageHelpers";

type PetInfo = {
  displayName: string;
  description: string;
  avatarUrl: string;
  breed: string;
  color: string;
  age: number;
};

export function useCreatePetModal() {
  const openCreatePetModal = () =>
    new Promise<PetInfo>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as PetInfo);
      };

      const { destroy } = Modal.info({
        title: "Create pet",
        centered: true,
        closable: false,
        footer: null,
        content: <CreatePetContent onFinish={onFinish} />,
      });
    });

  return { openCreatePetModal };
}

type ContentProps = {
  onFinish: (values: unknown) => void;
};

function CreatePetContent({ onFinish }: ContentProps) {
  const [avatarData, setAvatarData] = useState<string | null>(null);

  const handleSetAvatar = async (file: RcFile) => {
    const data = await getScaledImageFromFile(file, 128);
    setAvatarData(data);
  };

  return (
    <Flex vertical>
      <Typography.Paragraph>Tell us about your pet.</Typography.Paragraph>
      <Form onFinish={onFinish} autoComplete="off">
        <FormItem label="Name" name="displayName" rules={[{ required: true }]}>
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
          label="Avatar URL"
          name="avatarUrl"
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
          Create Pet Profile!
        </Button>
      </Form>
    </Flex>
  );
}
