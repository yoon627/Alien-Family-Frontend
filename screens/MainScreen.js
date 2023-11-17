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
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Album from "./Album";
import Home from "./Home";
import Chatting from "./Chatting";
import Calendar from "./Calendar";
import Etc from "./Etc";

const Tab = createBottomTabNavigator();

export default function MainScreen({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Tab.Screen name="Album" component={Album} options={{headerShown:false}}/>
      <Tab.Screen name="Chatting" component={Chatting} options={{headerShown:false}}/>
      <Tab.Screen name="Calendar" component={Calendar} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
}
