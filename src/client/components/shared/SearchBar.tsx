import { SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Space } from "antd";
import React from "react";

import styled from "styled-components";

export function SearchBar() {
  return (
    <Space.Compact>
      <SearchInput placeholder="Search.." />
      <SearchButton />
    </Space.Compact>
  );
}

function SearchButton() {
  const menuItems = [
    {
      key: "1",
      label: "Search users",
    },
    {
      key: "2",
      label: "Search pets",
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button type="primary">
        <SearchOutlined />
      </Button>
    </Dropdown>
  );
}

const SearchInput = styled(Input)`
  width: 300px;
`;
