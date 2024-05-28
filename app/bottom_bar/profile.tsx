import { SafeAreaView, Text, View, Image, StyleSheet } from "react-native";
import { useAppContext } from "../../context/AppContext";
import React, { useEffect, useState } from "react";
import { UserMetadata } from "@supabase/supabase-js";

const guestMetadata = {
  avatar_url:
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  email: "",
  email_verified: false,
  full_name: "Guest Profile",
  iss: "",
  name: "Guest Profile",
  phone_verified: false,
  preferred_username: "guest",
  provider_id: "",
  sub: "",
  user_name: "guest",
};

export default function ProfileScreen() {
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const { session } = useAppContext();

  useEffect(() => {
    console.log("session", session);
    if (session) {
      if (session.user.user_metadata.user_name)
        setUserMetadata(session.user.user_metadata);
      else setUserMetadata(guestMetadata);
    }
  }, []);

  if (!userMetadata) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userMetadata.avatar_url }}
          style={styles.avatar}
        />
        <Text style={styles.fullName}>{userMetadata.full_name}</Text>
        <Text style={styles.userName}>@{userMetadata.preferred_username}</Text>
        <Text style={styles.email}>{userMetadata.email}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "whitesmoke",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    color: "gray",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "darkgray",
  },
});
