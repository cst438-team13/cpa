import React from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "../shared/MainLayout";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();

  return <MainLayout></MainLayout>;
}
