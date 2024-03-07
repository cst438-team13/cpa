import { Button, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export function LandingPage() {
  const { logoutUser } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const onClickLogout = async () => {
    const success = await logoutUser();

    if (success) {
      message.info("Logged out");
    }
  };

  const isLoggedIn = user != null;

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Typography.Title>PawsConnect</Typography.Title>

        {isLoggedIn ? (
          <Button type="primary" onClick={onClickLogout}>
            Log out ({user.username})
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Log in
          </Button>
        )}
        {!isLoggedIn && (
          <Button onClick={() => navigate("/register")}>Create account</Button>
        )}
        {isLoggedIn && (
          <Button type="link" onClick={() => navigate("/manageAccount")}>
            Manage profiles
          </Button>
        )}
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
