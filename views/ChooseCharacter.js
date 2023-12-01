import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToggleButton } from "react-native-paper";
import axios from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ChooseCharacter = ({ navigation }) => {
  const [AlienType, setAlienType] = useState("BASIC");
  const [selectedToggle, setSelectedToggle] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const scrollViewRef = useRef(null);
  const imageList = [
    require("../assets/img/character/BASIC.png"),
    require("../assets/img/character/GLASSES.png"),
    require("../assets/img/character/GIRL.png"),
    require("../assets/img/character/BAND_AID.png"),
    require("../assets/img/character/RABBIT.png"),
    require("../assets/img/character/HEADBAND.png"),
    require("../assets/img/character/TOMATO.png"),
    require("../assets/img/character/CHRISTMAS_TREE.png"),
    require("../assets/img/character/SANTA.png"),
    require("../assets/img/character/PIRATE.png"),
  ];
  const iconList = [
    require("../assets/img/characterIcon/BASIC.png"),
    require("../assets/img/characterIcon/GLASSES.png"),
    require("../assets/img/characterIcon/GIRL.png"),
    require("../assets/img/characterIcon/BAND_AID.png"),
    require("../assets/img/characterIcon/RABBIT.png"),
    require("../assets/img/characterIcon/HEADBAND.png"),
    require("../assets/img/characterIcon/TOMATO.png"),
    require("../assets/img/characterIcon/CHRISTMAS_TREE.png"),
    require("../assets/img/characterIcon/SANTA.png"),
    require("../assets/img/characterIcon/PIRATE.png"),
  ];
  const ChooseType = (event) => {
    const { width } = Dimensions.get("window");
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / width);

    if (page >= 0 && page < iconList.length) {
      setAlienType(iconList[page]);
      setSelectedToggle(iconList[page]);
    }
  };
  const handleToggleChange = (value) => {
    setActiveButton(value);
    const index = iconList.indexOf(value);
    if (index !== -1) {
      scrollViewRef.current.scrollTo({
        x: index * (SCREEN_WIDTH * 0.85 - 20),
        animated: true,
      });
      setAlienType(value);
      setSelectedToggle(value);
    }
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={{ flex: 1, width: 0.85 * SCREEN_WIDTH }}>
          <View style={{ flex: 0.03 }} />
          <View style={{ flex: 0.6, paddingHorizontal: 10 }}>
            <ScrollView
              ref={scrollViewRef}
              indicatorStyle="black"
              pagingEnabled
              horizontal
              onScroll={ChooseType}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "#DED1DF", borderRadius: 20 }}
            >
              {imageList.map((character, index) => (
                <View key={index} style={{ flexDirection: "row" }}>
                  <View style={{}} />
                  <View
                    key={index}
                    style={{
                      width: SCREEN_WIDTH * 0.85 - 20,
                      height: SCREEN_HEIGHT * 0.8,
                      justifyContent: "flex-end", // 아래 정렬
                      alignItems: "flex-end", // 오른쪽 정렬
                      overflow: "hidden",
                    }}
                  >
                    <Image source={character} style={styles.character} />
                  </View>
                  <View style={{}} />
                </View>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: 260,
              }}
            >
              {iconList.map((characterIcon, index) => (
                <ToggleButton
                  key={index}
                  icon={() => (
                    <Image
                      source={characterIcon}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        resizeMode: "contain",
                        borderColor:
                          activeButton === characterIcon
                            ? "#F213A6"
                            : "#DED1DF",
                        borderWidth: 3,
                      }}
                    />
                  )}
                  value={characterIcon}
                  style={{ marginRight: index % 5 !== 4 ? 10 : 0 }}
                  onPress={() => {
                    handleToggleChange(characterIcon);
                  }}
                />
              ))}
            </View>
          </View>
          <View style={{ flex: 0.2 }}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  overflow: "hidden",
                  borderRadius: 15,
                  width: 175,
                  marginTop: 20,
                }}
              >
                <ImageBackground source={require("../assets/img/pinkBtn.png")}>
                  <TouchableOpacity
                    onPress={async () => {
                      const SERVER_ADDRESS = await AsyncStorage.getItem(
                        "ServerAddress"
                      );
                      const ServerAccessToken = await AsyncStorage.getItem(
                        "ServerAccessToken"
                      );
                      await axios({
                        method: "POST",
                        url: SERVER_ADDRESS + "/api/register/alien",
                        headers: {
                          Authorization: "Bearer: " + ServerAccessToken,
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
                    style={{
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        marginHorizontal: 30,
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      선택완료!
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  overflow: "hidden",
                  borderRadius: 15,
                  width: 175,
                  marginTop: 20,
                }}
              >
                <ImageBackground source={require("../assets/img/grayBtn.png")}>
                  <TouchableOpacity
                    onPress={async () => {
                      navigation.navigate("Invitation");
                    }}
                    style={{
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        marginHorizontal: 30,
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      이전 페이지로
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </View>
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
    backgroundColor: "white",
    marginHorizontal: 30,
    marginVertical: 40,
    borderRadius: 30,
  },
  character: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.75 * 0.9,
    resizeMode: "contain",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor:"white"
  },
});

export default ChooseCharacter;
