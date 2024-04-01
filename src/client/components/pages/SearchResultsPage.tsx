import { Avatar, Button, List, Typography } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { MainLayout } from "../shared/MainLayout";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const isUserSearch = searchParams.get("mode") === "users";

  return <MainLayout>{isUserSearch ? <UsersList /> : <PetsList />}</MainLayout>;
}

function UsersList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchData = useQuery("searchUsers", searchParams.get("text")!);

  return (
    <List
      header={
        <Typography.Title level={4}>
          Results ({searchData.length})
        </Typography.Title>
      }
      bordered
      style={{ backgroundColor: "White" }}
      itemLayout="horizontal"
      dataSource={searchData}
      renderItem={(profile) => (
        <List.Item
          actions={[
            <Button type="link" onClick={() => navigate(`/user/${profile.id}`)}>
              View
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={profile.avatarUrl} />}
            title={profile.displayName}
            description={profile.location}
          />
        </List.Item>
      )}
    />
  );
}

function PetsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchData = useQuery("searchPets", searchParams.get("text")!);

  return (
    <List
      header={
        <Typography.Title level={4}>
          Results ({searchData.length})
        </Typography.Title>
      }
      bordered
      style={{ backgroundColor: "White" }}
      itemLayout="horizontal"
      dataSource={searchData}
      renderItem={(profile) => (
        <List.Item
          actions={[
            <Button type="link" onClick={() => navigate(`/pet/${profile.id}`)}>
              View
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={profile.avatarUrl} />}
            title={profile.displayName}
            description={profile.breed}
          />
        </List.Item>
      )}
    />
  );
}
