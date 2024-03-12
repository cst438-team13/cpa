import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Typography, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useSetupProfileModal } from "../../hooks/useSetupProfileModal";

export function LandingPage() {
  const { logoutUser } = useAuth();
  const user = useCurrentUserProfile();
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
      <Flex vertical gap={8}>
        <Typography.Title>PawsConnect</Typography.Title>

        {!isLoggedIn ? (
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

function GoogleLoginButton() {
  const queryClient = useQueryClient();
  const { openSetupProfileModal } = useSetupProfileModal();

  const googleLogin = useGoogleLogin({
    onSuccess: async (e) => {
      const token = e.access_token;
      let success = await api.authLoginWithGoogle(token);

      if (!success) {
        const profileInfo = await openSetupProfileModal();
        success = await api.authSignupWithGoogle(token, profileInfo);
      }

      if (success) {
        message.info("Logged in!");
        await queryClient.refetchQueries({
          queryKey: ["getCurrentUserProfile"],
        });
      }
    },
    onError: (e) => {
      message.error(`Google auth failed (${e})`);
    },
  });

  return (
    <Button onClick={() => googleLogin()}>
      <Flex gap={8} justify="center" align="center">
        <img src="svg/google.svg" width={18} />
        Continue with Google
      </Flex>
    </Button>
  );
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
