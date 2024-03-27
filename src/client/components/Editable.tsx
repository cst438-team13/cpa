import { EditOutlined } from "@ant-design/icons";
import { Form, Popover, Tooltip } from "antd";
import React, { useState } from "react";

type Props = {
  value: React.ReactNode;
  children: React.ReactNode;
  name: string;
  onSubmit: (value: unknown) => void;
  isEnabled?: boolean;
};

export function Editable({
  value,
  children,
  onSubmit,
  name,
  isEnabled = true,
}: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const onFinishForm = (values: object) => {
    onSubmit(Object.values(values)[0]);
    setIsPopupOpen(false);
  };

  const initialValues = {};
  initialValues[name] = value;

  const content = (
    <Form onFinish={onFinishForm} initialValues={initialValues}>
      <Form.Item noStyle name={name}>
        {children}
      </Form.Item>
    </Form>
  );

  return (
    <>
      {value}{" "}
      {isEnabled && (
        <Tooltip title="Edit">
          <Popover
            open={isPopupOpen}
            content={content}
            trigger="click"
            onOpenChange={(o) => setIsPopupOpen(o)}
          >
            <EditOutlined
              style={{ cursor: "pointer", color: "rgb(22, 119, 255)" }}
            />
          </Popover>
        </Tooltip>
      )}
    </>
  );
}
