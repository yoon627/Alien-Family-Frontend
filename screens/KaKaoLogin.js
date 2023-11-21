import React, { useState } from "react";
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
import { useSelector } from "react-redux";

const REST_API_KEY = "53a4c1ed38ca9033bd5c086437b40943";
const REDIRECT_URI = "http://143.248.226.110:19000";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KaKaoLogin({ navigation }) {
  function KaKaoLoginWebView(data) {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      requestToken(authorize_code);
    }
  }

  const requestToken = async (authorize_code) => {
    var KAT = "none";
    var SAT = "none";
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    await axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,
      },
    })
      .then(async (response) => {
        KAT = response.data.access_token;
        await AsyncStorage.setItem("KakaoAccessToken", KAT);
      })
      .catch(function (error) {
        console.log("kakao error", error);
      });
    await axios
      .post(SERVER_ADDRESS + "/api/login/kakao", KAT)
      .then(async(resp) => {
        SAT = resp.data.data.accessToken;
        await AsyncStorage.setItem("ServerAccessToken", SAT);
        navigation.navigate("First Register");
      })
      .catch(function (error) {
        console.log("server error", error);
      });
    // navigation.navigate("First Register");
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={(event) => {
          KaKaoLoginWebView(event.nativeEvent["url"]);
        }}
      />
    </View>
  );
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
});
