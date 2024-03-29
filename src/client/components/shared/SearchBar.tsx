import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Select, Space } from "antd";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";

export function SearchBar() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useLocalStorage("search-mode", "users");

  const inputRef = useRef<InputRef>(null);

  const onSubmit = () => {
    navigate(
      `/search?mode=${searchMode}&text=${inputRef.current?.input?.value}`
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
        defaultValue={searchMode}
        options={[
          { label: "Users", value: "users" },
          { label: "Pets", value: "pets" },
        ]}
        onChange={(o) => setSearchMode(o)}
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
