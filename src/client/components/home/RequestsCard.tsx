import { Avatar, Button, Card, List, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery } from "../../hooks/useQuery";

export function RequestsCard() {
  const user = useCurrentUserProfile();
  const navigate = useNavigate();
  const requestsData = useQuery("getPetTransferRequests", user!.id);

  return (
    <Card title="Requests" styles={{ body: { paddingTop: 0 } }}>
      {requestsData.length > 0 && (
        <List
          header="Pet transfers"
          dataSource={requestsData}
          renderItem={(item) => (
            <List.Item actions={[<Button>Accept</Button>]}>
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
