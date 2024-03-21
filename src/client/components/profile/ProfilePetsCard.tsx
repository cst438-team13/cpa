import { DownOutlined } from "@ant-design/icons";

import { Button, Card, Dropdown, List, Typography } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useNavigate } from "react-router";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

type Props = {
  userId: number;
};

export function ProfilePetsCard({ userId }: Props) {
  const user = useQuery("getUserProfile", userId);
  const navigate = useNavigate();

  const currentUser = useCurrentUserProfile();
  const isPageOwner = currentUser?.id === userId;

  // TEMP
  const petsData = [
    {
      name: "Milo",
      breed: "Bulldog",
      avatarUrl: user.avatarUrl,
    },
    {
      name: "Cooper",
      breed: "German Shepard",
      avatarUrl: user.avatarUrl,
    },
  ];

  const dropdownItems = [
    {
      key: "transfer",
      label: "Transfer",
    },
    {
      key: "remove",
      danger: true,
      label: "Remove",
    },
  ];

  return (
    <Card
      title="Pets"
      extra={
        isPageOwner && (
          <Button onClick={() => navigate("/createPet")}>Add</Button>
        )
      }
    >
      <List
        dataSource={petsData}
        renderItem={(item) => (
          <List.Item
            actions={[
              isPageOwner && (
                <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
                  <Button type="link">
                    More <DownOutlined />
                  </Button>
                </Dropdown>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatarUrl} />}
              title={<Typography.Text strong>{item.name}</Typography.Text>}
              description={item.breed}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
