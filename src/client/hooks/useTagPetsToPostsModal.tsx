import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, List, Modal, Typography, message } from "antd";
import React from "react";
import { PetProfile } from "../../server/models/PetProfile";

// what will be sent back to create post card
type PetsTagged = {
  tagged: Array<PetProfile>;
};

const userPets = {
  petsOwned: new Array<PetProfile>(),
  tagged: new Array<PetProfile>(),
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
  const addPet = (pet: PetProfile) => {
    // check if pet is already tagged
    if (userPets.tagged.find((tempPet) => tempPet.id === pet.id) != undefined) {
      message.error(pet.displayName + " is already tagged.");
      return;
    }

    // not tagged so add pet
    userPets.tagged.push(pet);
    message.info(pet.displayName + " tagged!");
  };

  const removePet = (pet: PetProfile) => {
    // check if pet is not tagged
    if (userPets.tagged.find((tempPet) => tempPet.id === pet.id) == undefined) {
      message.error(pet.displayName + " is not tagged.");
      return;
    }

    // tagged so remove pet
    // *** Could be a better way to remove element ***
    userPets.tagged = userPets.tagged.filter(function (petToDelete) {
      return petToDelete.id !== pet.id;
    });
    message.info(pet.displayName + " Removed!");
  };

  // send tagged pet ids array to
  const submitPets = () => {
    onFinish(userPets);
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
              <Button
                icon={<PlusOutlined></PlusOutlined>}
                onClick={() => addPet(item)}
              ></Button>
              <Button
                icon={<MinusOutlined></MinusOutlined>}
                danger
                onClick={() => removePet(item)}
              ></Button>
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
