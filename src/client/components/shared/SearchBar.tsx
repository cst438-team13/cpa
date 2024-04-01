import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { useSessionStorage } from "usehooks-ts";

export function SearchBar() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useSessionStorage("search-mode", "users");
  const [searchText, setSearchText] = useSessionStorage("search-text", "");

  const onSubmit = () => {
    navigate(`/search?mode=${searchMode}&text=${searchText}`);
  };

  return (
    <SearchContainer>
      <Input
        defaultValue={searchText}
        placeholder="Search by name.."
        onChange={(e) => setSearchText(e.target.value)}
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
    </SearchContainer>
  );
}

const SearchContainer = styled(Space.Compact)`
  width: 400px;
`;
