// import axios from "axios";
import React, { useState, useRef } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { Alert } from "react-native";

const FirstRegister = ({ route, navigation }) => {
  const cameFrom = route.params;
  const { width, height } = Dimensions.get("window");
  const [name, setName] = useState("");
  const [birthday, setBirthDay] = useState(new Date());
  const [birthdayCheck, setBirthDayCheck] = useState(false);
  const [showBirthDayPicker, setShowBirthDayPicker] = useState(false);
  const [familyRole, setFamilyRole] = useState("");
  const onChangeName = (payload) => setName(payload);

  const onBirthDayChange = (event, selected) => {
    const birthDate = selected || birthday;
    if (Platform.OS === "android") {
      setShowBirthDayPicker(false);
    }
    setBirthDayCheck(true);
    setBirthDay(birthDate); // Ensure currentDate is a Date object
  };

  function formatYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <ImageBackground
      source={require("../assets/img/pinkBtn.png")}
      style={styles.backgroundImage}
    >
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 30,
            flex: 0.8,
            width: 0.85 * width,
          }}
        >
          <View
            style={{
              marginTop: 35,
              flex: 0.9,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginVertical: 5,
                borderRadius: 30,
                paddingHorizontal: 30,
                paddingVertical: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <TextInput
                  value={name}
                  placeholder=" 닉네임을 입력해주세요"
                  placeholderTextColor="gray"
                  style={{
                    ...styles.input,
                    borderColor: "#F213A6",
                    borderWidth: 3,
                    marginBottom: 20,
                    fontSize: 20,
                    width: 250,
                    height: 70,
                  }}
                  onChangeText={onChangeName}
                />
              </View>
              <View
                style={{
                  ...styles.input,
                  borderColor: "#F213A6",
                  borderWidth: 3,
                  marginBottom: 20,
                  width: 250,
                  height: 70,
                }}
              >
                <TouchableOpacity onPress={() => setShowBirthDayPicker(true)}>
                  {birthdayCheck ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {formatYYYYMMDD(birthday)}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "gray", fontSize: 20 }}>
                        생일을 입력해주세요
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    ...styles.input,
                    borderColor: "#F213A6",
                    borderWidth: 3,
                    width: 250,
                    height: 85,
                  }}
                >
                  <RNPickerSelect
                    textInputProps={{ underlineColorAndroid: "transparent" }}
                    fixAndroidTouchableBug={true}
                    value={familyRole}
                    onValueChange={(value) => setFamilyRole(value)}
                    placeholder={{
                      label: "호칭 선택",
                      color: "gray",
                    }}
                    items={[
                      { label: "할아버지", value: "GRANDFATHER" },
                      { label: "할머니", value: "GRANDMOTHER" },
                      { label: "아빠", value: "DAD" },
                      { label: "엄마", value: "MOM" },
                      { label: "첫째", value: "FIRST" },
                      { label: "둘째", value: "SECOND" },
                    ]}
                  />
                </View>
              </View>
              {showBirthDayPicker && (
                <View>
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="spinner"
                    textColor="white"
                    onChange={onBirthDayChange}
                  />
                  {Platform.OS === "ios" && (
                    <Button
                      title="닫기"
                      onPress={() => setShowBirthDayPicker(false)}
                    />
                  )}
                </View>
              )}
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
              <ImageBackground source={require("../assets/img/pinkBtn.png")}>
                <TouchableOpacity
                  onPress={async () => {
                    await AsyncStorage.setItem("nickname", name);
                    await AsyncStorage.setItem("birthday", formatYYYYMMDD(birthday
                    ));
                    await AsyncStorage.setItem("familyRole", familyRole);
                    if (!name){
                      Alert.alert("이름을 적어주세요");
                    }else if(formatYYYYMMDD(birthday)===formatYYYYMMDD(new Date())){
                      Alert.alert("생일을 알려주세요");
                    }else if(!familyRole){
                      Alert.alert("호칭을 알려주세요");
                    }else{
                      navigation.navigate("ChooseCharacter");
                    }
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
                    제출하기
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View style={{ overflow: "hidden", borderRadius: 15, width: 175 }}>
              <ImageBackground source={require("../assets/img/grayBtn.png")}>
                <TouchableOpacity
                  onPress={() => {
                    if (cameFrom === "FirstStart") {
                      navigation.navigate("FirstStart");
                    } else {
                      navigation.navigate("Invitation");
                    }
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 18,
    marginVertical: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedValue: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default FirstRegister;
