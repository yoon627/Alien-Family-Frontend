import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ChooseCharacter = ({ navigation }) => {
  const [AlienType, setAlienType] = useState("CHILD");
  const [AlienColor, setAlienColor] = useState("black");
  const Characters = [1, 2, 3, 4];

  const ChooseType = (event) => {
    const { width } = Dimensions.get("window");
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / width);
    if(page === 0){
      setAlienType("CHILD");
    }else if(page === 1){
      setAlienType("YOUTH");
    }else if(page === 2){
      setAlienType("ADULT");
    }else{
      setAlienType("SENIOR");
    }
  };
  const color1 = () => {
    setAlienColor("black");
  };
  const color2 = () => {
    setAlienColor("white");
  };
  const color3 = () => {
    setAlienColor("red");
  };
  const color4 = () => {
    setAlienColor("blue");
  };
  return (
    <View style={styles.container}>
      <ScrollView
        indicatorStyle="black"
        pagingEnabled
        horizontal
        onScroll={ChooseType}
        showsHorizontalScrollIndicator={false}
      >
        {Characters.map((Character, index) => (
          <View key={index} style={styles.character}>
            <Text style={{ ...styles.characterFont, color: AlienColor }}>
              {Character}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttongroup}>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "black" }}
          onPress={color1}
        >
          <Text style={styles.colortxt}>BLACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "white" }}
          onPress={color2}
        >
          <Text style={{color:"black"}}>WHITE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "red" }}
          onPress={color3}
        >
          <Text style={styles.colortxt}>GREEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "blue" }}
          onPress={color4}
        >
          <Text style={styles.colortxt}>BLACK</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="그냥 넘어가기 Invitation"
        onPress={() => {
          navigation.navigate("Invitation");
        }}
      />
      <Button
        title="Invitation"
        onPress={async () => {
          const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
          const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");
          console.log("serveraddress: "+SERVER_ADDRESS);
          console.log("SAT: "+ServerAccessToken);
          await axios({
            method: "POST",
            url: SERVER_ADDRESS + "/api/register/alien",
            headers: {
              Authorization: 'Bearer: '+ ServerAccessToken,
            },
            data: {
              color: AlienColor.toUpperCase(),
              type: AlienType,
            },
          })
            .then((resp) => {
              navigation.navigate("Invitation");
            })
            .catch(function (error) {
              console.log("server error", error);
            });
        }}
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
  character: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  characterFont: {
    fontSize: 500,
  },
  buttongroup: {
    flexDirection: "row",
  },
  colorbtn: {
    paddingHorizontal: 20,
  },
  colortxt: {
    color: "white",
  },
});

export default ChooseCharacter;
