import { Card, Flex } from "antd";
import React from "react";
import { MainLayout } from "../shared/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="Some post" style={{ width: 650 }}>
          <p>Post content...</p>
        </Card>
      </Flex>
    </MainLayout>
  );
}
