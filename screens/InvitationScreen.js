import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InvitationScreen = ({ navigation }) => {
  const [InvitationCode, setInvitationCode] = useState("");
  const onChangeInvitationCode = (payload) => setInvitationCode(payload);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="초대코드를 입력해주세요"
        style={styles.input}
        value={InvitationCode}
        onChangeText={onChangeInvitationCode}
      />
      <Button
        title="Go"
        onPress={async () => {
          const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
          const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");
          await axios({
            method: "GET",
            url:
              SERVER_ADDRESS + "/api/register/currentFamily/" + InvitationCode,
            headers: {
              Authorization: 'Bearer: '+ServerAccessToken,
            },
          })
            .then((resp) => {
              console.log(resp)
              navigation.navigate("MainDrawer");
            })
            .catch(function (error) {
              console.log("server error", error);
            });
        }}
      />
      <Button
        title="No Invitation?"
        onPress={() => navigation.navigate("ClickBox")}
      />
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
  character: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  characterFont: {
    fontSize: 500,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
});

export default InvitationScreen;
