import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { supabase } from "../lib/supabase";
// import { Button, Input } from "react-native-elements";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth(props: any) {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();

    if (error) Alert.alert(error.message);

    props.setUser(user);

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.verticallySpaced, styles.shadow]}>
        <TextInput
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            marginBottom: 12,
          }}
          onChangeText={(user) => setUser(user)}
          value={user}
          placeholder="Username"
          autoCapitalize={"none"}
        />
        <TouchableOpacity onPress={signIn} disabled={loading}>
          <View
            style={{ padding: 12, backgroundColor: "blue", borderRadius: 6 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Enter</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "whitesmoke",
  },
  verticallySpaced: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
