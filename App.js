import React, { useCallback, useRef, useState, useEffect } from "react";
import { StyleSheet, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./views/Login";
import FirstRegister from "./views/FirstRegister";
import ChooseCharacter from "./views/ChooseCharacter";
import InvitationScreen from "./views/InvitationScreen";
import FirstStart from "./views/FirstStart";
import MiniGames from "./views/MiniGames";
import MainDrawer from "./views/MainDrawer";
import KaKaoLogin from "./views/KaKaoLogin";
import ClickBox from "./views/ClickBox";
import LadderScreen from "./views/LadderScreen";
import RouletteScreen from "./views/RouletteScreen";
import NewGame from "./views/NewGame";
import MainScreen from "./views/MainScreen";
import { Provider as StoreProvider } from "react-redux";
import ChatRoom from "./views/Chatting";
import ImageDetailForm from "./views/ImageDetailForm";
import store from "./redux/store";
import Attendance from "./views/Attendance";
import AlbumScreen from "./views/AlbumScreen";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import ImageUploadForm from "./views/ImageUploadForm";
import Greet from "./views/Greet";
import Lab from "./views/Lab";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
// import * as SplashScreen from "expo-splash-screen";
import Feed from "./views/Feed";
import * as Notifications from "expo-notifications";
import FamilyInfo from "./views/FamilyInfo";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomamto",
    secondary: "yellow",
  },
};

const fontConfig = {
  android: { regular: { fontFamily: "" } },
};
// SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded] = useFonts({
    dnf: require("./assets/font/DNFBitBitv2.ttf"),
    sammul: require("./assets/font/DOSSaemmul.ttf"),
    DungGeunMo: require("./assets/font/DungGeunMo.ttf"),
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // console.log("로딩댐?", fontsLoaded);
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={{ ...theme }}>
        <NavigationContainer
          // onReady={onLayoutRootView}
          linking={{
            config: {
              // Configuration for linking
            },
            async getInitialURL() {
              // First, you may want to do the default deep link handling
              // Check if app was opened from a deep link
              const url = await Linking.getInitialURL();

              if (url != null) {
                return url;
              }

              // Handle URL from expo push notifications
              const response =
                await Notifications.getLastNotificationResponseAsync();

              return response?.notification.request.content.data.url;
            },
            subscribe(listener) {
              const onReceiveURL = (url) => listener(url);

              // Listen to incoming links from deep linking
              const eventListenerSubscription = Linking.addEventListener(
                "url",
                onReceiveURL
              );

              // Listen to expo push notifications
              const subscription =
                Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    const url = response.notification.request.content.data.url;

                    // Any custom logic to see whether the URL needs to be handled
                    //...

                    // Let React Navigation handle the URL
                    listener(url);
                  }
                );

              return () => {
                // Clean up the event listeners
                eventListenerSubscription.remove();
                subscription.remove();
              };
            },
          }}
        >
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false, animationEnabled: false }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} />
            <Stack.Screen name="Greet" component={Greet} />
            <Stack.Screen name="FirstRegister" component={FirstRegister} />
            <Stack.Screen name="ChooseCharacter" component={ChooseCharacter} />
            <Stack.Screen name="Invitation" component={InvitationScreen} />
            <Stack.Screen name="ClickBox" component={ClickBox} />
            <Stack.Screen name="Ladder" component={LadderScreen} />
            <Stack.Screen name="Roulette" component={RouletteScreen} />
            <Stack.Screen name="Mole" component={NewGame} />
            <Stack.Screen name="Chat" component={ChatRoom} />
            <Stack.Screen
              name="AlbumScreen"
              component={AlbumScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ImageUploadForm"
              component={ImageUploadForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ImageDetailForm"
              component={ImageDetailForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainDrawer"
              component={MainDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="FirstStart" component={FirstStart} />
            <Stack.Screen
              name="Mini Games"
              component={MiniGames}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={MainDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="Attendance" component={Attendance} />
            <Stack.Screen name="Feed" component={Feed} />
            <Stack.Screen name="FamilyInfo" component={FamilyInfo} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
