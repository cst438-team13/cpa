import { Avatar, Button, Card, List, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";

export function RequestsCard() {
  const user = useCurrentUserProfile();
  const navigate = useNavigate();
  const refetchQuery = useRefetchQuery();
  const petRequestsData = useQuery("getPetTransferRequests", user!.id);
  const friendRequestsData = useQuery("getFriendRequests", user!.id);

  const onClickAcceptPet = async (requestId: number) => {
    message.loading("Processing");
    const success = await api.acceptPetTransferRequest(requestId);

    if (success) {
      message.destroy();
      message.info("Request accepted!");
      await refetchQuery("getPetTransferRequests", user!.id);
    }
  };

  const onClickDenyPet = async (requestId: number) => {
    message.loading("Processing");
    const success = await api.denyPetTransferRequest(requestId);

    if (success) {
      message.destroy();
      message.info("Request rejected");
      await refetchQuery("getPetTransferRequests", user!.id);
    }
  };

  const onClickAcceptFriend = async (requestId: number) => {
    message.loading("Processing");
    const success = await api.acceptFriendRequest(requestId);

    if (success) {
      message.destroy();
      message.info("Request accepted!");
      await refetchQuery("getFriendRequests", user!.id);
    }
  };

  const onClickDenyFriend = async (requestId: number) => {
    message.loading("Processing");
    const success = await api.denyFriendRequest(requestId);

    if (success) {
      message.destroy();
      message.info("Request rejected");
      await refetchQuery("getFriendRequests", user!.id);
    }
  };

  // Don't show card if no requests exist
  if (petRequestsData.length < 1 && friendRequestsData.length < 1) {
    return <></>;
  }

  return (
    <Card title="Requests" styles={{ body: { paddingTop: 0 } }}>
      {petRequestsData.length > 0 && (
        <List
          header="Pet transfers"
          dataSource={petRequestsData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => onClickAcceptPet(item.id)}
                >
                  Accept
                </Button>,
                <Button onClick={() => onClickDenyPet(item.id)}>Deny</Button>,
              ]}
            >
              <ClickableContainer onClick={() => navigate(`/pet/${item.id}`)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.pet.avatarUrl} />}
                  title={
                    <Typography.Text strong>
                      {item.pet.displayName}
                    </Typography.Text>
                  }
                />
              </ClickableContainer>
            </List.Item>
          )}
        />
      )}
      {friendRequestsData.length > 0 && (
        <List
          header="Friend requests"
          dataSource={friendRequestsData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => onClickAcceptFriend(item.id)}
                >
                  Accept
                </Button>,
                <Button onClick={() => onClickDenyFriend(item.id)}>
                  Deny
                </Button>,
              ]}
            >
              <ClickableContainer onClick={() => navigate(`/user/${item.id}`)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.sender.avatarUrl} />}
                  title={
                    <Typography.Text strong>
                      {item.sender.displayName}
                    </Typography.Text>
                  }
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
