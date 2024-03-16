import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  // const formRef = useRef<FormInstance>(null);

  return (
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="Profile Details" style={{ width: 650 }}>
          <Flex vertical align="center" style={{ width: "100%" }}>
            <Avatar size={128} icon={<UserOutlined />}></Avatar>
          </Flex>
        </Card>
      </Flex>
    </MainLayout>
  );
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
