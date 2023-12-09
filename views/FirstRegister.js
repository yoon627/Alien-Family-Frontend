// import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
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
import axios from "axios";

const FirstRegister = ({ route, navigation }) => {
  const cameFrom = route.params.cameFrom;
  const roleArr = route.params.roleArr;
  // console.log(route.params.roleArr);
  // console.log(route.params.cameFrom);
  const { width, height } = Dimensions.get("window");
  const [name, setName] = useState("");
  const [birthday, setBirthDay] = useState(new Date());
  const [birthdayCheck, setBirthDayCheck] = useState(false);
  const [showBirthDayPicker, setShowBirthDayPicker] = useState(false);
  const [familyRole, setFamilyRole] = useState("");
  const [pickerItems, setPickerItems] = useState([]);
  const onChangeName = (payload) => setName(payload);
  const changeRoleName = {
    DAD: "아빠",
    MOM: "엄마",
    FIRST: "첫째",
    SECOND: "둘째",
    THIRD: "셋째",
    FOURTH: "넷째",
    FIFTH: "다섯째",
    SIXTH: "여섯째",
    GRANDFATHER: "할아버지",
    GRANDMOTHER: "할머니",
    UNCLE: "삼촌",
    EXTRA: "기타",
  };
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
  useEffect(() => {
    // roleArr에 따라 적절한 items를 설정
    const items = roleArr.map((role) => ({
      label: changeRoleName[role],
      value: role,
    }));

    // PickerItems 업데이트
    setPickerItems(items);
  }, []);
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
                    items={pickerItems}
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
                    await AsyncStorage.setItem(
                      "birthday",
                      formatYYYYMMDD(birthday)
                    );
                    await AsyncStorage.setItem("familyRole", familyRole);
                    if (!name) {
                      Alert.alert("이름을 적어주세요");
                    } else if (
                      formatYYYYMMDD(birthday) === formatYYYYMMDD(new Date())
                    ) {
                      Alert.alert("생일을 알려주세요");
                    } else if (!familyRole) {
                      Alert.alert("호칭을 알려주세요");
                    } else {
                      const SERVER_ADDRESS = await AsyncStorage.getItem(
                        "ServerAddress"
                      );
                      const familyCode = await AsyncStorage.getItem(
                        "familyCode"
                      );
                      if (cameFrom == "FirstStart") {
                        var characterJson = {
                          BASIC: true,
                          GLASSES: true,
                          GIRL: true,
                          BAND_AID: true,
                          RABBIT: true,
                          HEADBAND: true,
                          TOMATO: true,
                          CHRISTMAS_TREE: true,
                          SANTA: true,
                          PIRATE: true,
                        };
                        navigation.navigate("ChooseCharacter", {
                          characterJson: characterJson,
                        });
                      } else {
                        await axios({
                          method: "GET",
                          url: SERVER_ADDRESS + "/api/familyInfo/" + familyCode,
                        })
                          .then((resp) => {
                            const roles = resp.data.data.types;
                            // console.log(roles);
                            var characterJson = {};
                            for (let i = 0; i < roles.length; i++) {
                              if (roles[i]["enabled"]) {
                                characterJson[roles[i]["type"]] =
                                  roles[i]["enabled"];
                              }
                            }
                            // console.log(characterJson);
                            navigation.navigate("ChooseCharacter", {
                              characterJson: characterJson,
                            });
                          })
                          .catch((e) => console.log(e));
                        // navigation.navigate("ChooseCharacter");
                      }
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
