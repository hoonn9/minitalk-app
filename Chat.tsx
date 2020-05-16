import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import withSuspense from "./withSuspense";

const GET_MESSAGES = gql`
  query messages {
    messages {
      id
      text
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      text
    }
  }
`;

function Chat() {
  const [message, setMessage] = useState("");
  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: { text: message },
    refetchQueries: () => [{ query: GET_MESSAGES }],
  });
  const {
    data: { messages: oldMessages },
    error,
  } = useQuery(GET_MESSAGES, {
    suspend: true,
  });
  const { data } = useSubscription(NEW_MESSAGE);
  const [messages, setMessages] = useState(oldMessages || []);

  const handleNewMessage = () => {
    if (data !== undefined) {
      const { newMessage } = data;
      console.log(newMessage);
      setMessages((previous) => [...previous, newMessage]);
    }
  };

  useEffect(() => {
    handleNewMessage();
  }, [data]);

  const onChangeText = (text) => setMessage(text);
  const onSubmit = async () => {
    if (message === "") {
      return;
    }
    try {
      await sendMessageMutation();
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 50,
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {messages.map((m) => (
        <View key={m.id} style={{ marginBottom: 10 }}>
          <Text>{m.text}</Text>
        </View>
      ))}
      <TextInput
        placeholder="메시지를 입력하세요."
        style={{
          marginTop: 50,
          width: "90%",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: "#2f2f2f",
        }}
        returnKeyType="send"
        value={message}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
    </ScrollView>
  );
}

export default withSuspense(Chat);
