import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
import Greet from "./views/Greet";
import Lab from "./views/Lab";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

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
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded] = useFonts({
    dnf: require("./assets/font/DNFBitBitv2.ttf"),
    sammul: require("./assets/font/DOSSaemmul.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // console.log("로딩댐?", fontsLoaded);
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={{ ...theme }}>
        <NavigationContainer onReady={onLayoutRootView}>
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
            <Stack.Screen name="ImageDetailForm" component={ImageDetailForm} />
            <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
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
            <Stack.Screen name="Lab" component={Lab} />
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
