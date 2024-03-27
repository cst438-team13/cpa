import { Flex, Typography } from "antd";
import React from "react";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { FeedCards } from "../shared/FeedCards";
import { MainLayout } from "../shared/MainLayout";

export function HomePage() {
  const user = useCurrentUserProfile();

  return (
    <MainLayout>
      <Flex vertical gap={24} align="center" style={{ width: "100%" }}>
        <Typography.Title>Feed</Typography.Title>
        <FeedCards userId={user!.id} isHomePage={true} />
      </Flex>
    </MainLayout>
  );
}
