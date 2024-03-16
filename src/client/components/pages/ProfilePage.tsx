import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, List, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { MainLayout } from "../shared/MainLayout";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const infoTemplates = ["Name:", "Location:", "Language:"];
  const userInfo = [user?.displayName, user?.location, user?.language];

  // const formRef = useRef<FormInstance>(null);

  return (
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="Profile Details" style={{ width: 650 }}>
          <Flex vertical align="center" style={{ width: "100%" }}>
            <Avatar size={128} icon={<UserOutlined />}></Avatar>
            <br></br>
            <List
              size="large"
              dataSource={userInfo}
              renderItem={(item, index) => (
                <List.Item>
                  <Typography.Text strong>
                    {infoTemplates[index]}
                  </Typography.Text>{" "}
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

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
