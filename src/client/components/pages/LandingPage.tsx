import { googleLogout } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { GoogleLoginButton } from "../GoogleLoginButton";

export function LandingPage() {
  const user = useCurrentUserProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClickLogout = async () => {
    const success = await api.authLogout();
    googleLogout();

    if (success) {
      // We just changed the result of getCurrentUserProfile(), so refetch it.
      await queryClient.refetchQueries({
        queryKey: ["getCurrentUserProfile"],
      });

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
            <GoogleLoginButton />
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
