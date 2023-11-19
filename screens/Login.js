import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KaKaoLogin from "./KaKaoLogin";

const saveServer = async () => {
  try {
    await AsyncStorage.setItem("ServerAddress", "http://3.35.234.254:8080");
  } catch (error) {
    console.log(error);
  }
};

const Login = ({ navigation }) => {
  saveServer();
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login Screen</Text>
      <View>
        <Button
          title="로그인"
          onPress={async () =>{
          const test = await AsyncStorage.getItem("ServerAccessToken");
          if(test){
            navigation.navigate("MainDrawer");
          }else{
            Alert.alert("회원가입해주세요");
          }
          }}
        />
        <Button
          title="카카오계정으로 회원 가입"
          onPress={() => navigation.navigate("KaKaoLogin")}
        />
        <Button
          title="First Register"
          onPress={() => navigation.navigate("First Register")}
        />
        <Button
          title="Main Screen"
          onPress={() => navigation.navigate("MainDrawer")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
});

export default Login;
