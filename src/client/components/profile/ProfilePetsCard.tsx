import { DownOutlined } from "@ant-design/icons";

import { Button, Card, Dropdown, List, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { api } from "../../api";
import { useCreatePetModal } from "../../hooks/useCreatePetModal";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

type Props = {
  userId: number;
};

export function ProfilePetsCard({ userId }: Props) {
  const user = useQuery("getUserProfile", userId);
  const { openCreatePetModal } = useCreatePetModal();

  const currentUser = useCurrentUserProfile();
  const isPageOwner = currentUser?.id === userId;

  const onClickCreatePet = async () => {
    const petInfo = await openCreatePetModal();

    message.loading("Creating pet..");
    const success = await api.createPetProfile(
      petInfo.displayName,
      petInfo.description,
      petInfo.avatarUrl,
      petInfo.breed,
      petInfo.color,
      petInfo.age,
      userId
    );

    message.destroy();
    if (success) {
      message.info("Pet added!");
    } else {
      message.error("Something went wrong");
    }
  };

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
        isPageOwner && <Button onClick={() => onClickCreatePet()}>Add</Button>
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
