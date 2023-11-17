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
import { createDrawerNavigator } from '@react-navigation/drawer';
import TMI from "./TMI";
import Settings from "./Settings";

const Drawer = createDrawerNavigator();

export default function Etc({ navigation }) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="TMI" component={TMI} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}
