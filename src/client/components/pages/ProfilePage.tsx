import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Flex, List, Row, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";
import { ProfilePetsCard } from "../profile/ProfilePetsCard";
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
    await refetchQuery("getCurrentUserId");
    await refetchQuery("getUserProfile", userId);

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout>
      <Row justify="space-around">
        <Col flex="400px">
          <ProfilePetsCard userId={userId} />
        </Col>

        <Col flex="650px">
          <Card title="Profile Details">
            <Flex vertical align="center" gap={18}>
              <Avatar size={128} icon={<UserOutlined />} src={user.avatarUrl} />
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
              />
            </Flex>
          </Card>
        </Col>

        <Col flex="400px">{/* <Card title="Friends"></Card> */}</Col>
      </Row>
    </MainLayout>
  );
}
