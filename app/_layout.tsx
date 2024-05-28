import { Slot } from "expo-router";
import { AppProvider } from "../context/AppContext";

export default function Root() {
  // Set up the app context and render our layout inside of it.
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
