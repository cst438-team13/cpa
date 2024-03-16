import { UserOutlined } from "@ant-design/icons";
import { googleLogout } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

export function UserButton() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onClickLogout = async () => {
    const success = await api.authLogout();
    googleLogout();

    if (success) {
      // We just changed the result of getCurrentUserProfile(), so refetch it.
      await queryClient.refetchQueries({
        queryKey: ["getCurrentUserProfile"],
      });

      navigate("/");
      message.info("Logged out");
    }
  };

  const onClickMenuItem = async (menuItemKey) => {
    if (menuItemKey === "logout") {
      await onClickLogout();
    } else if (menuItemKey == "profile") {
      navigate("/profilePage");
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
