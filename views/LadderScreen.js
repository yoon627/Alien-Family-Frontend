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
import SoundPlayer from "../effect/sound";

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
      <SoundPlayer/>
      <Text style={styles.title}>사다리 게임 </Text>
      <TouchableOpacity
        style={{position: "absolute", left: "5%", top: "6%"}}
        onPress={() => navigation.pop()}>
        <Image
          style={{width: 20, height: 20, resizeMode: "contain"}}
          source={require('../assets/img/out.png')}/>
      </TouchableOpacity>

      {/* 이름 목록 */}
      {!showSadari && (
        <View style={{alignItems: "center", justifyContent: "center",}}>
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
                <Text style={{ fontSize: 18, fontFamily: "wooju", color: selectedNames.includes(n) ? 'white' : 'black' }}>
                  {n}
                </Text>
              </TouchableOpacity>

            ))}
          </View>
          <TouchableOpacity style={{marginTop: "20%"}} onPress={toggleSadari}>
            <Text style={{fontSize: 20, fontFamily: "dnf", color: "#3F3CF2"}}>선택 완료!</Text>
          </TouchableOpacity>
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
    fontSize: 28,
    fontFamily: "dnf",
    paddingTop: "12%",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#B9AAD3",
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 5,
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
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  nameItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    marginVertical: 5,
  },
  selectedItem: {
    borderColor: "#B9AAD3",
    backgroundColor: "#B9AAD3",
  },
  nameListContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // 내용이 넘치면 다음 줄로 넘어가도록 설정
    alignItems: "center",
    justifyContent: "center",
    top: "10%",
  },
});

export default LadderScreen;
