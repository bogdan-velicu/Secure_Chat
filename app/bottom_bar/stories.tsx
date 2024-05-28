import { SafeAreaView, Text, StyleSheet, View } from "react-native";

export default function StoriesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>There are no stories available</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  message: {
    fontSize: 18,
    color: "#333",
  },
});
