import { UserOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import type { UserProfile } from "../../../server/models/UserProfile";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";
import { Editable } from "../Editable";
import { ProfileCreatePostCard } from "../profile/ProfileCreatePostCard";
import { ProfileFriendsCard } from "../profile/ProfileFriendsCard";
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

  const isUserFriend = useQuery("isFriendOfUser", currentUser!.id, profileId);

  const onAddFriend = async () => {
    message.loading("Adding...");

    await api.addFriendByUserId(currentUser!.id, profileId);
    await refetchQuery("getFriendsByUserId", currentUser!.id);
    await refetchQuery("getFriendsByUserId", profileId);
    await refetchQuery("isFriendOfUser", currentUser!.id, profileId);

    message.destroy();
    message.info("Friend added!");
  };

  const onRemoveFriend = async () => {
    message.loading("Removing...");

    await api.removeFriendByUserId(currentUser!.id, profileId);
    await refetchQuery("getFriendsByUserId", currentUser!.id);
    await refetchQuery("getFriendsByUserId", profileId);
    await refetchQuery("isFriendOfUser", currentUser!.id, profileId);

    message.destroy();
    message.info("Friend removed!");
  };

  const onChangeField = async (field: keyof UserProfile, value: unknown) => {
    message.loading("Updating...");

    const newValues = {};
    newValues[field] = value;

    await api.updateUserProfile(profileId, newValues);
    await refetchQuery("getUserProfile", profileId);

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout
      leftContent={<ProfilePetsCard userId={profileId} />}
      rightContent={<ProfileFriendsCard userId={profileId} />}
    >
      <Flex vertical gap={24}>
        <Card
          title={
            <Flex align="center" justify="space-between">
              User Info
              {!isOwningUser &&
                (isUserFriend ? (
                  <Button danger onClick={onRemoveFriend}>
                    Remove Friend
                  </Button>
                ) : (
                  <Button onClick={onAddFriend}>Add Friend</Button>
                ))}
            </Flex>
          }
        >
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
        <FeedCards isHomePage={false} userId={profileId} />
      </Flex>
    </MainLayout>
  );
}
