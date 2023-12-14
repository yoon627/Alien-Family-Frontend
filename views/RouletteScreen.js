import * as React from "react";
import {useState} from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RouletteGame from "../components/roulette";
import SoundPlayer from "../effect/sound";

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

function RouletteScreen() {
  const [cnt, onChangeCnt] = useState(0);
  const onPress = () => onChangeCnt((cur) => cur + 1);
  const onPress2 = () => onChangeCnt((cur) => cur - 1);

  return (
    <View style={styles.container}>
      <SoundPlayer/>
      <Text
        style={styles.title}>
        참가 인원: {cnt + 2}명
      </Text>

      <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
        <TouchableOpacity style={styles.button} onPress={onPress2}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <RouletteGame cnt={cnt + 2}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontFamily: "dnf",
    paddingTop: "10%",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#B9AAD3", // 버튼 색상
    // paddingVertical: 10, // 세로 패딩
    // paddingHorizontal: 10, // 가로 패딩
    borderRadius: 50, // 테두리 둥글게
    alignItems: "center",
    marginVertical: 5, // 버튼 간의 수직 마진
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 20,
    width: (windowWidth - 50) / 5,
  },
  btnText: {
    fontFamily: "dnf",
    fontSize: 25,
    color: "white",
  },
  bottomView: {
    position: "absolute", // 절대 위치 사용
    bottom: 100, // 화면의 바닥에 위치
    width: "100%", // 너비를 화면 전체로 설정
    alignItems: "center",
  },
});

export default RouletteScreen;
