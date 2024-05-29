import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";

import groupChat from "../assets/group-chat.png";

interface Message {
  id: string;
  user: string;
  msg: string;
  timestamp: string;
}

interface Chat {
  avatar_url: string;
  name: string;
  lastMessage: Message;
}

export default function ChatItem({ chat }: { chat: Chat }) {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        router.push({
          pathname: `bottom_bar/chats/${chat.name}`,
        });
      }}
    >
      <Image
        source={chat.avatar_url ? { uri: chat.avatar_url } : groupChat}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTimestamp}>{chat.lastMessage.timestamp}</Text>
        </View>
        <Text style={styles.chatMessage}>{chat.lastMessage.msg}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatTimestamp: {
    fontSize: 12,
    color: "gray",
  },
  chatMessage: {
    fontSize: 14,
    color: "gray",
  },
});
