import { Button, Flex, Modal } from "antd";
import React from "react";

type PetInfo = {
  displayName: string;
  description: string;
  breed: string;
  color: string;
  age: number;
  avatarData: string;
};

export function useTagPetsToPostsModal() {
  const openTagPetModal = () =>
    new Promise<PetInfo>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as PetInfo);
      };

      const { destroy } = Modal.info({
        title: "Tag a Pet!",
        centered: true,
        closable: true,
        maskClosable: true,
        footer: null,
        content: <TagPets onFinish={onFinish} />,
      });
    });

  return { openTagPetModal };
}

type ContentProps = {
  onFinish: (values: unknown) => void;
};

function TagPets({ onFinish }: ContentProps) {
  const onFormFinish = (values: object) => {
    onFinish({ ...values });
  };

  return (
    <Flex vertical>
      <Button type="primary" htmlType="submit">
        Done
      </Button>
    </Flex>
  );
}
