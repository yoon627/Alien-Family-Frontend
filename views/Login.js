import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const saveServer = async () => {
  try {
    // await AsyncStorage.setItem("ServerAddress", "http://43.202.241.133:8080");
    await AsyncStorage.setItem("ServerAddress", "http://13.209.81.119:8080");
    console.log("set server");
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("UserServerAccessToken");
    console.log(token);
  } catch (error) {
    console.error("Error getMsg:", error);
  }
};

getData();

const Login = ({ navigation }) => {
  saveServer();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="ufo-outline" size={35} color="black" />
      <Text style={{ fontSize: 50, fontWeight: 500, marginBottom: 75 }}>
        UFO
      </Text>
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
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 20,
              marginVertical: 15,
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
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 15,
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
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 15,
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
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 15,
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
