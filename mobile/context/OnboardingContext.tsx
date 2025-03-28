import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingContext = createContext({} as any);

export function OnboardingProvider({ children }: any) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingCompleted");
        setOnboardingCompleted(value === "true");
      } catch (e) {
        console.error("Error checking onboarding status:", e);
      }
    };
    checkOnboarding();
  }, []);

  const completeOnboarding = async (value?: "true" | "false") => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", value || "true");
      setOnboardingCompleted(true);
    } catch (e) {
      console.error("Error completing onboarding:", e);
    }
  };

  return (
    <OnboardingContext.Provider value={{ onboardingCompleted, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
