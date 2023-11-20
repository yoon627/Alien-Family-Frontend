import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions,TextInput } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClickBox = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
          title="박스를 눌러보세요!"
          onPress={async () =>
            { 
              const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
              const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");
              await axios({
              method: "GET",
              url: SERVER_ADDRESS + "/api/register/familyCode",
              headers: {
                Authorization: 'Bearer: '+ServerAccessToken,
              },
            })
              .then(async(resp) => {
                const familyCode = resp.data
                await AsyncStorage.setItem("familyCode",familyCode)
                navigation.navigate("First Start",familyCode);
              })
              .catch(function (error) {
                console.log("server error", error);
              })}
          }
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
});

export default ClickBox;
