import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Input, Row, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import type { UserProfile } from "../../../server/models/UserProfile";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";
import { Editable } from "../Editable";
import { ProfilePetsCard } from "../profile/ProfilePetsCard";
import { MainLayout } from "../shared/MainLayout";

export function ProfilePage() {
  const params = useParams();
  const userId = Number(params.id);

  const refetchQuery = useRefetchQuery();
  const user = useQuery("getUserProfile", userId);

  const currentUser = useCurrentUserProfile();
  const canEdit = currentUser?.id === userId;

  const onChangeField = async (field: keyof UserProfile, value: any) => {
    message.loading("Updating...");

    const newValues = {};
    newValues[field] = value;

    await api.updateUserProfile(userId, newValues);
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
              <Typography.Title level={4}>
                <Editable
                  name="displayName"
                  isEnabled={canEdit}
                  value={user.displayName}
                  onSubmit={(o) => onChangeField("displayName", o)}
                >
                  <Input />
                </Editable>
              </Typography.Title>
              <div>
                <Typography.Text strong>Location: </Typography.Text>
                <Editable
                  name="location"
                  isEnabled={canEdit}
                  value={user.location}
                  onSubmit={(o) => onChangeField("location", o)}
                >
                  <Input />
                </Editable>
              </div>
              <div>
                <Typography.Text strong>Language: </Typography.Text>
                <Editable
                  name="language"
                  isEnabled={canEdit}
                  value={user.language}
                  onSubmit={(o) => onChangeField("language", o)}
                >
                  <Input />
                </Editable>
              </div>
            </Flex>
          </Card>
        </Col>

        {/* We're not using this column (yet) but we still want to reserve space for it */}
        <Col flex="400px" />
      </Row>
    </MainLayout>
  );
}
