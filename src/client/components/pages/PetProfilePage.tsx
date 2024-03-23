import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Input, Row, Typography, message } from "antd";
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
      <Row justify="space-around">
        {/* We're not using this column (yet) but we still want to reserve space for it */}
        <Col flex="400px" />

        <Col flex="650px">
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
                  isEnabled={false}
                  value={profile.displayName}
                  onSubmit={() => message.error("Not implemented")}
                >
                  <Input />
                </Editable>
              </Typography.Title>
            </Flex>
          </Card>
        </Col>

        {/* We're not using this column (yet) but we still want to reserve space for it */}
        <Col flex="400px" />
      </Row>
    </MainLayout>
  );
}
