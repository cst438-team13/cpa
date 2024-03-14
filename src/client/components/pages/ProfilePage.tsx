import { FormInstance } from "antd";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();

  const formRef = useRef<FormInstance>(null);

  return <Container></Container>;
}

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
