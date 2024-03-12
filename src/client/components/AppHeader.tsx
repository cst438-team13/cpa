import { Layout } from "antd";
import React from "react";

import styled from "styled-components";
import { UserButton } from "./UserButton";

export function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <LayoutCustom>
      <HeaderCustom>
        <RightButtonsContainer>
          <UserButton />
        </RightButtonsContainer>
      </HeaderCustom>
      <Layout.Content style={{ padding: 24 }}>{children}</Layout.Content>
    </LayoutCustom>
  );
}

const LayoutCustom = styled(Layout)`
  height: 100%;
  background-color: #f0f2f5;
`;

const HeaderCustom = styled(Layout.Header)`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightButtonsContainer = styled("div")`
  display: flex;
  padding: 0 12px;
  gap: 12px;
`;
