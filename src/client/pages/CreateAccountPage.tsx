import { Typography } from "antd";
import React from "react";
import styled from "styled-components";

export function CreateAccountPage() {
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>Create Account</Typography.Title>
      </div>
    </Container>
  );
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
