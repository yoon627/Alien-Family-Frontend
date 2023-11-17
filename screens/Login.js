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

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login Screen</Text>
      <View style={styles.footer}>
        {/* <Button
          title="카카오 로그인 테스트"
          onPress={() => navigation.navigate("KaKaoLoginTest")}
        /> */}
        <Button
          title="카카오 로그인"
          onPress={() => navigation.navigate("KaKaoLogin")}
        />
        <Button
          title="First Register"
          onPress={() => navigation.navigate("First Register")}
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
