import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      initialRouteName="index"
      screenOptions={{
        navigationBarHidden: true,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[user]"
        options={{
          headerBackButtonMenuEnabled: true,
          headerTitle: "Chat",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "whitesmoke",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerTintColor: "black",
          statusBarColor: "whitesmoke",
        }}
      />
    </Stack>
  );
}
