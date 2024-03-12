import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Flex, message } from "antd";
import React from "react";
import { api } from "../api";
import { useSetupProfileModal } from "../hooks/useSetupProfileModal";

export function GoogleLoginButton() {
  const queryClient = useQueryClient();
  const { openSetupProfileModal } = useSetupProfileModal();

  const onLogin = async (accessToken: string) => {
    let success = await api.authLoginWithGoogle(accessToken);

    if (!success) {
      const profileInfo = await openSetupProfileModal();
      success = await api.authSignupWithGoogle(accessToken, profileInfo);
    }

    if (success) {
      message.info("Logged in!");
      await queryClient.refetchQueries({
        queryKey: ["getCurrentUserProfile"],
      });
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
