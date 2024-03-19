import { Layout } from "antd";
import React from "react";

import styled from "styled-components";
import { CreatePetButton } from "./CreatePetButton";
import { SearchBar } from "./SearchBar";
import { UserButton } from "./UserButton";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutCustom>
      <HeaderCustom>
        <SearchBar />
        <RightButtonsContainer>
          {/* TODO: Implement Create Pet Button */}
          <CreatePetButton />
          <UserButton />
        </RightButtonsContainer>
      </HeaderCustom>
      <Layout.Content style={{ padding: 24 }}>{children}</Layout.Content>
    </LayoutCustom>
  );
}

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
