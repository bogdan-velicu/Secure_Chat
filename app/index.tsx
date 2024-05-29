// Useful links:
// https://supabase.com/docs/guides/auth/native-mobile-deep-linking

// Supabase
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

// Context
import { AppProvider, useAppContext } from "../context/AppContext";

// React
import { useState, useEffect } from "react";
import {
  AppState,
  SafeAreaView,
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";

// OAuth
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// Router
import { router } from "expo-router";

// Icons
import { Ionicons } from "@expo/vector-icons";

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string): Promise<Session | null> => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }

  const { access_token, refresh_token } = params;
  if (!access_token) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) {
    throw error;
  }

  return data.session;
};

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function MainPage() {
  const [username, setUsername] = useState("");

  const { setSession } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("getSession: ", session?.user);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("onAuthStateChange: ", session?.user);
      setSession(session);
      if (session) {
        router.push({
          pathname: "/bottom_bar",
        });
      }
    });
  }, []);

  const performOAuth = async () => {
    setLoadingGithub(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo,
    );

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
      router.push({
        pathname: "/bottom_bar",
      });
    }

    setLoadingGithub(false);
  };

  async function signIn() {
    if (!username) {
      Alert.alert("Please enter a username");
      return;
    }
    if (loading) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) Alert.alert(error.message);

    if (data && username) {
      router.push({
        pathname: "/bottom_bar",
        params: { user: username },
      });
    } else {
      Alert.alert("Session not found");
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[styles.verticallySpaced, styles.shadow, { marginBottom: 16 }]}
      >
        <TextInput
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            marginBottom: 12,
          }}
          onChangeText={(user) => setUsername(user)}
          value={username}
          placeholder="Username"
          autoCapitalize={"none"}
        />
        <TouchableHighlight onPress={signIn} disabled={loading}>
          <View
            style={{ padding: 12, backgroundColor: "blue", borderRadius: 6 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginRight: 10,
                  }}
                >
                  Enter as Guest
                </Text>
                <Ionicons name="person" color="white" size={18} />
              </View>
            )}
          </View>
        </TouchableHighlight>
      </View>
      <TouchableHighlight onPress={performOAuth} disabled={loadingGithub}>
        <View
          style={{ padding: 12, backgroundColor: "black", borderRadius: 6 }}
        >
          {loadingGithub ? (
            <ActivityIndicator color="white" />
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginRight: 10,
                }}
              >
                Login using GitHub
              </Text>
              <Ionicons name="logo-github" color="white" size={24} />
            </View>
          )}
        </View>
      </TouchableHighlight>
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
