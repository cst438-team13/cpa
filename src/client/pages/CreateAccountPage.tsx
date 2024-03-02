import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

export function CreateAccountPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>Create Account</Typography.Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Back
        </Button>
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
