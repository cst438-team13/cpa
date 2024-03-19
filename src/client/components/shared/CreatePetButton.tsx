import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export function CreatePetButton() {
  const navigate = useNavigate();

  const onClickButton = () => {
    navigate("/createPet");
  };

  return <Button onClick={onClickButton}>Create Pet</Button>;
}
