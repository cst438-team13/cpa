import { UserOutlined } from "@ant-design/icons";
import { googleLogout } from "@react-oauth/google";
import { Button, Dropdown, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useRefetchQuery } from "../../hooks/useQuery";

export function UserButton() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const refetchQuery = useRefetchQuery();

  const onClickLogout = async () => {
    const success = await api.authLogout();
    googleLogout();

    if (success) {
      // We just changed the result of getCurrentUserId(), so refetch it.
      await refetchQuery("getCurrentUserId");
      sessionStorage.clear();

      navigate("/");
      message.info("Logged out");
    }
  };

  const onClickMenuItem = async (menuItemKey) => {
    if (menuItemKey === "logout") {
      await onClickLogout();
    } else if (menuItemKey == "profile") {
      navigate(`/user/${user?.id}`);
    }
  };

  const menuItems = [
    { label: "Profile", key: "profile" },
    { label: "Log out", key: "logout", danger: true },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: (e) => onClickMenuItem(e.key) }}
      trigger={["click"]}
    >
      <Button type={"primary"} shape="circle" icon={<UserOutlined />} />
    </Dropdown>
  );
}
