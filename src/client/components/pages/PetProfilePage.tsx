import { UserOutlined } from "@ant-design/icons";
import { Card, Flex, Input, InputNumber, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import { PetProfile } from "../../../server/models/PetProfile";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useQuery, useRefetchQuery } from "../../hooks/useQuery";
import { Editable } from "../Editable";
import { FeedCards } from "../shared/FeedCards";
import { MainLayout } from "../shared/MainLayout";

export function PetProfilePage() {
  const params = useParams();
  const profileId = Number(params.id);

  const refetchQuery = useRefetchQuery();
  const profile = useQuery("getPetProfile", profileId);

  const currentUser = useCurrentUserProfile();
  const isOwningUser = currentUser?.id === profile.owner.id;

  const onChangeField = async (field: keyof PetProfile, value: unknown) => {
    message.loading("Updating...");

    const newValues = {};
    newValues[field] = value;

    await api.updatePetProfile(profileId, newValues);
    await refetchQuery("getPetProfile", profileId);

    message.destroy();
    message.info("Updated!");
  };

  return (
    <MainLayout>
      <Flex vertical gap={24}>
        <Card title="Pet Info">
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
            <div style={{ maxWidth: 400 }}>
              <Typography.Text strong>Description: </Typography.Text>
              <Editable
                name="description"
                isEnabled={isOwningUser}
                value={profile.description}
                onSubmit={(o) => onChangeField("description", o)}
              >
                <Input />
              </Editable>
            </div>
            <div>
              <Typography.Text strong>Breed: </Typography.Text>
              <Editable
                name="breed"
                isEnabled={isOwningUser}
                value={profile.breed}
                onSubmit={(o) => onChangeField("breed", o)}
              >
                <Input />
              </Editable>
            </div>
            <div>
              <Typography.Text strong>Color: </Typography.Text>
              <Editable
                name="color"
                isEnabled={isOwningUser}
                value={profile.color}
                onSubmit={(o) => onChangeField("color", o)}
              >
                <Input />
              </Editable>
            </div>
            <div>
              <Typography.Text strong>Age: </Typography.Text>
              <Editable
                name="age"
                isEnabled={isOwningUser}
                value={profile.age}
                onSubmit={(o) => onChangeField("age", o)}
              >
                <InputNumber />
              </Editable>
            </div>
          </Flex>
        </Card>
        <FeedCards petId={profileId} />
      </Flex>
    </MainLayout>
  );
}
