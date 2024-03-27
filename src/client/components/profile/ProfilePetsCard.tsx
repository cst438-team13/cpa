import { DownOutlined } from "@ant-design/icons";

import { Button, Card, Dropdown, List, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";
import { useCreatePetModal } from "../../hooks/useCreatePetModal";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";

type Props = {
  userId: number;
};

export function ProfilePetsCard({ userId }: Props) {
  const { openCreatePetModal } = useCreatePetModal();
  const navigate = useNavigate();

  const currentUser = useCurrentUserProfile();
  const isPageOwner = currentUser?.id === userId;

  const petsData = useQuery("getPetsByUserId", userId);
  const refetchQuery = useRefetchQuery();

  const onClickCreatePet = async () => {
    const petInfo = await openCreatePetModal();

    message.loading("Creating pet..");
    const success = await api.createPetProfile(userId, petInfo);

    message.destroy();
    if (success) {
      message.info("Pet added!");
      await refetchQuery("getPetsByUserId");
    } else {
      message.error("Something went wrong");
    }
  };

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
      {petsData.length > 0 && (
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
              <ClickableContainer onClick={() => navigate(`/pet/${item.id}`)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatarUrl} />}
                  title={
                    <Typography.Text strong>{item.displayName}</Typography.Text>
                  }
                  description={item.breed}
                />
              </ClickableContainer>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

const ClickableContainer = styled("div")`
  cursor: pointer;
  width: 100%;
`;
