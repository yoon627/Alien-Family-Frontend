import React from "react";
import {View,} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AntDesign, Entypo, FontAwesome, MaterialIcons,} from "@expo/vector-icons";
import Album from "./Album";
import Home from "./Home";
import CalendarScreen from "./CalendarScreen";
import Feed from "./Feed";
import Attendance from "./Attendance";
import LadderScreen from "../views/LadderScreen";
import RouletteScreen from "../views/RouletteScreen";
import NewGame from "../views/NewGame";
import ChatRoom from "./Chatting";

const Tab = createBottomTabNavigator();

export default function MainScreen({navigation}) {
    return (<Tab.Navigator>
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                headerShown: false,
                tabBarIcon: () => <Entypo name="home" size={24} color="black"/>,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: "gray",
            }}
        />
        <Tab.Screen
            name="Album"
            component={Album}
            options={{
                headerShown: false,
                tabBarIcon: () => (<MaterialIcons name="photo-album" size={24} color="black"/>),
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: "gray",
            }}
        />
        <Tab.Screen
            name="Chatting"
            component={ChatRoom}
            options={{
                headerShown: false,
                tabBarIcon: () => <Entypo name="chat" size={24} color="black"/>,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: "gray",
            }}
        />
        <Tab.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
                headerShown: false,
                tabBarIcon: () => (<AntDesign name="calendar" size={24} color="black"/>),
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: "gray",
            }}
        />
        <Tab.Screen
            name="Feed"
            component={Feed}
            options={{
                headerShown: false,
                tabBarIcon: () => (<FontAwesome name="history" size={24} color="black"/>),
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: "gray",
            }}
        />
        <Tab.Screen
            name="Attendance"
            component={Attendance}
            options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: () => <View style={{width: 0, height: 0}}></View>,
                tabBarVisible: false, //hide tab bar on this screen
            }}
        />
        <Tab.Screen
            name="Ladder"
            component={LadderScreen}
            options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: () => <View style={{width: 0, height: 0}}></View>,
                tabBarVisible: false,
            }}
        />
        <Tab.Screen
            name="Roulette"
            component={RouletteScreen}
            options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: () => <View style={{width: 0, height: 0}}></View>,
                tabBarVisible: false,
            }}
        />
        <Tab.Screen
            name="Mole"
            component={NewGame}
            options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: () => <View style={{width: 0, height: 0}}></View>,
                tabBarVisible: false,
            }}
        />
    </Tab.Navigator>);
}
