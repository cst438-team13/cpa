import { Card, Flex } from "antd";
import React from "react";
import { AppHeader } from "../AppHeader";

export function HomePage() {
  return (
    <AppHeader>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Card title="Some post" style={{ width: 650 }}>
          <p>Post content...</p>
        </Card>
      </Flex>
    </AppHeader>
  );
}
