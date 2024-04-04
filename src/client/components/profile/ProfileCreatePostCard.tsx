import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Mentions,
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
import { useTagPetsToPostsModal } from "../../hooks/useTagPetsToPostsModal";

export function ProfileCreatePostCard() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  // For handling attached picture
  const [pictureData, setPictureData] = useState<string | null>(null);

  const petList = useQuery("getPetsByUserId", user!.id);

  // Obvious bug here is this doesn't get reset if we remove mentioned pets.
  // Unfortunately the way <Mention> works means we can't do a lot about it.
  const mentionedPetIds = useRef<number[]>([]);

  //open modal to tag pets
  const { openTagPetModal } = useTagPetsToPostsModal(petList);
  const onClickTagPets = async () => {
    const petsTagged = await openTagPetModal();

    // message.loading("Creating pet..");
    // const success = await api.createPetProfile(userId, petInfo);

    // message.destroy();
    // if (success) {
    //   message.info("Pet added!");
    //   await refetchQuery("getPetsByUserId");
    // } else {
    //   message.error("Something went wrong");
    // }
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
        <Mentions
          placeholder={pictureData == null ? "Body text" : "Title text"}
          autoSize={pictureData == null ? { minRows: 3 } : undefined}
          onSelect={(o) => mentionedPetIds.current.push(Number(o.key!))}
          onChange={(o) => (textRef.current = o)}
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
