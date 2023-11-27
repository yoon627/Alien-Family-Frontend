import * as React from "react";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Sadari from "../components/sadari";

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

function LadderScreen() {
  const [cnt, onChangeCnt] = useState(2);
  const onPress = () => onChangeCnt((cur) => cur + 1);
  const onPress2 = () => onChangeCnt((cur) => cur - 1);

  return (
    <View style={{ flex: 1, alignItems: "center", top: 10 }}>
      <Text>사다리 게임 ㅋㅋ 사람수 ㅋㅋ {cnt}</Text>

      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <TouchableOpacity style={styles.button} onPress={onPress2}>
          <Text>--</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text>++</Text>
        </TouchableOpacity>
      </View>

      <Sadari cnt={cnt} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#264b62", // 버튼 색상
    paddingVertical: 10, // 세로 패딩
    paddingHorizontal: 10, // 가로 패딩
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

export default LadderScreen;
