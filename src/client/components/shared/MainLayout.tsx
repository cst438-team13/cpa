import { Button, Col, Layout, Row } from "antd";
import React from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SearchBar } from "./SearchBar";
import { UserButton } from "./UserButton";

type Props = {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
};

export function MainLayout({ children, leftContent, rightContent }: Props) {
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
          <UserButton />
        </RightButtonsContainer>
      </HeaderCustom>
      <Layout.Content style={{ padding: 24 }}>
        <Row justify="space-around">
          <Col flex="400px">{leftContent}</Col>
          <Col flex="650px">{children}</Col>
          <Col flex="400px">{rightContent}</Col>
        </Row>
      </Layout.Content>
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
