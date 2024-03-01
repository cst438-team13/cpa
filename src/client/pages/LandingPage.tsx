import { Button, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RegisterButton } from "../components/RegisterButton";
import { useAuth } from "../hooks/useAuth";
import { useLoggedInUser } from "../hooks/useLoggedInUser";

export function LandingPage() {
  const { logoutUser } = useAuth();
  const user = useLoggedInUser();
  const navigate = useNavigate();

  const isLoggedIn = user != null;

  const onClickLogout = async () => {
    const success = await logoutUser();

    if (success) {
      message.info("Logged out");
    }
  };

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>CPA Prototype</Typography.Title>

        {isLoggedIn ? (
          <Button type="primary" onClick={onClickLogout}>
            Log out ({user.username})
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Log in
          </Button>
        )}
        <RegisterButton />
        {isLoggedIn && <Button type="link">Manage profiles</Button>}
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
