import { PlusOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import {
  Button,
  Card,
  Flex,
  Form,
  FormInstance,
  Input,
  message,
  Radio,
  Typography,
} from "antd";
import ImgCrop from "antd-img-crop";
import FormItem from "antd/es/form/FormItem";
import Upload, { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import { getScaledImageFromFile } from "../../helpers/imageHelpers";
import { useAddPetToPostModal } from "../../hooks/useAddPetToPostModal";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

export function CreatePostPage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const { openAddPetsModal } = useAddPetToPostModal(user!.id);

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

  const onSubmit = async (values) => {
    if (avatarData == null) {
      message.error("Must upload a picture");
      return;
    }
    message.loading("Posting...");

    const success = await api.createPost(
      avatarData,
      values.caption,
      "temp garfield",
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

  // opens modal when add pets button is clicked
  const addPets = async () => {
    // get list of user pets before opening modal
    const petList = await api.getPetsByUserId(user!.id);
    const petsTagged = await openAddPetsModal(petList);
  };

  const formRef = useRef<FormInstance>(null);

  return (
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="New Post" style={{ width: 650 }}>
          <Flex vertical align="center" style={{ width: "100%" }}>
            <Form onFinish={onSubmit} autoComplete="off" ref={formRef}>
              {/* TEMP */}
              <Typography.Paragraph>Add Post Below.</Typography.Paragraph>
              <FormItem>
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
              </FormItem>

              <FormItem
                label="Caption"
                name="caption"
                rules={[{ required: true }]}
              >
                <Input />
              </FormItem>

              {/* TEMP */}
              <FormItem label="Pet/s in Post" name="petTags">
                <Button onClick={addPets}>Pets</Button>
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
