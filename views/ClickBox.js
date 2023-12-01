import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Clipboard, Dimensions, Button, ImageBackground  } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SCREEN_WIDTH = Dimensions.get('window').width;

const ClickBox = ({ navigation }) => {
const [familyCode, setFamilyCode] = useState(null);
const [showBox, setShowBox] = useState(false);

  const getFamilyCode = async () => {
    try {
      const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
      const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");

      const response = await axios({
        method: "GET",
        url: SERVER_ADDRESS + "/api/register/familyCode",
        headers: {
          Authorization: "Bearer " + ServerAccessToken,
        },
      });

      const newFamilyCode = response.data;
      console.log
      console.log(newFamilyCode);
      setFamilyCode(newFamilyCode);
      setShowBox(true)
    } catch (error) {
      console.log("server error", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      console.log("Copying to clipboard...");
      if (familyCode) {
        await Clipboard.setString(familyCode);
        alert("초대코드가 클립보드에 복사되었습니다.");
      } else {
        alert("초대코드가 없습니다.");
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <View style={styles.container}>  
      {showBox ?
      (
        <View style={styles.box_container}>
          <Image
            source={require("../assets/img/openBox.png")}
            style={{ width: SCREEN_WIDTH * 1}}
            resizeMode="contain"
          />
          <View style={styles.sub_box_container}>
            <View style={styles.invitaionBox}>
              <Text style={{fontSize: 19, fontWeight: '800'}}
              >{familyCode}</Text>
              <TouchableOpacity onPress={copyToClipboard}>
                <Text style={{fontSize: 15, backgroundColor: '#D63CE3', padding: 10, marginTop: 10}}>
                초대코드 복사하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
              onPress={() => navigation.navigate("First Start", familyCode)}   
              >
              <ImageBackground
                source={require("../assets/img/pinkBtn.png")}                
                imageStyle={{borderRadius: 15}}
              >
                <Text style={styles.pinkBtnTxt}>다음페이지로</Text>
              </ImageBackground>
            </TouchableOpacity>
        </View>
      ) : (       
        <View style={styles.box_container}>
          <TouchableOpacity onPress={getFamilyCode}>
          <Image
              source={require("../assets/img/invitationBox.png")}
              style={{ width: SCREEN_WIDTH * 0.6}}
              resizeMode="contain"
          />
          </TouchableOpacity>
          
          <Text style={styles.pinkBtnTxt}>박스를 눌러주세요!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#DED1DF',
  },
  box_container: {
    width: SCREEN_WIDTH * 0.8,
    justifyContent: "center", // 수평 중앙 정렬
    alignItems: "center",     // 수직 중앙 정렬
  },
  
  sub_box_container:{
    position: 'absolute',
    alignItems: "center",

  },
  invitaionBox:{
    backgroundColor: '#FFF',
    opacity: 0.7,
    padding: 20,
    marginBottom: 100,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    paddingVertical: 35
  },
  pinkBtnTxt:{
    padding: 20,
    fontSize: 20,
    color: '#FFF',
    backgroundColor: '#D63CE3',
    borderRadius: 15
  },
  
});

export default ClickBox;
