import React from "react";
import { Button } from "antd";

export function App() {
  return (
    <div style={{ padding: 24, gap: 8, display: "flex" }}>
      <Button type="primary">Click me</Button>
      <Button>Or don't</Button>
    </div>
  );
}
