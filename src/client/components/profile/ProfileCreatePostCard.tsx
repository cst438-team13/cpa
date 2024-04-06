import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { RcFile } from "antd/es/upload";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PetProfile } from "../../../server/models/PetProfile";
import { api } from "../../api";
import { getImageFromFile } from "../../helpers/imageHelpers";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";
import { useTagPetsToPostsModal } from "../../hooks/useTagPetsToPostsModal";

export function ProfileCreatePostCard() {
  const STRING_MAX = 255;
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const [petsTagged, setPetsTagged] = useState<Array<PetProfile> | null>(null);

  // For handling attached picture
  const [pictureData, setPictureData] = useState<string | null>(null);

  //open modal to tag pets
  const petList = useQuery("getPetsByUserId", user!.id);
  const { openTagPetModal } = useTagPetsToPostsModal(petList);
  const onClickTagPets = async () => {
    // array of pet ids tagged in modal
    const petsFromModal = await openTagPetModal();
    setPetsTagged(petsFromModal.tagged);
  };

  const beforeUploadPicture = async (file: RcFile) => {
    const data = await getImageFromFile(file);
    setPictureData(data);

    return false;
  };

  const onSubmit = async (values) => {
    if (!values.text) {
      message.error("Text must not be empty!");
      return;
    }

    if (values.text.length > 255) {
      message.error("Text must be less than or equal to 255 characters!");
      return;
    }

    if (petsTagged == null || petsTagged.length == 0) {
      message.error("At least 1 pet must be tagged");
      return;
    }

    message.loading("Posting...");

    const success = await api.createPost(
      pictureData,
      values.text,
      petsTagged,
      values.visibility,
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

  const textRef = useRef<string>("");

  const menuItems = [
    {
      key: "public",
      label: "Post as public",
    },
    {
      key: "friends",
      label: "Post as friends-only",
    },
  ];

  const onClickMenuItem = (key: string) => {
    onSubmit({
      text: textRef.current,
      visibility: key,
    });
  };

  return (
    <Card title="New Post" style={{ width: 650 }}>
      <Flex vertical align="flex-end" gap={12}>
        <TextArea
          name="caption"
          count={{ show: true, max: STRING_MAX }}
          placeholder={pictureData == null ? "Body text" : "Title text"}
          autoSize={pictureData == null ? { minRows: 3 } : undefined}
          onChange={(e) => (textRef.current = e.target.value)}
        />
        <br></br>

        <Flex gap={12}>
          <Upload
            maxCount={1}
            beforeUpload={(e) => beforeUploadPicture(e)}
            onRemove={() => setPictureData(null)}
            customRequest={() => {}}
          >
            <Button icon={<UploadOutlined />}>Choose picture</Button>
          </Upload>
          <br></br>
          <br></br>

          <Button onClick={onClickTagPets}>Tag Pets in Post</Button>

          <Dropdown
            trigger={["click"]}
            menu={{ items: menuItems, onClick: (e) => onClickMenuItem(e.key) }}
          >
            <Button type="primary">Post</Button>
          </Dropdown>
        </Flex>
      </Flex>
    </Card>
  );
}
