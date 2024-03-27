import { Button, Card, Flex } from "antd";
import React, { useEffect, useState } from "react";
import type { Post } from "../../../server/models/Post";
import { api } from "../../api";

type Props = {
  userId: number;
  isHomePage: boolean;
};

export function FeedCards({ userId, isHomePage }: Props) {
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([] as Post[]);

  const [isLoading, setIsLoading] = useState(true);

  const loadMore = async () => {
    setIsLoading(true);
    const data = await api.getFeedPosts(userId, isHomePage, posts.length, 5);

    setPosts([...posts, ...data.posts]);
    setHasMore(data.hasMore);
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(loadMore, 500);
  }, []);

  return (
    <>
      {posts.map((post) => {
        return (
          <Card
            title={post.caption}
            hoverable
            cover={
              <img
                src={post.pictureURL}
                width={650}
                style={{ borderRadius: 0 }}
              />
            }
          >
            <Card.Meta
              title={`By ${post.author.displayName}`}
              description={`Posted ${new Date(post.creationDate).toLocaleDateString()}`}
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
