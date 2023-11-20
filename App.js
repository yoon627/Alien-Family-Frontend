import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import FirstRegister from "./screens/FirstRegister";
import ChooseCharacter from "./screens/ChooseCharacter";
import InvitationScreen from "./screens/InvitationScreen";
import FirstStart from "./screens/FirstStart";
import MiniGames from "./screens/MiniGames";
import MainDrawer from "./screens/MainDrawer";
import KaKaoLogin from "./screens/KaKaoLogin";
import ClickBox from "./screens/ClickBox";
import Home from "./screens/Home";

import store from "./redux/config/configStore";
import { Provider } from "react-redux";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainDrawer">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} />
          <Stack.Screen name="First Register" component={FirstRegister} />
          <Stack.Screen name="Choose Character" component={ChooseCharacter} />
          <Stack.Screen name="Invitation" component={InvitationScreen} />
          <Stack.Screen name="ClickBox" component={ClickBox} />
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
