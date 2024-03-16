import { useGoogleLogin } from "@react-oauth/google";
import { Button, Flex, message } from "antd";
import React from "react";
import { api } from "../api";
import { useRefetchQuery } from "../hooks/useQuery";
import { useSetupProfileModal } from "../hooks/useSetupProfileModal";

export function GoogleButton() {
  const refetchQuery = useRefetchQuery();
  const { openSetupProfileModal } = useSetupProfileModal();

  const onLogin = async (accessToken: string) => {
    message.loading("Logging in...");

    // Try to log in with token from Google
    let success = await api.authLoginWithGoogle(accessToken);

    message.destroy();

    // Login failed, which probably means this user doesn't have an
    // account yet. Try again by creating one.
    if (!success) {
      const profileInfo = await openSetupProfileModal();
      success = await api.authSignupWithGoogle(accessToken, profileInfo);
    }

    if (success) {
      message.info("Logged in!");

      // We just changed the result of getCurrentUserProfile(), so refetch it.
      await refetchQuery("getCurrentUserProfile");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (e) => onLogin(e.access_token),
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
