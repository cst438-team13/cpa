import { Col, Flex, Row, Typography } from "antd";
import React from "react";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { FeedCards } from "../shared/FeedCards";
import { MainLayout } from "../shared/MainLayout";

export function HomePage() {
  const user = useCurrentUserProfile();

  return (
    <MainLayout>
      <Row justify="space-around">
        <Col flex="400px" />

        <Col flex="650px">
          <Flex vertical gap={24} align="center" style={{ width: "100%" }}>
            <Typography.Title>Feed</Typography.Title>
            <FeedCards userId={user!.id} isHomePage={true} />
          </Flex>
        </Col>

        <Col flex="400px" />
      </Row>
    </MainLayout>
  );
}
