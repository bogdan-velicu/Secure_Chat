import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native";
import ChatsListComponent from "../../../components/ChatListComponent";

export default function ChatsList() {
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        style={[styles.msgList, styles.shadow]}
        contentContainerStyle={styles.msgListContainer}
      >
        <ChatsListComponent />
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
