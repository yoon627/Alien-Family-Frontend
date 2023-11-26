import React from "react";
import {StyleSheet, Text, View, TouchableOpacity, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const saveServer = async () => {
  try {
    await AsyncStorage.setItem("ServerAddress", "http://43.202.241.133:8080");
  } catch (error) {
    console.log(error);
  }
};

const Login = ({navigation}) => {
  saveServer();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="ufo-outline" size={35} color="black"/>
      <Text style={{fontSize: 55, fontWeight: 500, marginBottom: 75}}>
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
          style={
            styles.buttonStyle
          }
        >
          <Text
            style={styles.buttonText}
          >
            로그인
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("KaKaoLogin")}
          style={
            styles.buttonStyle
          }
        >
          <Text
            style={styles.buttonText}
          >
            카카오계정으로 회원가입
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("First Register")}
          style={
            styles.buttonStyle
          }
        >
          <Text
            style={styles.buttonText}
          >
            다음페이지로
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainDrawer")}
          style={
            styles.buttonStyle
          }
        >
          <Text
            style={styles.buttonText}
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
  buttonStyle: {
    backgroundColor: "black",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: "25%",
    marginVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default Login;