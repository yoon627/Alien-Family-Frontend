import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TMI from "./TMI";
import Settings from "./Settings";
import MainScreen from "./MainScreen";
import Logout from "./Logout";
import FamilyInfo from "./FamilyInfo";
import Lab from "./Lab";
import MiniGames from "./MiniGames";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

export default function MainDrawer({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
        <Drawer.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headershown: false }}
        />
        <Drawer.Screen name="FamilyInfo" component={FamilyInfo} />
        <Drawer.Screen name="TMI" component={TMI} />
        <Drawer.Screen name="Mini Games" component={MiniGames} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Logout" component={Logout} />
        <Drawer.Screen name="Lab" component={Lab} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
