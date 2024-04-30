import { Button, Card, Flex, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../../server/models/Post";
import { api } from "../../api";

type Props =
  | {
      userId: number;
      isHomePage: boolean;
    }
  | { petId: number };

export function FeedCards(props: Props) {
  const [postCaption, setPostCaption] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([] as Post[]);

  const [isLoading, setIsLoading] = useState(true);

  // post description translation
  const translateCaption = async (caption) => {
    const translation = api.translateText(caption);
    translation == null
      ? message.error("Error Translating!")
      : console.log(translation);
  };

  const loadMore = async () => {
    setIsLoading(true);

    const data =
      "userId" in props
        ? await api.getFeedPostsForUser(
            props.userId,
            props.isHomePage,
            posts.length,
            5
          )
        : await api.getFeedPostsForPet(props.petId, posts.length, 5);

    setPosts([...posts, ...data.posts]);
    setHasMore(data.hasMore);
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(loadMore, 100);
  }, []);

  return (
    <>
      {posts.map((post) => {
        const isTextPost = post.pictureURL == null || post.pictureURL == "";

        return (
          <Card
            key={post.id}
            title={`${post.author.displayName} posted${post.visibility == "public" ? "" : " for friends"}:`}
            style={{ width: 650 }}
            hoverable
            cover={
              isTextPost ? (
                <Typography.Paragraph
                  style={{
                    margin: 24,
                    marginBottom: 0,
                    width: 630,
                  }}
                >
                  {post.text}
                </Typography.Paragraph>
              ) : (
                <img
                  src={post.pictureURL!}
                  width={650}
                  style={{ borderRadius: 0 }}
                />
              )
            }
          >
            <Card.Meta
              title={isTextPost ? undefined : post.text}
              description={
                <>
                  {"Tagged "}
                  {post.taggedPets.map((o, i) => (
                    <>
                      <Link to={`/pet/${o.id}`}>{o.displayName}</Link>
                      {i < post.taggedPets.length - 1 && ", "}
                    </>
                  ))}
                  {" at "}
                  {toLocalDate(post.creationDate).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  <a onClick={() => translateCaption(post.text)}> Translate </a>
                </>
              }
            />
          </Card>
        );
      })}
      {hasMore && (
        <Flex style={{ width: "100%" }} justify="center">
          <Button
            onClick={() => !isLoading && loadMore()}
            type="primary"
            loading={isLoading}
          >
            Load more
          </Button>
        </Flex>
      )}
    </>
  );
}

function toLocalDate(val: Date | string) {
  const str = `${new Date(val).toString()} UTC`;
  const date = new Date(str);

  return date;
}
