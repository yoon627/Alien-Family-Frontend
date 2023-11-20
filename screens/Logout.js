import React, { useEffect } from "react";
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
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Logout({ navigation }) {
  return (
    <View>
      <Text>Logout</Text>
      <Button
        title="logout"
        onPress={() => {
          Alert.alert("logout?","really", [
            {
              text: "yes",
              onPress: async() => {
                await AsyncStorage.removeItem("ServerAccessToken");
                navigation.navigate("Login");
              },
            },
            { text: "no" },
          ]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
