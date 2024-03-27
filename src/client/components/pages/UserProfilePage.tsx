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
import { ProfileCreatePostCard } from "../profile/ProfileCreatePostCard";
import { ProfilePetsCard } from "../profile/ProfilePetsCard";
import { MainLayout } from "../shared/MainLayout";

export function UserProfilePage() {
  const params = useParams();
  const profileId = Number(params.id);

  const refetchQuery = useRefetchQuery();
  const profile = useQuery("getUserProfile", profileId);

  const currentUser = useCurrentUserProfile();
  const isOwningUser = currentUser?.id === profileId;

  const onChangeField = async (field: keyof UserProfile, value: any) => {
    message.loading("Updating...");

    const newValues = {};
    newValues[field] = value;

    await api.updateUserProfile(profileId, newValues);
    await refetchQuery("getCurrentUserId");
    await refetchQuery("getUserProfile", profileId);

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout>
      <Row justify="space-around">
        <Col flex="400px">
          <ProfilePetsCard userId={profileId} />
        </Col>

        <Col flex="650px">
          <Flex vertical gap={24}>
            <Card title="Profile Details">
              <Flex vertical align="center" gap={18}>
                <Avatar
                  size={128}
                  icon={<UserOutlined />}
                  src={profile.avatarUrl}
                />
                <Typography.Title level={4}>
                  <Editable
                    name="displayName"
                    isEnabled={isOwningUser}
                    value={profile.displayName}
                    onSubmit={(o) => onChangeField("displayName", o)}
                  >
                    <Input />
                  </Editable>
                </Typography.Title>
                <div>
                  <Typography.Text strong>Location: </Typography.Text>
                  <Editable
                    name="location"
                    isEnabled={isOwningUser}
                    value={profile.location}
                    onSubmit={(o) => onChangeField("location", o)}
                  >
                    <Input />
                  </Editable>
                </div>
                <div>
                  <Typography.Text strong>Language: </Typography.Text>
                  <Editable
                    name="language"
                    isEnabled={isOwningUser}
                    value={profile.language}
                    onSubmit={(o) => onChangeField("language", o)}
                  >
                    <Input />
                  </Editable>
                </div>
              </Flex>
            </Card>
            {isOwningUser && <ProfileCreatePostCard />}
          </Flex>
        </Col>

        {/* We're not using this column (yet) but we still want to reserve space for it */}
        <Col flex="400px" />
      </Row>
    </MainLayout>
  );
}
