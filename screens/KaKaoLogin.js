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

const REST_API_KEY = "53a4c1ed38ca9033bd5c086437b40943";
const REDIRECT_URI = "http://143.248.61.143:8081";
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
    var AccessToken = "none";
    axios({
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
        // requestUserInfo(AccessToken);
        // console.log(AccessToken);
        // axios
        //   .post("http://13.209.76.237:8080/api/login/kakao", AccessToken)
        //   .then((response) => {
        //     console.log(response.data.accessToken);
        //   })
        //   .catch(function (error) {
        //     console.log("error", error);
        //   });
        // console.log(AccessToken);
        storeData(AccessToken);
        // const r = async()=>{
        //     try{
        //         const AT = await AsyncStorage.getItem("userAccessToken");
        //         console.log(AT)
        //     }catch(error){

        //     }
        // }
        // r();
      })
      .catch(function (error) {
        console.log("error", error);
      });
    navigation.navigate("First Register");
  };

  const storeData = async (returnValue) => {
    try {
      await AsyncStorage.setItem("userAccessToken", returnValue);
    } catch (error) {}
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
