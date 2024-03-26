import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export function CreatePostButton() {
  const navigate = useNavigate();

  const onClickButton = () => {
    navigate("/createPost");
  };

  return <Button onClick={onClickButton}>New Post</Button>;
}
