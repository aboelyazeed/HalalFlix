import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "./src/store/authStore";
import { COLORS } from "./src/styles/theme";

// Screens
import { SplashScreen } from "./src/screens/SplashScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { SignUpScreen } from "./src/screens/SignUpScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { SubscriptionScreen } from "./src/screens/SubscriptionScreen";
import { ProfileSelectScreen } from "./src/screens/ProfileSelectScreen";
import { ProfileEditScreen } from "./src/screens/ProfileEditScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { NewAndHotScreen } from "./src/screens/NewAndHotScreen";
import { MovieDetailsScreen } from "./src/screens/MovieDetailsScreen";
import { WatchlistScreen } from "./src/screens/WatchlistScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHeader = { headerShown: false };

// ─── Tab Navigator ───────────────────────────────────
function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "rgba(255,255,255,0.05)",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      >
        {(props) => (
          <HomeScreen
            {...props}
            onMoviePress={(id) =>
              navigation.navigate("Details", { movieId: id })
            }
            onSearch={() =>
              navigation.navigate("MainTabs", { screen: "SearchTab" })
            }
            onProfile={() => navigation.navigate("Settings")}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="SearchTab"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={26} color={color} />
          ),
        }}
      >
        {(props) => (
          <SearchScreen
            {...props}
            onMoviePress={(id) =>
              navigation.navigate("Details", { movieId: id })
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="NewAndHotTab"
        options={{
          tabBarLabel: "New & Hot",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="whatshot" size={26} color={color} />
          ),
        }}
      >
        {(props) => (
          <NewAndHotScreen
            {...props}
            onMoviePress={(id) =>
              navigation.navigate("Details", { movieId: id })
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="WatchlistTab"
        options={{
          tabBarLabel: "My List",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bookmark-border" size={26} color={color} />
          ),
        }}
      >
        {(props) => (
          <WatchlistScreen
            {...props}
            onMoviePress={(id) =>
              navigation.navigate("Details", { movieId: id })
            }
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ─── Root App ────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadToken = useAuthStore((s) => s.loadToken);

  useEffect(() => {
    loadToken();
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: COLORS.primary,
            background: COLORS.background,
            card: COLORS.surface,
            text: COLORS.textPrimary,
            border: COLORS.border,
            notification: COLORS.primary,
          },
          fonts: {
            regular: { fontFamily: "System", fontWeight: "400" },
            medium: { fontFamily: "System", fontWeight: "500" },
            bold: { fontFamily: "System", fontWeight: "700" },
            heavy: { fontFamily: "System", fontWeight: "900" },
          },
        }}
      >
        <Stack.Navigator screenOptions={noHeader}>
          {!isAuthenticated ? (
            // ── Auth Flow ──
            <>
              <Stack.Screen name="Welcome">
                {({ navigation }) => (
                  <WelcomeScreen
                    onSignIn={() => navigation.navigate("Login")}
                    onGetStarted={() => navigation.navigate("SignUp")}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {({ navigation }) => (
                  <SignUpScreen
                    onSignIn={() => navigation.navigate("Login")}
                    onSuccess={() => {}}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Login">
                {({ navigation }) => (
                  <LoginScreen
                    onSignUp={() => navigation.navigate("SignUp")}
                    onForgotPassword={() =>
                      navigation.navigate("ForgotPassword")
                    }
                    onSuccess={() => {}}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword">
                {({ navigation }) => (
                  <ForgotPasswordScreen onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
            </>
          ) : (
            // ── Main App Flow ──
            <>
              <Stack.Screen name="Profiles">
                {({ navigation }) => (
                  <ProfileSelectScreen
                    onProfileSelected={() => navigation.navigate("MainTabs")}
                    onEditProfiles={() => navigation.navigate("ProfileEdit")}
                    onCreateProfile={() => navigation.navigate("ProfileEdit")}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ProfileEdit">
                {({ navigation }) => (
                  <ProfileEditScreen
                    onSave={() => navigation.navigate("Profiles")}
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Subscription">
                {({ navigation }) => (
                  <SubscriptionScreen
                    onSubscribe={() => navigation.navigate("MainTabs")}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Details">
                {({ route, navigation }) => (
                  <MovieDetailsScreen
                    movieId={(route.params as any)?.movieId}
                    onPlay={(url) =>
                      navigation.navigate("Player", {
                        videoUrl: url,
                        title: "",
                      })
                    }
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Player" options={{ animation: "fade" }}>
                {({ route, navigation }) => (
                  <PlayerScreen
                    videoUrl={(route.params as any)?.videoUrl}
                    title={(route.params as any)?.title}
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Settings">
                {({ navigation }) => (
                  <SettingsScreen
                    onBack={() => navigation.goBack()}
                    onSwitchProfile={() => navigation.navigate("Profiles")}
                    onManageProfiles={() => navigation.navigate("ProfileEdit")}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
