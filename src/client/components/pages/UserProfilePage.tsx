import { UserOutlined } from "@ant-design/icons";
import { Card, Flex, Input, Typography, message } from "antd";
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
import { FeedCards } from "../shared/FeedCards";
import { MainLayout } from "../shared/MainLayout";

export function UserProfilePage() {
  const params = useParams();
  const profileId = Number(params.id);

  const refetchQuery = useRefetchQuery();
  const profile = useQuery("getUserProfile", profileId);

  const currentUser = useCurrentUserProfile();
  const isOwningUser = currentUser?.id === profileId;

  const onChangeField = async (field: keyof UserProfile, value: unknown) => {
    message.loading("Updating...");

    const newValues = {};
    newValues[field] = value;

    await api.updateUserProfile(profileId, newValues);
    await refetchQuery("getCurrentUserProfile");

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout leftContent={<ProfilePetsCard userId={profileId} />}>
      <Flex vertical gap={24}>
        <Card title="User Info">
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
              <Typography.Text strong>Username: </Typography.Text>
              {profile.username}
            </div>
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
        <FeedCards userId={profileId} />
      </Flex>
    </MainLayout>
  );
}
