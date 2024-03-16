import { googleLogout } from "@react-oauth/google";
import { Button, Flex, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useRefetchQuery } from "../../hooks/useQuery";
import { GoogleButton } from "../GoogleButton";

export function LandingPage() {
  const user = useCurrentUserProfile();
  const navigate = useNavigate();
  const refetchQuery = useRefetchQuery();

  const onClickLogout = async () => {
    const success = await api.authLogout();
    googleLogout();

    if (success) {
      // We just changed the result of getCurrentUserId(), so refetch it.
      await refetchQuery("getCurrentUserId");
      message.info("Logged out");
    }
  };

  return (
    <Container>
      <Flex vertical gap={8}>
        <Typography.Title>PawsConnect</Typography.Title>

        {user == null ? (
          <>
            <Button type="primary" onClick={() => navigate("/login")}>
              Log in
            </Button>

            <Button onClick={() => navigate("/register")}>
              Create account
            </Button>

            <br />
            <GoogleButton />
          </>
        ) : (
          <>
            <Button type="primary" onClick={onClickLogout}>
              Log out ({user.displayName})
            </Button>

            <Button type="link" onClick={() => navigate("/manageAccount")}>
              Manage profiles
            </Button>
          </>
        )}
      </Flex>
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
