import React from "react";
import {Dimensions, StyleSheet} from 'react-native';
import {createDrawerNavigator} from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import Logout from "./Logout";
import FamilyInfo from "./FamilyInfo";
import Lab from "./Lab";
import ChoseCalendar from "./ChoseCalendar";
import {PaperProvider} from "react-native-paper";
import Settings from "./Settings";

const Drawer = createDrawerNavigator();

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function MainDrawer({navigation}) {
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
            height: SCREEN_HEIGHT * 0.1,
            backgroundColor: "#fff"
          }
        }}
      >
        <Drawer.Screen name="Main" component={MainScreen} options={{title: '홈'}}/>
        <Drawer.Screen name="FamilyInfo" component={FamilyInfo} options={{title: '우리 가족'}}/>
        <Drawer.Screen name="Settings" component={ChoseCalendar} options={{title: '설정'}}/>
        <Drawer.Screen name="Logout" component={Logout} options={{title: '로그아웃'}}/>

      </Drawer.Navigator>
    </PaperProvider>
  );
}
