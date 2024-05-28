import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Dummy data for demo purposes
const chat = {
  avatar_url: "https://avatars.githubusercontent.com/u/31011142?v=4",
  name: "Bogdan Velicu",
  lastMessage: "Hey, how are you?",
  timestamp: "15:30",
};

export default function ChatItem({ chat }) {
  return (
    <View style={styles.chatItem}>
      <Image source={{ uri: chat.avatar_url }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
        </View>
        <Text style={styles.chatMessage}>{chat.lastMessage}</Text>
      </View>
    </View>
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
