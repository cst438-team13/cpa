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
  const requestsData = useQuery("getPetTransferRequests", user!.id);

  const onClickAccept = async (requestId: number) => {
    message.loading("Processing");
    const success = await api.acceptPetTransferRequest(requestId);

    if (success) {
      message.destroy();
      message.info("Request accepted!");
      await refetchQuery("getPetTransferRequests", user!.id);
    }
  };

  return (
    <Card title="Requests" styles={{ body: { paddingTop: 0 } }}>
      {requestsData.length > 0 && (
        <List
          header="Pet transfers"
          dataSource={requestsData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button onClick={() => onClickAccept(item.id)}>Accept</Button>,
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
                  // description={item.breed}
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
