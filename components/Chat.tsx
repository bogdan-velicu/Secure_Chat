import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { encryptMessage, decryptMessage } from "../lib/crypto";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Chat(props: any) {
  const [messages, setMessages] = useState<any>([]);
  const [msg, setMsg] = useState<string>("");
  const user: string = props.user;

  const handleMessages = (payload: any) => {
    // console.log("Received message: ", payload.new);
    const encryptedMessage = payload.new.msg;
    const decryptedMessage = decryptMessage(
      encryptedMessage,
      payload.new.nonce,
    );
    const message = {
      user: payload.new.user,
      msg: decryptedMessage,
    };
    setMessages((prevMessages: any) => [...prevMessages, message]);
  };

  const handleSend = async () => {
    if (!msg) return;
    const { message, nonce } = encryptMessage(msg);
    // console.log("Encrypted message: ", message, nonce);
    const { error } = await supabase
      .from("messages")
      .insert([{ user: user, msg: message, nonce: nonce }]);
    if (error) {
      console.error("Error sending message: ", error);
    }
    setMsg("");
  };

  const handleLeave = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out: ", error);
    props.setUser(null);
    console.info("Logged out");
  };

  useEffect(() => {
    // Subscribe to messages
    supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleMessages,
      )
      .subscribe();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <View
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{`Welcome, ${user}!`}</Text>
        <TouchableOpacity
          onPress={handleLeave}
          style={[styles.logoutButton, styles.shadow]}
        >
          <Ionicons name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        style={[styles.msgList, styles.shadow]}
        contentContainerStyle={styles.msgListContainer}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 20 }}>
            {item.user}: {item.msg}
          </Text>
        )}
      />
      <View style={[styles.sendContainer, styles.shadow]}>
        <TextInput
          placeholder="Type here..."
          onChangeText={(text) => setMsg(text)}
          style={{
            height: 40,
            borderColor: "transparent",
            borderWidth: 0,
            fontSize: 18,
            padding: 10,
          }}
          value={msg}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
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
    paddingTop: 50,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: "lime",
    padding: 10,
    borderRadius: 10,
  },
  sendContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
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
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 14,
  },
});
