import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
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
import {Provider as StoreProvider} from "react-redux";
import ChatRoom from "./views/Chatting";
import ImageDetailForm from "./views/ImageDetailForm";
import store from "./redux/store";
import Attendance from "./views/Attendance";
import AlbumScreen from "./views/AlbumScreen";
import {useFonts} from "expo-font";
import {createStackNavigator} from "@react-navigation/stack";
import ImageUploadForm from "./views/ImageUploadForm";
import Greet from "./views/Greet";
import PlantInfo from "./views/PlantInfo";
// import { AppLoading } from 'expo';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
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
  android: {regular: {fontFamily: ""}},
};
// SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded] = useFonts({
    dnf: require("./assets/font/DNFBitBitv2.ttf"),
    doss: require("./assets/font/DOSSaemmul.ttf"),
    DungGeunMo: require("./assets/font/DungGeunMo.ttf"),
    tae: require("./assets/font/TAEBAEKmilkyway.otf"),
    wooju: require("./assets/font/HakgyoansimWoojuR.otf"),
    jamsil1: require("./assets/font/TheJamsilOTF1Thin.otf"),
    jamsil2: require("./assets/font/TheJamsilOTF2Light.otf"),
    jamsil3: require("./assets/font/TheJamsilOTF3Regular.otf"),
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  // console.log(colorScheme);
  if (!fontsLoaded) {
    return null;
  }
  // console.log("로딩댐?", fontsLoaded);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
      />
      <StoreProvider store={store}>
        <PaperProvider theme={{...theme}}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{headerShown: false, animationEnabled: false}}
            >
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="KaKaoLogin" component={KaKaoLogin}/>
              <Stack.Screen name="Greet" component={Greet}/>
              <Stack.Screen name="FirstRegister" component={FirstRegister}/>
              <Stack.Screen
                name="ChooseCharacter"
                component={ChooseCharacter}
              />
              <Stack.Screen name="Invitation" component={InvitationScreen}/>
              <Stack.Screen name="ClickBox" component={ClickBox}/>
              <Stack.Screen name="Ladder" component={LadderScreen}/>
              <Stack.Screen name="Roulette" component={RouletteScreen}/>
              <Stack.Screen name="Mole" component={NewGame}/>
              <Stack.Screen name="Chat" component={ChatRoom}/>
              <Stack.Screen
                name="AlbumScreen"
                component={AlbumScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ImageUploadForm"
                component={ImageUploadForm}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ImageDetailForm"
                component={ImageDetailForm}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MainDrawer"
                component={MainDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen name="FirstStart" component={FirstStart}/>
              <Stack.Screen
                name="Mini Games"
                component={MiniGames}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Home"
                component={MainDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen name="MainScreen" component={MainScreen}/>
              <Stack.Screen name="Attendance" component={Attendance}/>
              <Stack.Screen name="Feed" component={Feed}/>
              <Stack.Screen name="FamilyInfo" component={FamilyInfo}/>
              <Stack.Screen name="PlantInfo" component={PlantInfo}/>
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaView>
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
