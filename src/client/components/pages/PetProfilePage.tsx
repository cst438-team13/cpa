import { UserOutlined } from "@ant-design/icons";
import { Card, Flex, Input, Typography, message } from "antd";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { Editable } from "../Editable";
import { MainLayout } from "../shared/MainLayout";

export function PetProfilePage() {
  const params = useParams();
  const profileId = Number(params.id);

  const profile = useQuery("getPetProfile", profileId);

  return (
    <MainLayout>
      <Card title="Pet Info">
        <Flex vertical align="center" gap={18}>
          <Avatar size={128} icon={<UserOutlined />} src={profile.avatarUrl} />
          <Typography.Title level={4}>
            <Editable
              name="displayName"
              isEnabled={false}
              value={profile.displayName}
              onSubmit={() => message.error("Not implemented")}
            >
              <Input />
            </Editable>
          </Typography.Title>
        </Flex>
      </Card>
    </MainLayout>
  );
}
