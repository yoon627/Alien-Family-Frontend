import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import Logout from "./Logout";
import FamilyInfo from "./FamilyInfo";
import Lab from "./Lab";
import { PaperProvider } from "react-native-paper";
import ChoseCalendar from "./ChoseCalendar";

const Drawer = createDrawerNavigator();

export default function MainDrawer({ navigation }) {
  return (
    <PaperProvider>
      <Drawer.Navigator>
        <Drawer.Screen name="MainScreen" component={MainScreen} />
        <Drawer.Screen name="FamilyInfo" component={FamilyInfo} />
        <Drawer.Screen name="Settings" component={ChoseCalendar} />
        <Drawer.Screen name="Logout" component={Logout} />
        <Drawer.Screen name="Lab" component={Lab} />
      </Drawer.Navigator>
    </PaperProvider>
  );
}
