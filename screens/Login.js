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
    await AsyncStorage.setItem("ServerAddress", "http://43.202.241.133:8080");
  } catch (error) {
    console.log(error);
  }
};

const Login = ({ navigation }) => {
  saveServer();
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={async () => {
            const test = await AsyncStorage.getItem("UserServerAccessToken");
            if (test) {
              navigation.navigate("MainDrawer");
            } else {
              Alert.alert("회원가입해주세요");
            }
          }}
          style={{
            backgroundColor: "black",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical:20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            로그인
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("KaKaoLogin")}
          style={{
            backgroundColor: "black",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical:20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            카카오계정으로 회원가입
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("First Register")}
          style={{
            backgroundColor: "black",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical:20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            다음페이지로
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainDrawer")}
          style={{
            backgroundColor: "black",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical:20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            메인페이지로
          </Text>
        </TouchableOpacity>
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
