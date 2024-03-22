import { Button, Flex, Modal, Typography } from "antd";
import React from "react";

type Pets = {
  petIds: Array<number>;
};

export function useAddPetToPostModal() {
  const openAddPetsModal = () =>
    new Promise<Pets>((resolve) => {
      const onFinish = (values: unknown) => {
        destroy();
        resolve(values as Pets);
      };

      const { destroy } = Modal.info({
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
  //   const [avatarData, setAvatarData] = useState<string | null>(null);

  //   const handleSetAvatar = async (file: RcFile) => {
  //     const data = await getScaledImageFromFile(file, 128);
  //     setAvatarData(data);
  //   };

  return (
    <Flex vertical>
      <Typography.Paragraph>Almost done! Now Add Pets.</Typography.Paragraph>
      <Button type="primary" htmlType="submit">
        Done
      </Button>
    </Flex>
  );
}
