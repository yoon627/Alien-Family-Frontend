import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Image, View, StyleSheet, Dimensions} from "react-native";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function AlienType({writer}) {
  const [familyInfo, setFamilyInfo] = useState([]);

  const alienImagePath = {
    BASIC: require(`../assets/img/character/BASIC.png`),
    GLASSES: require(`../assets/img/character/GLASSES.png`),
    GIRL: require(`../assets/img/character/GIRL.png`),
    BAND_AID: require(`../assets/img/character/BAND_AID.png`),
    RABBIT: require(`../assets/img/character/RABBIT.png`),
    HEADBAND: require(`../assets/img/character/HEADBAND.png`),
    TOMATO: require(`../assets/img/character/TOMATO.png`),
    CHRISTMAS_TREE: require(`../assets/img/character/CHRISTMAS_TREE.png`),
    SANTA: require(`../assets/img/character/SANTA.png`),
    PIRATE: require(`../assets/img/character/PIRATE.png`),
  };

  // 가족 정보
  useEffect(() => {
    const viewFamily = async () => {
      try {
        const resp = await AsyncStorage.getItem("myDB");
        setFamilyInfo(JSON.parse(resp));
      } catch (e) {
        console.log(e);
      }
    };
    viewFamily();
  }, []);

  function getAlienTypeByNickname(familyInfo, writer) {
    for (const key in familyInfo) {
      if (familyInfo[key].nickname === writer) {
        return familyInfo[key].alien.type;
      }
    }
    return null;
  }

  function findImageByName(writer) {
    const alienName = getAlienTypeByNickname(familyInfo, writer.trim());
    if (alienName === null) {
      return alienImagePath["BASIC"];
    }
    return alienImagePath[alienName];
  }

  return (
    <View>
      <Image
        style={styles.profilePic}
        source={findImageByName(writer)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  profilePic: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.1 / 2,
    resizeMode: "contain",
    backgroundColor: "#FFEEC3",
    marginRight: 10,
  },
})