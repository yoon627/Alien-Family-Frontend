import React from "react";
import {Dimensions, Platform} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import Logout from "./Logout";
import FamilyInfo from "./FamilyInfo";
import ChoseCalendar from "./ChoseCalendar";
import {PaperProvider} from "react-native-paper";
import Settings from "./Settings";

const Drawer = createDrawerNavigator();

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function MainDrawer({ navigation,route }) {
  const showFamilyInfo = route.params?.showFamilyInfo || false;
  if (showFamilyInfo){
    // navigation.navigate("Main",{params:{showFamilyInfo:true}});
    console.log("hi");
    navigation.navigate("FamilyInfo");
    console.log("hi2");

  }
  return (
    <PaperProvider>
      <Drawer.Navigator
        screenOptions={{
          headerTintColor: '#C336CF',
          drawerActiveBackgroundColor: '#F0E1EE',
          drawerActiveTintColor: '#434343',
          drawerInactiveTintColor: '#CC95D0',
          headerTitleStyle: {
            color: "#fff",
          },
          headerStyle: {
            height: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.1 : SCREEN_HEIGHT * 0.08,
            backgroundColor: "#fff"
          }
        }}
      >
        <Drawer.Screen
          name="Main"
          component={MainScreen}
          options={{ title: "홈" }}
        />
        <Drawer.Screen
          name="FamilyInfo"
          component={FamilyInfo}
          options={{ title: "우리 가족", headerShown: false }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{ title: "설정" }}
        />
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{ title: "회원 탈퇴" }}
        />
      </Drawer.Navigator>
    </PaperProvider>
  );
}
