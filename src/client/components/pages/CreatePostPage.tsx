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
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import FormItem from "antd/es/form/FormItem";
import Upload, { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PetProfile } from "../../../server/models/PetProfile";
import { api } from "../../api";
import { getScaledImageFromFile } from "../../helpers/imageHelpers";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

const { getMentions } = Mentions;

const petsOwned = {
  list: new Array<PetProfile>(),
  tagged: new Array<number>(),
};

export function CreatePostPage() {
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

  // loading animation while bringing up pets
  // searches for pets with same letters as owner input.
  const [loading, setLoading] = useState(false);
  const onSearch = async (search: string) => {
    setLoading(!!search);

    const petList = await api.getPetsByUserId(user!.id);
    petsOwned.list = petList;
    setLoading(false);
  };

  // checking to see if owner has tagged any pets
  const checkMention = async (_: any, value: string) => {
    const mentions = getMentions(value);
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
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="New Post" style={{ width: 650 }}>
          <Flex vertical align="center" style={{ width: "100%" }}>
            <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
              <Typography.Paragraph>Add Post Below.</Typography.Paragraph>
              <FormItem>
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
              </FormItem>

              <FormItem
                label="Caption"
                name="caption"
                rules={[{ required: true }]}
              >
                <Input />
              </FormItem>

              <FormItem
                label="Pet/s in Post"
                name="petTags"
                rules={[{ validator: checkMention }]}
              >
                <Mentions
                  placeholder="input @ to tag pets"
                  onSearch={onSearch}
                  loading={loading}
                  options={petsOwned.list.map(
                    ({ id, displayName, avatarUrl }) => ({
                      key: String(id),
                      value: displayName,
                      label: (
                        <>
                          <Avatar src={avatarUrl} />
                          <span>{displayName}</span>
                        </>
                      ),
                    })
                  )}
                  allowClear
                ></Mentions>
              </FormItem>

              <Typography.Text>Who Can See Post: </Typography.Text>
              <Radio.Group
                name="visibility"
                options={visOptions}
                onChange={onChange}
                value={radioValue}
                optionType="button"
                buttonStyle="solid"
              />
              <br></br>
              <br></br>

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
