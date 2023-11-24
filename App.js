import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./loginScreen/Login";
import FirstRegister from "./loginScreen/FirstRegister";
import ChooseCharacter from "./loginScreen/ChooseCharacter";
import InvitationScreen from "./loginScreen/InvitationScreen";
import FirstStart from "./loginScreen/FirstStart";
import MiniGames from "./mainScreen/MiniGames";
import MainDrawer from "./mainNavigator/MainDrawer";
import KaKaoLogin from "./loginScreen/KaKaoLogin";
import ClickBox from "./loginScreen/ClickBox";
import store from "./redux/config/configStore";
import { Provider } from "react-redux";
import LadderScreen from "./views/LadderScreen";
import RouletteScreen from "./views/RouletteScreen";
import NewGame from "./views/NewGame";
import ChatRoom from "./views/chatScreen";
import MainScreen from "./mainNavigator/MainScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} />
          <Stack.Screen name="First Register" component={FirstRegister} />
          <Stack.Screen name="Choose Character" component={ChooseCharacter} />
          <Stack.Screen name="Invitation" component={InvitationScreen} />
          <Stack.Screen name="ClickBox" component={ClickBox} />
          <Stack.Screen name="Ladder" component={LadderScreen} />
          <Stack.Screen name="Roulette" component={RouletteScreen} />
          <Stack.Screen name="Mole" component={NewGame} />
          <Stack.Screen name="Chat" component={ChatRoom} />
          <Stack.Screen
            name="MainDrawer"
            component={MainDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="First Start" component={FirstStart} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
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
