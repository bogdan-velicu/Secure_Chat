import React, { useState } from "react";
// import { encryptMessage, decryptMessage } from "../../lib/crypto";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { TouchableHighlight } from "react-native";
import ChatsListComponent from "../../../components/ChatListComponent";

export default function ChatsList(props: any) {
  const [chats, setChats] = useState<any>(["Group Chat"]);

  const { user } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        style={[styles.msgList, styles.shadow]}
        contentContainerStyle={styles.msgListContainer}
      >
        <ChatsListComponent />
        {/* {chats.map((chat: any, index: number) => (
          <TouchableHighlight
            key={index}
            underlayColor="lightgray"
            onPress={() =>
              router.push({
                pathname: `bottom_bar/chats/${chat}`,
              })
            }
          >
            <Text>{chat}</Text>
          </TouchableHighlight>
        ))} */}
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
