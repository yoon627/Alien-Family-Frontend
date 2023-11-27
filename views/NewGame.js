import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MoleGame from "../components/game";

const windowWidth = Dimensions.get("screen").width;
const NewGame = ({ content }) => {
  const [cnt, onChangeCnt] = useState(0);
  const onPress = () => onChangeCnt((cur) => cur + 1);
  const onPress2 = () => onChangeCnt((cur) => cur - 1);

  return (
    <View style={{ flex: 1, alignItems: "center", top: 50 }}>
      <Text>두 더 지 게 임</Text>
      <MoleGame />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#264b62", // 버튼 색상
    paddingVertical: 20, // 세로 패딩
    paddingHorizontal: 20, // 가로 패딩
    borderRadius: 5, // 테두리 둥글게
    alignItems: "center",
    marginVertical: 5, // 버튼 간의 수직 마진
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 20,
    width: (windowWidth - 50) / 5,
  },

  bottomView: {
    position: "absolute", // 절대 위치 사용
    bottom: 100, // 화면의 바닥에 위치
    width: "100%", // 너비를 화면 전체로 설정
    alignItems: "center",
  },
});
export default NewGame;
