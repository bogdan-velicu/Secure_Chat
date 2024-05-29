import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import ChatItem from "./ChatItem";
import { supabase } from "../lib/supabase";
import { decryptMessage } from "../lib/crypto";

interface Message {
  id: string;
  user: string;
  msg: string;
  timestamp: string;
}

export default function ChatsListComponent() {
  const [chats, setChats] = useState<any>([
    {
      avatar_url: "",
      name: "Group Chat",
      lastMessage: {
        id: "",
        user: "",
        msg: "",
        timestamp: "",
      },
    },
  ]);

  useEffect(() => {
    // Fetch last message from chat
    async function fetchLastMessage() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1);
      if (error) {
        console.error("Error fetching last message:", error.message);
        return;
      }
      if (data) {
        console.log("Last message:", data[0]);
        const message = data[0] as Message;
        message.msg = decryptMessage(message.msg);
        message.timestamp = new Date(message.timestamp).toLocaleTimeString();
        message.msg =
          message.msg.length > 50
            ? message.msg.slice(0, 50) + "..."
            : message.msg;
        chats[0].lastMessage = message;
        setChats([...chats]);
      }
    }
    fetchLastMessage();
  }, []);

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
