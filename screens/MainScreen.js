import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Screen,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Entypo,
  MaterialIcons,
  AntDesign,
  Fontisto,
  FontAwesome,
} from "@expo/vector-icons";
import Album from "./Album";
import Home from "./Home";
import Chatting from "./Chatting";
import Etc from "./Etc";
import CalendarScreen from "./CalendarScreen";
import Lab from "./Lab";
import MiniGames from "./MiniGames";
import Feed from "./Feed";
const Tab = createBottomTabNavigator();

export default function MainScreen({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "gray",
          }}
        />
        <Tab.Screen
          name="Album"
          component={Album}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <MaterialIcons name="photo-album" size={24} color="black" />
            ),
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "gray",
          }}
        />
        <Tab.Screen
          name="Chatting"
          component={Chatting}
          options={{
            headerShown: false,
            tabBarIcon: () => <Entypo name="chat" size={24} color="black" />,
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "gray",
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <AntDesign name="calendar" size={24} color="black" />
            ),
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "gray",
          }}
        />
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesome name="history" size={24} color="black" />
            ),
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "gray",
          }}
        />
        <Tab.Screen
          name="Mini Games"
          component={MiniGames}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
