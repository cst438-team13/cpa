import { Avatar, Button, Flex, List, Modal, Typography } from "antd";
import React from "react";
import { PetProfile } from "../../server/models/PetProfile";

type PetsTagged = {
  tagged: Array<Number>;
};

const userPets = {
  petsOwned: new Array<PetProfile>(),
};

export function useTagPetsToPostsModal(petList: Array<PetProfile>) {
  userPets.petsOwned = petList;
  const openTagPetModal = () =>
    new Promise<PetsTagged>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as PetsTagged);
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
      {userPets.petsOwned.length > 0 && (
        <List
          dataSource={userPets.petsOwned}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatarUrl} />}
                title={
                  <Typography.Text strong>{item.displayName}</Typography.Text>
                }
                description={item.breed}
              />
            </List.Item>
          )}
        />
      )}
      <Button type="primary" htmlType="submit">
        Done
      </Button>
    </Flex>
  );
}
