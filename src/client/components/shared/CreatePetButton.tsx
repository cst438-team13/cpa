import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useRefetchQuery } from "../../hooks/useQuery";

export function CreatePetButton() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const refetchQuery = useRefetchQuery();

  const menuItems = [
    { label: "Profile", key: "profile" },
    { label: "Log out", key: "logout", danger: true },
  ];

  return <Button type={"primary"} shape="circle" />;
}
