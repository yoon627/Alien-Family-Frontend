import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from "../mainDrawer/Settings";
import MainScreen from "./MainScreen";
import Logout from "../mainDrawer/Logout";
import FamilyInfo from "../mainDrawer/FamilyInfo";

const Drawer = createDrawerNavigator();

export default function MainDrawer({ navigation }) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="MainScreen" component={MainScreen} />
      <Drawer.Screen name="FamilyInfo" component={FamilyInfo} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
}
