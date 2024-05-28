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
import {
  encryptMessage,
  getStoredKeyPair,
  decryptMessage,
  generateAndStoreKeyPair,
  generateNonce,
} from "../../../lib/crypto";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const initializeKeys = async () => {
      // Your key initialization logic here
    };

    initializeKeys();

    // Subscribe to messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload) => console.log(payload),
      )
      .subscribe();
    // const subscription = supabase
    //   .from("messages")
    //   .on("INSERT", async (payload) => {
    //     // Your message handling logic here
    //   })
    //   .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    const nonce = generateNonce();
    const { publicKey, secretKey } = await getStoredKeyPair(); // Assume this is a function you've defined
    const encryptedMsg = encryptMessage(msg, nonce, publicKey, secretKey);

    const { error } = await supabase
      .from("messages")
      .insert([{ user: "currentUser", msg: encryptedMsg, nonce, publicKey }]);

    if (!error) setMsg("");
  };

  return (
    <SafeAreaView style={[styles.container]}>
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
          <MaterialIcons name="send" size={24} color="gray" />
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
    borderWidth: 1,
    borderColor: "lightgray",
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
});
