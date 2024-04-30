import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import React, { useState } from "react";
import { getScaledImageFromFile } from "../helpers/imageHelpers";

type ProfileInfo = {
  displayName: string;
  location: string;
  language: string;
  avatarData: string | null;
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
        content: <SetupProfileContent onFinish={onFinish} />,
      });
    });

  return { openSetupProfileModal };
}

type ContentProps = {
  onFinish: (values: unknown) => void;
};

function SetupProfileContent({ onFinish }: ContentProps) {
  const [avatarData, setAvatarData] = useState<string | null>(null);

  const handleSetAvatar = async (file: RcFile) => {
    const data = await getScaledImageFromFile(file, 128);
    setAvatarData(data);
  };

  const languages = getLangCodeList().map((o) => ({
    value: o,
    label: getLangNameFromCode(o)?.name,
  }));

  return (
    <Flex vertical>
      <Typography.Paragraph>
        Almost done! Now it&apos;s time to set up your profile.
      </Typography.Paragraph>
      <Form
        onFinish={(values) => {
          onFinish({ avatarData: avatarData, ...values });
        }}
        initialValues={{ language: "en" }}
      >
        <Form.Item>
          <ImgCrop>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              customRequest={(e) => handleSetAvatar(e.file as RcFile)}
              className="avatar-upload"
              style={{ cursor: "pointer" }}
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

        <Form.Item label="Name" name="displayName" rules={[{ required: true }]}>
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
          <Select options={languages} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Ok
        </Button>
      </Form>
    </Flex>
  );
}
