import React from "react";
import {
  View,
  Text,
  Button,
} from "react-native";
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
