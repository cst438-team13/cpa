import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useRefetchQuery } from "../../hooks/useQuery";

export function CreatePetButton() {
  const navigate = useNavigate();
  const user = useCurrentUserProfile();
  const refetchQuery = useRefetchQuery();

  const onClickButton = () => {
    navigate("/createPet");
  };

  return (
    <Button type={"primary"} shape="circle" onClick={onClickButton}>
      Create Pet
    </Button>
  );
}
