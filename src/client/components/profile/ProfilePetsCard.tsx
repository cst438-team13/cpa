import { DownOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Dropdown,
  Form,
  List,
  Modal,
  Select,
  Typography,
  message,
} from "antd";
import Avatar from "antd/es/avatar/avatar";
import nullthrows from "nullthrows";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserProfile } from "../../../server/models/UserProfile";
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

  const usersData = useQuery("getAllUserProfiles");

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

  const onClickMenuItem = (petId: number, key: string) => {
    if (key === "transfer") {
      const onFinish = async (values: any) => {
        message.loading("Sending request");
        const success = await api.createPetTransferRequest(
          petId,
          values.recieverId as number
        );

        message.destroy();
        if (success) {
          message.info("Request sent!");
        } else {
          message.error("Request already exists");
        }

        destroy();
      };

      const { destroy } = Modal.info({
        title: "New transfer request",
        centered: true,
        closable: true,
        footer: null,
        content: (
          <TransferModalContent
            onFinish={onFinish}
            currentUser={nullthrows(currentUser)}
            usersData={usersData}
          />
        ),
      });
    }
  };

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
                  <Dropdown
                    menu={{
                      items: dropdownItems,
                      onClick: (e) => onClickMenuItem(item.id, e.key),
                    }}
                    trigger={["click"]}
                  >
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

function TransferModalContent({
  currentUser,
  usersData,
  onFinish,
}: {
  currentUser: UserProfile;
  usersData: UserProfile[];
  onFinish: (values: any) => void;
}) {
  const [isValueChosen, setIsValueChosen] = useState<boolean>(true);

  return (
    <Form style={{ marginTop: 12 }} onFinish={onFinish}>
      <Form.Item label="Transfer to" name="recieverId">
        <Select
          onChange={(o) => setIsValueChosen(o != null && o != "")}
          options={usersData
            .filter((o) => o.id !== currentUser?.id)
            .map((o) => ({
              label: o.displayName,
              value: o.id,
            }))}
        />
      </Form.Item>
      <Button disabled={!isValueChosen} type="primary" htmlType="submit">
        Send
      </Button>
    </Form>
  );
}

const ClickableContainer = styled("div")`
  cursor: pointer;
  width: 100%;
`;
