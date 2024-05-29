import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";
import { useAppContext } from "../../../context/AppContext";
import { encryptMessage, decryptMessage } from "../../../lib/crypto";

interface Message {
  id: string;
  user: string;
  msg: string;
  timestamp: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");

  const { session } = useAppContext();

  useEffect(() => {
    // Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*");
      if (data) {
        const decryptedMessages = data.map((msg) => {
          return {
            ...msg,
            msg: decryptMessage(msg.msg),
          };
        });
        setMessages(decryptedMessages);
      }
    };

    fetchMessages();

    // Subscribe to messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            user: payload.new.user,
            msg: decryptMessage(payload.new.msg),
            timestamp: payload.new.timestamp,
          } as Message;
          setMessages((prev) => [...prev, newMessage]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    const encryptedMsg = encryptMessage(msg);
    const { error } = await supabase.from("messages").insert([
      {
        user:
          session?.user.user_metadata.user_name ||
          "guest_" + session?.user.id.slice(-3),
        msg: encryptedMsg,
      },
    ]);
    console.log("Error sending message", error);
    if (!error) setMsg("");
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        data={messages}
        style={[styles.msgList, styles.shadow]}
        contentContainerStyle={styles.msgListContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              {
                alignSelf:
                  item.user === session?.user.user_metadata.user_name ||
                  item.user === "guest_" + session?.user.id.slice(-3)
                    ? "flex-end"
                    : "flex-start",
              },
            ]}
          >
            <Text style={styles.messageUser}>@{item.user}</Text>
            <Text style={styles.messageText}>{item.msg}</Text>
            <Text style={styles.messageTimestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
      />
      <View style={[styles.sendContainer, styles.shadow]}>
        <TextInput
          placeholder="Type here..."
          onChangeText={(text) => setMsg(text)}
          style={{
            height: 60,
            flex: 1,
            borderWidth: 0,
            fontSize: 18,
            lineHeight: 24,
            paddingLeft: 20,
          }}
          value={msg}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  sendButton: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "dodgerblue",
    elevation: 3,
  },
  sendContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
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
  messageBubble: {
    backgroundColor: "#e1ffc7",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  messageUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "gray",
    textAlign: "right",
  },
});
