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

const REST_API_KEY = "53a4c1ed38ca9033bd5c086437b40943";
const REDIRECT_URI = "http://143.248.226.88:8081";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;
const SERVER_ADDRESS = "43.200.3.232:8080";

export default function KaKaoLogin({ navigation }) {
  const [AccessToken, setAccessToken] = useState("");
  function KaKaoLoginWebView(data) {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      requestToken(authorize_code).then(async () => {
        const test = await AsyncStorage.getItem("AToken");
        console.log(test);
      });
    }
  }

  const requestToken = async (authorize_code) => {
    var AccessToken = "none";
    var JWT = "none";

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
      .then((response) => {
        AccessToken = response.data.access_token;
        storeAccessToken(AccessToken);
        console.log(AccessToken);
      })
      .catch(function (error) {
        console.log("kakao error", error);
      });
    // await axios
    //   .post("http://" + SERVER_ADDRESS + "/api/login/kakao", AccessToken)
    //   .then((resp) => {
    //     JWT = resp.data.data.accessToken;
    //     console.log(JWT);
    //   })
    //   .catch(function (error) {
    //     console.log("server error", error);
    //   });
    // await axios({
    //   method:'POST',
    //   url: 'http://'+SERVER_ADDRESS+'/api/register',
    //   headers:{
    //     Authorization: `Bearer: ${JWT}`
    //   },
    //   data:{
    //     "nickname" : "ㅇㅈㅇ",
    //     "birthdate" : "1996-06-27",
    //     "title" : "아들"
    //     }
    // }).then((response)=>{
    //   // console.log(response.data);
    // }).catch(function(error){
    //   console.log('error',error);
    // })
    navigation.navigate("First Register");
  };

  const storeAccessToken = async (myAccessToken) => {
    try {
      await AsyncStorage.setItem("AToken", JSON.stringify(myAccessToken));
      const test = await AsyncStorage.getItem("AToken");
    } catch (error) {}
  };

  const getLocalAccessToken = async () => {
    var AT = "none";
    try {
      AT = await AsyncStorage.getItem("AToken");
    } catch (error) {}
    return JSON.parse(AT);
  };

  const getJWT = async (AccessToken) => {
    var JWT = "none";
    await axios
      .post("http://" + SERVER_ADDRESS + "/api/login/kakao", AccessToken)
      .then((resp) => {
        JWT = resp.data.accessToken;
      })
      .catch(function (error) {
        console.log("error", error);
      });
    return JWT;
  };

  const storeJWT = async (myJWT) => {
    try {
      await AsyncStorage.setItem("JToken", JSON.stringify(myJWT));
    } catch (error) {}
  };

  const getLocalJWT = async () => {
    var AT = "none";
    try {
      AT = await AsyncStorage.getItem("JToken");
    } catch (error) {}
    return JSON.parse(AT);
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
