import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { router } from "expo-router";
import ChatItem from "./ChatItem"; // Assuming you have the ChatItem component in the same directory

export default function ChatsListComponent(props: any) {
  const [chats, setChats] = useState<any>([
    {
      avatar_url: "https://avatars.githubusercontent.com/u/31011142?v=4",
      name: "Bogdan Velicu",
      lastMessage: "Hey, how are you?",
      timestamp: "15:30",
    },
    // Add more chat objects here
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.msgList}
        contentContainerStyle={styles.msgListContainer}
      >
        {chats.map((chat: any, index: number) => (
          <ChatItem key={index} chat={chat} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "whitesmoke",
    height: "100%",
  },
  msgList: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  msgListContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});
