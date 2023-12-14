import * as React from "react";
import {useEffect, useState} from "react";
import {
  Alert,
  Dimensions, Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Sadari from "../components/sadari";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

function LadderScreen({navigation}) {
  const [cnt, onChangeCnt] = useState(2);
  const [showSadari, setShowSadari] = useState(false);
  const [name, setname] = useState([]);
  const [myfam, setMyfam] = useState(null);
  const [selectedNames, setSelectedNames] = useState(""); // 선택된 이름 상태
  const toggleSadari = () => {
    setShowSadari(!showSadari);
  };

  const onPress = () => onChangeCnt((cur) => cur + 1);
  const onPress2 = () => onChangeCnt((cur) => cur - 1);

  useEffect(() => {
    async function fetchData() {
      const myfaminfo = await AsyncStorage.getItem("myDB");
      const data = JSON.parse(myfaminfo);
      let nicknames = Object.values(data).map((user) => user.nickname);
      setMyfam(data);
      onChangeCnt(nicknames.length);
      setname(nicknames);
    }

    fetchData();
  }, []);

  const toggleName = (n) => {
    if (selectedNames.includes(n)) {
      setSelectedNames(selectedNames.filter((name) => name !== n));
    } else {
      if (selectedNames.length >= 10) {
        Alert.alert("최대 10개까지만 선택 가능합니다.");
        return;
      }
      setSelectedNames([...selectedNames, n]);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>사다리 게임 </Text>
      <TouchableOpacity
        style={{position: "absolute", left: "5%", top: "5%"}}
        onPress={() => navigation.pop()}>
        <Image
          style={{width: 20, height: 20, resizeMode: "contain"}}
          source={require('../assets/img/out.png')}/>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <TouchableOpacity style={styles.button} onPress={onPress2}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      {!showSadari && (
        <TouchableOpacity style={{position: "absolute", top: "10%"}} onPress={toggleSadari}>
          <Text>선택 완료</Text>
        </TouchableOpacity>
      )}
      </View>

      {/* 이름 목록 */}
      {!showSadari && (
        <View style={styles.nameListContainer}>
          {name.map((n, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.nameItem,
                selectedNames.includes(n) ? styles.selectedItem : null,
              ]}
              onPress={() => toggleName(n)}
            >
              <Text>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showSadari && (
        <Sadari
          cnt={selectedNames.length}
          name={selectedNames}
          familyInfo={myfam}
        />
      )}
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
  nameItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#cd0beb",
    margin: 5,
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: "#cd0beb",
  },
  nameListContainer: {
    flexDirection: "row", // 이름 목록을 가로 방향으로 나열
    flexWrap: "wrap", // 내용이 넘치면 다음 줄로 넘어가도록 설정
    alignItems: "center",
    justifyContent: "center",
    top: "25%",
  },
});

export default LadderScreen;
