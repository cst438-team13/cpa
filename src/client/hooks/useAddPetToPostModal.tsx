import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  //   Avatar,
  Button,
  Card,
  Flex,
  List,
  Modal,
  Typography,
} from "antd";
import React, { useState } from "react";

type PetProfile = {
  petId: number;
  name: string;
  pictureURL: string;
  description: string;
  breed: string;
  color: string;
  age: number;
  userId: number;
};

type Pets = {
  petIds: Array<number>;
};

const petsOwned = {
  list: new Array<PetProfile>(),
  tagged: new Array<number>(),
};

const user = {
  id: -1,
};

export function useAddPetToPostModal(userId: number) {
  user.id = userId;
  const openAddPetsModal = (petList: Array<PetProfile>) =>
    new Promise<Pets>((resolve) => {
      petsOwned.list = petList;
      console.log("Pets Owned ", petsOwned.list);
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as Pets);
      };

      const { destroy } = Modal.warning({
        title: "Tag Pets in Post",
        centered: true,
        closable: true,
        footer: null,
        content: <AddPetsContent onFinish={onFinish} />,
      });
    });

  return { openAddPetsModal };
}

type ContentProps = {
  onFinish: (values: unknown) => void;
};

function AddPetsContent({ onFinish }: ContentProps) {
  const available = [true, false];
  const [button1, setStateB1] = useState(false);

  const addToTagged = () => {
    setStateB1(true);
    // petsOwned.tagged.push(state.);
  };

  const removeFromTagged = () => {
    setStateB1(false);
  };

  return (
    <Flex vertical>
      <Card>
        <List
          dataSource={petsOwned.list}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<PlusOutlined />}
                  onClick={addToTagged}
                  disabled={button1}
                ></Button>,
                <Button
                  danger
                  icon={<MinusOutlined />}
                  onClick={removeFromTagged}
                  disabled={!button1}
                ></Button>,
              ]}
            >
              {/* <Skeleton avatar title={false} loading={false}> */}
              <List.Item.Meta
                //   avatar={<Avatar src={item.avatarUrl} />}
                title={<Typography.Text strong>{item.name}</Typography.Text>}
                description={item.breed}
              />
              {/* </Skeleton> */}
            </List.Item>
          )}
        ></List>
      </Card>
      <br />
      <br />
      <Button type="primary" htmlType="submit">
        Done
      </Button>
    </Flex>
  );
}
