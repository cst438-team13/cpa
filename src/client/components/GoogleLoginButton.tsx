import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Flex, message } from "antd";
import React from "react";
import { api } from "../api";
import { useSetupProfileModal } from "../hooks/useSetupProfileModal";

export function GoogleLoginButton() {
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
