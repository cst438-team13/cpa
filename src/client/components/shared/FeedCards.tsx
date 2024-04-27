import { Button, Card, Flex, Typography, message } from "antd";
import axios from "axios";
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
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([] as Post[]);

  const [isLoading, setIsLoading] = useState(true);

  // post description translation
  const translate = async () => {
    // will need to find better way to do this
    const apiKey = "cfbeec553f734317bc6f5a96505e8159";
    const region = "westus2";
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";

    try {
      const response = await axios.post(
        endpoint,
        [
          {
            text: "Hola como estas hoy",
          },
        ],
        {
          params: {
            "api-version": "3.0",
            to: "en",
          },
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            // location required if you're using a multi-service or regional (not global) resource.
            "Ocp-Apim-Subscription-Region": region,
            "Content-type": "application/json",
          },
        }
      );
      console.log(response.data[0].translations[0].text);
    } catch (error) {
      message.error("Error Translating!");
    }
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
                  <a onClick={translate}> Translate </a>
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
