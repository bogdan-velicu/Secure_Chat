import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user && username ? (
        <Chat user={username} setUser={setUsername} />
      ) : (
        <Auth setUser={setUsername} />
      )}
    </View>
  );
}
