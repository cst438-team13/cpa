import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, List, Typography, message } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";
import { MainLayout } from "../shared/MainLayout";

export function ProfilePage() {
  const params = useParams();
  const userId = Number(params.id);

  const refetchQuery = useRefetchQuery();
  const user = useQuery("getUserProfile", userId);

  const currentUser = useCurrentUserProfile();
  const canEdit = currentUser?.id === userId;

  const infoTemplates = ["Location: ", "Language: "];
  const userInfo = [user.location, user.language];

  const onChangeName = async (value: string) => {
    message.loading("Updating...");

    await api.updateUserProfile(userId, value);
    await refetchQuery("getCurrentUserProfile");
    await refetchQuery("getUserProfile", userId);

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout>
      <Flex vertical align="center">
        <Card title="Profile Details" style={{ width: 650 }}>
          <Flex vertical align="center" gap={18}>
            <Avatar size={128} icon={<UserOutlined />} />
            <Typography.Title
              level={4}
              editable={canEdit && { onChange: onChangeName }}
            >
              {user.displayName}
            </Typography.Title>
            <List
              size="large"
              dataSource={userInfo}
              renderItem={(item, index) => (
                <List.Item>
                  <Typography.Text strong>
                    {infoTemplates[index]}
                  </Typography.Text>
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
