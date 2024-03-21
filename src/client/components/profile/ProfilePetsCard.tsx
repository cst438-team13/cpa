import { Button, Card, List, Skeleton, Typography } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useQuery } from "../../hooks/useQuery";

type Props = {
  userId: number;
};

export function ProfilePetsCard({ userId }: Props) {
  const user = useQuery("getUserProfile", userId);

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

  return (
    <Card title="Pets">
      <List
        dataSource={petsData}
        renderItem={(item) => (
          <List.Item actions={[<Button>View</Button>]}>
            <Skeleton avatar title={false} loading={false}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatarUrl} />}
                title={<Typography.Text strong>{item.name}</Typography.Text>}
                description={item.breed}
              />
            </Skeleton>
          </List.Item>
        )}
      ></List>
    </Card>
  );
}
