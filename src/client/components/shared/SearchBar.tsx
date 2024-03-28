import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space } from "antd";
import React from "react";

import styled from "styled-components";

export function SearchBar() {
  return (
    <Space.Compact>
      <SearchInput placeholder="Search profiles.." />
      <Select
        defaultValue="users"
        options={[
          { label: "Users", value: "users" },
          { label: "Pets", value: "pets" },
        ]}
      />
      <Button type="primary">
        <SearchOutlined />
      </Button>
    </Space.Compact>
  );
}

const SearchInput = styled(Input)`
  width: 300px;
`;
