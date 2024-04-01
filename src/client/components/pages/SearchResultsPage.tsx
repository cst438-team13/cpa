import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { useQuery } from "../../hooks/useQuery";
import { MainLayout } from "../shared/MainLayout";

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchMode] = useSessionStorage("search-mode", "users");

  const isUserSearch = searchParams.get("mode") === "users";

  useEffect(() => {
    if (searchMode !== searchParams.get("mode")) {
      searchParams.set("mode", searchMode);
      setSearchParams(searchParams);
    }
  }, [searchMode]);

  return (
    <MainLayout leftContent={<SearchFilterCard />}>
      {isUserSearch ? <UsersList /> : <PetsList />}
    </MainLayout>
  );
}

function SearchFilterCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUserSearch = searchParams.get("mode") === "users";

  const onApplyFilters = (values: any) => {
    searchParams.set("location", values.location);
    searchParams.set("petId", values.petId);

    setSearchParams(searchParams);
  };

  return (
    <Card title="Filter" style={{ width: 400 }}>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onFinish={onApplyFilters}
      >
        <Form.Item
          name="location"
          label="Location"
          initialValue={searchParams.get("location") ?? ""}
        >
          <Input placeholder="User/owner location" />
        </Form.Item>
        {!isUserSearch && (
          <Form.Item
            name="petId"
            label="Id"
            initialValue={emptyIfNullish(searchParams.get("petId"))}
          >
            <InputNumber placeholder="Pet Id" />
          </Form.Item>
        )}
        <Flex justify="flex-start">
          <Button htmlType="submit" type="primary">
            Apply
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}

function UsersList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchData = useQuery(
    "searchUsers",
    searchParams.get("text")!,
    undefinedIfEmpty(searchParams.get("location"))
  );

  return (
    <Card title={`Results (${searchData.length})`}>
      <List
        style={{ backgroundColor: "White" }}
        itemLayout="horizontal"
        dataSource={searchData}
        renderItem={(profile) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => navigate(`/user/${profile.id}`)}
              >
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
    </Card>
  );
}

function PetsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchData = useQuery(
    "searchPets",
    searchParams.get("text")!,
    undefinedIfEmpty(searchParams.get("location")),
    undefinedIfEmpty(searchParams.get("petId")) as number | undefined
  );

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

function undefinedIfEmpty(value: string | null) {
  if (
    value == null ||
    value == "null" ||
    value == "undefined" ||
    value.length == 0
  ) {
    return undefined;
  } else {
    return value;
  }
}

function emptyIfNullish(value: string | null | undefined) {
  if (value == "null" || value == "undefined") {
    return "";
  }

  return value ?? "";
}
