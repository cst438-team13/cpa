import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RegisterButton } from "../components/RegisterButton";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>CPA Prototype</Typography.Title>

        <Button type="primary" onClick={() => navigate("/login")}>
          Log in
        </Button>
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
