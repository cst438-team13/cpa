import { Card, List, Typography } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "../../hooks/useQuery";

type Props = {
  userId: number;
};

export function ProfileFriendsCard({ userId }: Props) {
  const navigate = useNavigate();
  const friendsData = useQuery("getFriendsByUserId", userId);

  return (
    <Card title="Friends">
      {friendsData.length > 0 && (
        <List
          dataSource={friendsData}
          renderItem={(item) => (
            <List.Item>
              <ClickableContainer onClick={() => navigate(`/user/${item.id}`)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatarUrl} />}
                  title={
                    <Typography.Text strong>{item.displayName}</Typography.Text>
                  }
                  description={`@${item.username}`}
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
