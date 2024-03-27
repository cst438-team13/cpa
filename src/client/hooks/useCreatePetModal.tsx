import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import FormItem from "antd/es/form/FormItem";
import Upload, { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { getScaledImageFromFile } from "../helpers/imageHelpers";

type PetInfo = {
  displayName: string;
  description: string;
  breed: string;
  color: string;
  age: number;
  avatarData: string;
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
        closable: true,
        maskClosable: true,
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

  const onFormFinish = (values: object) => {
    if (avatarData == null) {
      message.error("Must upload a picture");
      return;
    }

    onFinish({ avatarData, ...values });
  };

  return (
    <Flex vertical>
      <Typography.Paragraph>Tell us about your pet.</Typography.Paragraph>
      <Form onFinish={onFormFinish}>
        <Form.Item rules={[{ required: true }]}>
          <ImgCrop>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              customRequest={(e) => handleSetAvatar(e.file as RcFile)}
            >
              <div
                style={{
                  cursor: "pointer",
                  padding: 6,
                }}
              >
                {avatarData == null ? (
                  <>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Picture</div>
                  </>
                ) : (
                  <img
                    src={avatarData}
                    alt="avatar"
                    style={{ width: "100%", borderRadius: 6 }}
                  />
                )}
              </div>
            </Upload>
          </ImgCrop>
        </Form.Item>

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

        <FormItem label="Breed" name="breed" rules={[{ required: true }]}>
          <Input />
        </FormItem>

        <FormItem label="Color" name="color" rules={[{ required: true }]}>
          <Input />
        </FormItem>

        <FormItem label="Age" name="age" rules={[{ required: true }]}>
          <InputNumber />
        </FormItem>

        <Button type="primary" htmlType="submit">
          Create Pet Profile!
        </Button>
      </Form>
    </Flex>
  );
}
