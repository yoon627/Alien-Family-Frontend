import React, { useCallback } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';

const saveServer = async () => {
  try {
    await AsyncStorage.setItem("ServerAddress", "http://43.202.241.133:12345");
    await AsyncStorage.setItem(
      "FcmServerKey",
      "AAAAUCMBJiU:APA91bEs9fOJNe6l2ILHFI88jep5rw9wqR-qTWWbBrKxj7JQnKQ8ZAp4tJbn_yXcL2aP0ydygPIcT89XB6h38vhIozsJ5J61s7w2znBL9hPQG6a18sQcUFkMitr2pkvoCmmfslVQmk-u"
    );
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("UserServerAccessToken");
  } catch (error) {
    console.error("Error getMsg:", error);
  }
};

getData();

const Login = ({ navigation }) => {
  const [isLoaded] = useFonts({
    'DNFBitBitv2': require('../assets/fonts/DNFBitBitv2.ttf'),
  });

  if (!isLoaded) {
    return <AppLoading />;
  }
  saveServer();
  return (
    <ImageBackground
      source={require("../assets/img/loginScreen.png")}
      style={styles.backgroundImage}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 7 }} />
        <View
          style={{ flex: 1.5, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 40,
              lineHeight: 40,
              marginTop: 20,
              fontFamily:'DNFBitBitv2',
            }}
          >
            ALIEN
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 40,
              lineHeight: 40,
              fontFamily:'DNFBitBitv2',
            }}
          >
            FAMILY
          </Text>
          <Text style={{ color: "white", marginVertical: 10 }}>
            당신의 가족을 찾아보세요!
          </Text>
        </View>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 3,
          }}
        >
          <View style={{ overflow: "hidden", borderRadius: 15, width: 175 }}>
            <ImageBackground source={require("../assets/img/myBtn.png")}>
              <TouchableOpacity
                onPress={async () => {
                  const test = await AsyncStorage.getItem(
                    "UserServerAccessToken"
                  );
                  if (test) {
                    navigation.navigate("MainDrawer");
                  } else {
                    Alert.alert("회원가입해주세요");
                  }
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    marginHorizontal: 20,
                    marginVertical: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  Start!
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("KaKaoLogin")}
            style={{
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                marginHorizontal: 30,
                marginVertical: 15,
                alignItems: "center",
                justifyContent: "center",
                textDecorationLine: "underline",
              }}
            >
              카카오계정으로 회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
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
