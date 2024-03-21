import { Button, Layout } from "antd";
import React from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CreatePostButton } from "./CreatePostButton";
import { SearchBar } from "./SearchBar";
import { UserButton } from "./UserButton";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <LayoutCustom>
      <HeaderCustom>
        <LeftButtonsContainer>
          <Button type="link" onClick={() => navigate("/")}>
            Home
          </Button>
        </LeftButtonsContainer>
        <SearchBar />
        <RightButtonsContainer>
          {/* TODO: Implement Create Pet Button */}
          <CreatePostButton />
          <UserButton />
        </RightButtonsContainer>
      </HeaderCustom>
      <Layout.Content style={{ padding: 24 }}>{children}</Layout.Content>
    </LayoutCustom>
  );
}

const LeftButtonsContainer = styled("div")`
  position: absolute;
  left: 12px;
`;

const RightButtonsContainer = styled("div")`
  position: absolute;
  right: 12px;
`;

const LayoutCustom = styled(Layout)`
  min-height: 100%;
  background-color: #f0f2f5;
`;

const HeaderCustom = styled(Layout.Header)`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
