import { Redirect, Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
// import { account } from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  const { onboardingCompleted } = useOnboarding();
  const { isAuthenticated } = useAuth();

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/signin" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="account-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
