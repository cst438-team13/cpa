import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, List, Modal, Typography, message } from "antd";
import React, { useState } from "react";
import { PetProfile } from "../../server/models/PetProfile";

export function useTagPetsToPostsModal(petList: PetProfile[]) {
  const openTagPetModal = () =>
    new Promise<PetProfile[]>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as PetProfile[]);
      };

      const { destroy } = Modal.info({
        title: "Tag pets",
        centered: true,
        closable: true,
        maskClosable: true,
        footer: null,
        content: <TagPets onFinish={onFinish} ownedPets={petList} />,
      });
    });

  return { openTagPetModal };
}

type ContentProps = {
  onFinish: (values: unknown) => void;
  ownedPets: PetProfile[];
};

function TagPets({ onFinish, ownedPets }: ContentProps) {
  const [taggedPets, setTaggedPets] = useState([] as PetProfile[]);

  const addPet = (pet: PetProfile) => {
    // not tagged so add pet
    setTaggedPets([...taggedPets, pet]);
    message.info(pet.displayName + " tagged");
  };

  const removePet = (pet: PetProfile) => {
    // tagged so remove pet
    setTaggedPets(taggedPets.filter((item) => item.id !== pet.id));
    message.info(pet.displayName + " removed");
  };

  // send tagged pet ids array to
  const submitPets = () => {
    onFinish(taggedPets);
  };

  return (
    <Flex vertical>
      {ownedPets.length > 0 && (
        <List
          dataSource={ownedPets}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatarUrl} />}
                title={
                  <Typography.Text strong>{item.displayName}</Typography.Text>
                }
                description={item.breed}
              />
              {!taggedPets.includes(item) && (
                <Button
                  icon={<PlusOutlined></PlusOutlined>}
                  onClick={() => addPet(item)}
                />
              )}
              {taggedPets.includes(item) && (
                <Button
                  icon={<MinusOutlined></MinusOutlined>}
                  danger
                  onClick={() => removePet(item)}
                />
              )}
            </List.Item>
          )}
        />
      )}
      <Button type="primary" onClick={() => submitPets()}>
        Done
      </Button>
    </Flex>
  );
}
