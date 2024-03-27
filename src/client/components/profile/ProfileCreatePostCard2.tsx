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
import React, { useRef } from "react";
import type { PostVisibility } from "../../../server/models/Post";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

export function ProfileCreatePostCard2() {
  const user = useCurrentUserProfile();
  const petList = useQuery("getPetsByUserId", user!.id);

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

  const bodyTextRef = useRef("");

  const onClickItem = (key: PostVisibility) => {
    if (!bodyTextRef.current) {
      message.error("Post must have some text!");
    }

    message.error("Not implemented");
  };

  return (
    <Card
      title="Post?"
      style={{ width: 650 }}
      styles={{ body: { padding: 16 } }}
    >
      <Flex vertical gap={12}>
        <Mentions
          autoSize={{ minRows: 4 }}
          placeholder="What do you have to say?"
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
          onChange={(text) => (bodyTextRef.current = text)}
        />
        <Flex justify="space-between">
          <Upload maxCount={1}>
            <Button icon={<UploadOutlined />}>Add a picture</Button>
          </Upload>

          <Dropdown
            menu={{
              items: menuItems,
              onClick: (o) => onClickItem(o.key as PostVisibility),
            }}
            trigger={["click"]}
          >
            <Button type="primary">Post!</Button>
          </Dropdown>
        </Flex>
      </Flex>
    </Card>
  );
}
