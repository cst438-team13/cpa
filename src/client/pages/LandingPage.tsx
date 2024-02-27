import React from "react";
import { LoginButton } from "../components/LoginButton";
import { RegisterButton } from "../components/RegisterButton";

export function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        <LoginButton />
        <RegisterButton />
      </div>
    </div>
  );
}
