import { Flex } from "antd";
import React from "react";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { RequestsCard } from "../home/RequestsCard";
import { FeedCards } from "../shared/FeedCards";
import { MainLayout } from "../shared/MainLayout";

export function HomePage() {
  const user = useCurrentUserProfile();

  return (
    <MainLayout rightContent={<RequestsCard />}>
      <Flex vertical gap={24} align="center" style={{ width: "100%" }}>
        <FeedCards isHomePage userId={user!.id} />
      </Flex>
    </MainLayout>
  );
}
