import React, { useState, useEffect } from "react";
import { ApolloProvider } from "react-apollo-hooks";
import client from "./apollo";
import Chat from "./Chat";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
export default function App() {
  const [notificationStatus, setStatus] = useState(false);
  const ask = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status);
    setStatus(status as any);
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    Notifications.setBadgeNumberAsync(0);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
