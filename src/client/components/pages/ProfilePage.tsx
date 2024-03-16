import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, List, Typography } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { MainLayout } from "../shared/MainLayout";

export function ProfilePage() {
  const params = useParams();
  const userId = params.id;

  const { data: user } = useQuery("getUserProfile", Number(userId));

  const infoTemplates = ["Name:", "Location:", "Language:"];
  const userInfo = [user.displayName, user.location, user.language];

  return (
    <MainLayout>
      <Flex vertical align="center">
        <Card title="Profile Details" style={{ width: 650 }}>
          <Flex vertical align="center" gap={18}>
            <Avatar size={128} icon={<UserOutlined />} />
            <List
              size="large"
              dataSource={userInfo}
              renderItem={(item, index) => (
                <List.Item>
                  <Typography.Text strong>
                    {infoTemplates[index]}
                  </Typography.Text>{" "}
                  {item}
                </List.Item>
              )}
            ></List>
          </Flex>
        </Card>
      </Flex>
    </MainLayout>
  );
}
