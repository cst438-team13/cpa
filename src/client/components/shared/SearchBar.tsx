import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Select, Space } from "antd";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

type SearchMode = "users" | "pets";

export function SearchBar() {
  const navigate = useNavigate();

  const inputRef = useRef<InputRef>(null);
  const selectValue = useRef<SearchMode>("users");

  const onSubmit = () => {
    navigate(
      `/search?mode=${selectValue.current}&text=${inputRef.current?.input?.value}`
    );
  };

  return (
    <Space.Compact>
      <SearchInput
        placeholder="Search profiles.."
        ref={inputRef}
        onKeyUp={(e) => e.key === "Enter" && onSubmit()}
      />
      <Select
        defaultValue="users"
        options={[
          { label: "Users", value: "users" },
          { label: "Pets", value: "pets" },
        ]}
        onChange={(o) => (selectValue.current = o as SearchMode)}
      />
      <Button type="primary" onClick={() => onSubmit()}>
        <SearchOutlined />
      </Button>
    </Space.Compact>
  );
}

const SearchInput = styled(Input)`
  width: 300px;
`;
