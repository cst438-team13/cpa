import React from "react";
import { RegisterButton } from "../components/RegisterButton";
import styled from "styled-components";
import { Button, Typography } from "antd";

export function LandingPage() {
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>CPA Prototype</Typography.Title>

        <Button type="primary">Log in</Button>
        <RegisterButton />
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
