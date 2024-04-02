import { UploadOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  FormInstance,
  Mentions,
  Radio,
  Upload,
  message,
} from "antd";
import { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import { getImageFromFile } from "../../helpers/imageHelpers";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

export function ProfileCreatePostCard() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  // Store radio checked value
  const [radioValue, setRadioValue] = useState<"friends" | "public">("public");
  const visOptions = [
    { label: "Public", value: "public" },
    { label: "Friends Only", value: "friends" },
  ];

  // For handling attached picture
  const [pictureData, setPictureData] = useState<string | null>(null);

  const petList = useQuery("getPetsByUserId", user!.id);

  // Obvious bug here is this doesn't get reset if we remove mentioned pets.
  // Unfortunately the way <Mention> works means we can't do a lot about it.
  const mentionedPetIds = useRef<number[]>([]);

  const beforeUploadPicture = async (file: RcFile) => {
    const data = await getImageFromFile(file);
    setPictureData(data);

    return false;
  };

  // changing radio checked value based off user input
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setRadioValue(value);
  };

  const onSubmit = async (values) => {
    if (mentionedPetIds.current.length < 1) {
      message.error("At least 1 pet must be tagged");
      return;
    }

    message.loading("Posting...");

    const success = await api.createPost(
      pictureData,
      values.text,
      mentionedPetIds.current.map(
        (id) => petList.filter((pet) => pet.id === id)[0]
      ),
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
          <Form.Item label="Text" name="text" rules={[{ required: true }]}>
            <Mentions
              placeholder="Input @ to tag pets"
              autoSize={{ minRows: 3 }}
              onSelect={(o) => mentionedPetIds.current.push(Number(o.key!))}
              options={petList.map((pet) => ({
                key: String(pet.id),
                value: pet.displayName,
                label: (
                  <>
                    <Avatar src={pet.avatarUrl} />
                    <span>{pet.displayName}</span>
                  </>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Upload
              maxCount={1}
              beforeUpload={(e) => beforeUploadPicture(e)}
              onRemove={() => setPictureData(null)}
              customRequest={() => {}}
            >
              <Button icon={<UploadOutlined />}>Choose picture</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Visibility">
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
