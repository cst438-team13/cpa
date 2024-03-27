import { PlusOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  FormInstance,
  Input,
  Mentions,
  Radio,
  Typography,
  Upload,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import { getScaledImageFromFile } from "../../helpers/imageHelpers";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

export function ProfileCreatePostCard() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  // storing radio checked value
  const [radioValue, setRadioValue] = useState("public");
  const visOptions = [
    { label: "Public", value: "public" },
    { label: "Friends Only", value: "friends" },
  ];

  // for handling avatar img
  const [avatarData, setAvatarData] = useState<string | null>(null);

  const handleSetAvatar = async (file: RcFile) => {
    const data = await getScaledImageFromFile(file, 128);
    setAvatarData(data);
  };

  // changing radio checked value based off user input
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setRadioValue(value);
  };

  const petList = useQuery("getPetsByUserId", user!.id);

  // checking to see if owner has tagged any pets
  const checkMention = async (_: any, value: string) => {
    const mentions = Mentions.getMentions(value);
    if (mentions.length < 1) {
      throw new Error("At least 1 pet must be Tagged!");
    }
  };

  const onSubmit = async (values) => {
    if (avatarData == null) {
      message.error("Must upload a picture");
      return;
    }
    message.loading("Posting...");

    const success = await api.createPost(
      avatarData,
      values.caption,
      values.petTags,
      radioValue,
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
    <Card title="New Post" style={{ width: 650 }}>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
          <Typography.Paragraph>Add Post Below.</Typography.Paragraph>
          <Form.Item>
            <ImgCrop>
              <Upload
                name="post"
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

          <Form.Item
            label="Caption"
            name="caption"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Pet(s) in Post"
            name="petTags"
            rules={[{ validator: checkMention }]}
          >
            <Mentions
              placeholder="Input @ to tag pets"
              options={petList.map(({ id, displayName, avatarUrl }) => ({
                key: String(id),
                value: String(id),
                label: (
                  <>
                    <Avatar src={avatarUrl} />
                    <span>{displayName}</span>
                  </>
                ),
              }))}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Who can see post">
            <Radio.Group
              name="visibility"
              options={visOptions}
              onChange={onChange}
              value={radioValue}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Post!
          </Button>
        </Form>
      </Flex>
    </Card>
  );
}
