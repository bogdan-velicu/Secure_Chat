import { Tabs } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { useAppContext } from "../../context/AppContext";

export default function RootLayout() {
  const { setSession } = useAppContext();
  const handleLeave = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out: ", error);
    setSession(null);
    router.push({ pathname: "/" });
    console.info("Logged out");
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerLeft: () => <View style={{ marginLeft: 20 }}></View>,
          headerRight: () => (
            <TouchableOpacity onPress={handleLeave} style={{ marginRight: 20 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: "Stories",
          headerLeft: () => <View style={{ marginLeft: 20 }}></View>,
          headerRight: () => (
            <TouchableOpacity onPress={handleLeave} style={{ marginRight: 20 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerLeft: () => <View style={{ marginLeft: 20 }}></View>,
          headerRight: () => (
            <TouchableOpacity onPress={handleLeave} style={{ marginRight: 20 }}>
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
