import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
//Todo
export default function FamilyInfo({ navigation }) {
  const [Family, setFamily] = useState({});
  const viewFamily = async () => {
    const tmp = await AsyncStorage.getItem("myDB")
      .then((resp) => {
        setFamily(JSON.parse(resp));
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    viewFamily();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.keys(Family).map((key) => (
          <View key={key} style={{flexDirection:"row"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
            <Text style={{fontSize:20}}>Nickname: {Family[key].nickname}</Text>
            <Text style={{fontSize:20}}>Title: {Family[key].title}</Text>
            </View>
            <View>
            <Image source={{uri:Family[key].picture}} style={styles.image}/>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200, // 이미지의 가로 크기 조절
    height: 200, // 이미지의 세로 크기 조절
    resizeMode: 'cover', // 이미지가 화면을 가득 채우도록 조절
    borderRadius: 200, // 이미지에 둥근 테두리를 주기 위한 값
  },
});
