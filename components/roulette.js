import React, {useEffect, useState} from "react";
import {
  Animated,
  Button,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {G, Path, Polygon, Text as SvgText} from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const randName = [
  "철수",
  "영희",
  "민수",
  "준호",
  "지은",
  "혜진",
  "태형",
  "지훈",
  "유나",
  "민지",
];
const RouletteGame = ({cnt}) => {
  if (cnt < 2) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>섹터의 개수가 최소 2개 이상이어야 합니다.</Text>
      </View>
    );
  }

  const [spinAnim] = useState(new Animated.Value(0));
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [name, setName] = useState(["A", "B"]);

  const [editIndex, setEditIndex] = useState(-1); // 편집 중인 섹터의 인덱스
  const [editText, setEditText] = useState(""); // 편집 중인 텍스트

  const [name, setName] = useState(
    Array(cnt)
      .fill(null)
      .map((_, i) => `${randName[i]}`),
  );
  useEffect(() => {
    // cnt 값이 변경될 때 name 배열 업데이트
    setName(
      Array(cnt)
        .fill(null)
        .map((_, i) => name[i] || `${randName[i]}`),
    );
  }, [cnt]);

  const spinWheel = () => {
    spinAnim.setValue(0);
    const randomSpin = 360 * 4 + Math.random() * 360;
    Animated.timing(spinAnim, {
      toValue: randomSpin,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      const finalAngle = randomSpin % 360;
      const index = Math.floor((360 - finalAngle) / (360 / cnt)) % cnt;
      setSelectedIndex(index);
    });
  };

  const sectors = [];
  const labels = [];
  const colors = [
    "#FFDD59", // Yellow
    "#FF5E57", // Red
    "#22a6b3", // Blue
    "#4834d4", // Dark Blue
    "#6ab04c", // Green
    "#30336b", // Navy Blue
    "#e056fd", // Purple
    "#be2edd", // Magenta
    "#f0932b", // Orange
    "#a29fbd", // Dark
    "#eb4d4b", // Light Red
  ];
  const angle = 360 / cnt;
  const radius = 150;

  for (let i = 0; i < cnt; i++) {
    const a = angle * i;
    const x1 = radius * Math.cos((a - 90) * (Math.PI / 180));
    const y1 = radius * Math.sin((a - 90) * (Math.PI / 180));
    const x2 = radius * Math.cos((a + angle - 90) * (Math.PI / 180));
    const y2 = radius * Math.sin((a + angle - 90) * (Math.PI / 180));
    sectors.push(
      <Path
        key={i}
        d={`M0 0 L${x1} ${y1} A${radius} ${radius} 0 ${
          angle > 180 ? 1 : 0
        } 1 ${x2} ${y2} Z`}
        fill={colors[i % colors.length]}
      />,
    );

    labels.push(
      <SvgText
        key={i}
        x={(radius / 2) * Math.cos((a + angle / 2 - 90) * (Math.PI / 180))}
        y={(radius / 2) * Math.sin((a + angle / 2 - 90) * (Math.PI / 180))}
        fill="black"
        fontSize="20"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {`${name[i]}`}
      </SvgText>,
    );
  }

  const handleUpdateName = () => {
    const updatedNames = [...name];
    updatedNames[editIndex] = editText;
    setName(updatedNames);
    setEditIndex(-1); // 편집 모드 종료
  };

  return (
    <View style={styles.container}>
      <View style={{position: "absolute", top: 20}}>
        <Svg height="30" width="30" viewBox="-15 -15 30 30">
          <Polygon points="0,10 -10,-10 10,-10" fill="red"/>
        </Svg>
      </View>
      <Animated.View
        style={{
          transform: [
            {
              rotate: spinAnim.interpolate({
                inputRange: [0, 360],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <Svg height="320" width="320" viewBox="-160 -160 320 320">
          <G>
            {sectors}
            {labels}
          </G>
        </Svg>
      </Animated.View>
      <View style={styles.button}>
        <TouchableOpacity
          onPress={spinWheel}
        >
          <Text style={styles.btnText}>룰렛 돌리기</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{ marginTop: 20 }}
      >{`${name[selectedIndex]} 당첨!`}</Text>

      {/* 섹터 이름 편집 부분 */}
      <View style={{flexDirection: "row"}}>
        {name.map((n, index) => (
          <View key={index} style={{flex: 1, alignItems: "center"}}>
            <TouchableOpacity
              style={[styles.button, {width: (windowWidth - 50) / cnt}]}
              onPress={() => {
                setEditIndex(index);
                setEditText(n);
              }}
            >
              <Text style={styles.text}>{n}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {editIndex !== -1 && (
        <View>
          <TextInput
            value={editText}
            onChangeText={setEditText}
            style={{borderWidth: 1, borderColor: "gray", padding: 10}}
          />
          <TouchableOpacity style={[styles.button]} onPress={handleUpdateName}>
            <Text style={styles.text}>UPDATE</Text>
          </TouchableOpacity>
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
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "white", // 버튼 색상
    paddingVertical: 10, // 세로 패딩
    paddingHorizontal: 20, // 가로 패딩
    borderRadius: 50, // 테두리 둥글게
    alignItems: "center",
    marginVertical: 5, // 버튼 간의 수직 마진
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 20,
    // width: (windowWidth - 50) / 5,
  },
  btnText: {
    fontFamily: "dnf",
    fontSize: 22,
    color: "black",
  },
  bottomView: {
    position: "absolute", // 절대 위치 사용
    bottom: 100, // 화면의 바닥에 위치
    width: "100%", // 너비를 화면 전체로 설정
    alignItems: "center",
  },
});

export default RouletteGame;
