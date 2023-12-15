import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { FontAwesome } from "@expo/vector-icons";
import SoundPlayer from "../effect/sound";
import {Audio} from "expo-av";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height; // 디바이스의 높이
const imageUriArray = [
  { name: "BASIC", image: require("../assets/img/character/BASIC.png") },
  { name: "GLASSES", image: require("../assets/img/character/GLASSES.png") },
  { name: "GIRL", image: require("../assets/img/character/GIRL.png") },
  {
    name: "BAND_AID",
    image: require("../assets/img/character/BAND_AID.png"),
  },
  { name: "RABBIT", image: require("../assets/img/character/RABBIT.png") },
  {
    name: "HEADBAND",
    image: require("../assets/img/character/HEADBAND.png"),
  },
  { name: "TOMATO", image: require("../assets/img/character/TOMATO.png") },
  {
    name: "CHRISTMAS_TREE",
    image: require("../assets/img/character/CHRISTMAS_TREE.png"),
  },
  { name: "SANTA", image: require("../assets/img/character/SANTA.png") },
  { name: "PIRATE", image: require("../assets/img/character/PIRATE.png") },
];

const Sadari = ({ cnt, name, familyInfo }) => {
  const [positions, setPositions] = useState([]);
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [columnsWithHorizontalLines, setColumnsWithHorizontalLines] = useState(
    [],
  );
  const [finalIndexes, setFinalIndexes] = useState(Array(cnt).fill(null));
  const [coverLadder, setCoverLadder] = useState(true);

  const columnWidth = windowWidth / (1 * cnt);
  const ladderHeight = windowHeight * 0.5;

  const [userTexts, setUserTexts] = useState(Array(cnt).fill("꽝"));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [myName, setMyName] = useState(null);
  const [roomNumber, setRoomNumber] = useState(null);

  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function loadSound() {
    const loadedSound = await Audio.Sound.createAsync(
      require('../assets/Circus.mp3')
    );
    setSound(loadedSound.sound);
  }

  const handlePress = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  //결과 전송을 위한
  useEffect(() => {
    const connection = async () => {
      try {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const name = await AsyncStorage.getItem("nickname");
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const familyId = await AsyncStorage.getItem("familyId");
        const chatroomId = await AsyncStorage.getItem("chatroomId");

        setMyName(name);
        setRoomNumber(chatroomId);
        // console.log(SERVER_ADDRESS.slice(7));
        const client = new Client({
          brokerURL: "ws://" + SERVER_ADDRESS.slice(7) + "/ws",
          connectHeaders: {
            Authorization: token,
          },
          onConnect: () => {
            console.log("Connected to the WebSocket server");
          },
          onStompError: (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
          },
        });

        const interval = setInterval(() => {
          if (!client.connected) {
            // console.log("연결시도중");
            client.activate();
          }
        }, 1000); // 1초마다 연결 상태 체크
        setStompClient(client);
        return () => {
          clearInterval(interval);
          if (client) {
            client.deactivate();
          }
        };
      } catch (error) {
        console.log("Error :", error);
      }
    };

    connection();
  }, []);

  function getAlienTypeByNickname(data, nickname) {
    for (const key in data) {
      if (data[key].nickname === nickname) {
        return data[key].alien.type;
      }
    }
    return null; // nickname에 해당하는 사용자가 없는 경우
  }

  const data = familyInfo;

  function findImageByName(sender) {
    const alienName = getAlienTypeByNickname(data, sender);
    return imageUriArray.find((item) => item.name === alienName).image;
  }

  const openModal = () => {
    setIsModalVisible(true);
  };

  const renderModalContent = () => {
    // userName 가져오기
    return finalIndexes.map((finalIndex, i) => {
      // 유효한 결과를 확인하고, 해당하는 텍스트를 표시
      const resultText =
        finalIndex !== null && userTexts[finalIndex]
          ? userTexts[finalIndex]
          : "No result";

      return (
        <View key={`result-${i}`} style={styles.resultRow}>
          <Text style={{ fontSize: 18, fontFamily: "dnf", width: "40%" }}>
            {name[i]}
          </Text>
          <View style={{ width: "20%" }}>
            <FontAwesome name="arrow-right" size={24} color="#4E4D4D" />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "dnf",
              width: "30%",
              color: resultText === "꽝" ? "#CC1F34" : "#3C38DA",
            }}
          >
            {resultText}
          </Text>
        </View>
      );
    });
  };

  useEffect(() => {
    const newPositions = Array(cnt)
      .fill()
      .map(() => new Animated.ValueXY({ x: 0, y: 0 }));
    setPositions(newPositions);

    const newHorizontalLines = [];
    const columnsWithHorizontalLines = Array(cnt)
      .fill()
      .map(() => []);
    const gap = 50;

    for (let i = 0; i < cnt - 1; i++) {
      const randomLineCnt = Math.floor(Math.random() * 3) + 1;
      let lastYPosition = 100;
      for (let j = 0; j < randomLineCnt; j++) {
        // const yPosition = lastYPosition + Math.floor(Math.random() * 150) + 50;
        const yPosition =
          lastYPosition +
          (Math.random() * (ladderHeight * 0.7)) / randomLineCnt +
          20;
        lastYPosition = yPosition;
        newHorizontalLines.push({
          fromColumn: i,
          toColumn: i + 1,
          yPosition: yPosition,
        });

        columnsWithHorizontalLines[i].push({
          toColumn: i + 1,
          yPosition: yPosition,
        });

        columnsWithHorizontalLines[i + 1].push({
          fromColumn: i,
          yPosition: yPosition,
        });
      }
      setUserTexts((prevTexts) => {
        const newTexts = [...prevTexts];
        newTexts[i + 1] = "PASS";
        return newTexts;
      });
    }
    setHorizontalLines(newHorizontalLines);
    setColumnsWithHorizontalLines(columnsWithHorizontalLines);
    for (let j = 0; j < columnsWithHorizontalLines.length; j++) {
      columnsWithHorizontalLines[j].sort((a, b) => a.yPosition - b.yPosition);
    }
  }, [cnt]);

  const handleUserTextChange = (text, index) => {
    setUserTexts((prevTexts) => {
      const newTexts = [...prevTexts];
      newTexts[index] = text;
      return newTexts;
    });
  };

  const moveImage = (index) => {
    let sequence = [];
    let currentY = 90; // 시작점의 Y 위치
    let currentX = 0;
    let movto = 0;
    let lineIndex = index;
    setCoverLadder(false);
    while (currentY !== 9999) {
      let nowpos = 0;
      for (let j = 0; j < columnsWithHorizontalLines[lineIndex].length; j++) {
        if (columnsWithHorizontalLines[lineIndex][j].yPosition > currentY) {
          sequence.push(
            Animated.timing(positions[index].y, {
              toValue: columnsWithHorizontalLines[lineIndex][j].yPosition - 10,
              duration: (500 - currentY) * 1,
              useNativeDriver: true,
            }),
          );
          currentY = columnsWithHorizontalLines[lineIndex][j].yPosition;
          // console.log("움직였다....");
          nowpos = j;
          break;
        }
      }
      // console.log("지금은 어디인가요 ", currentX);

      //옆으로 가자
      // 옆으로 이동
      let line = columnsWithHorizontalLines[lineIndex][nowpos];
      if (line.toColumn !== undefined && line.toColumn !== lineIndex) {
        currentX += columnWidth; // 오른쪽으로 이동
        lineIndex = line.toColumn;
      } else if (
        line.fromColumn !== undefined &&
        line.fromColumn !== lineIndex
      ) {
        currentX -= columnWidth; // 왼쪽으로 이동
        lineIndex = line.fromColumn;
      }

      sequence.push(
        Animated.timing(positions[index].x, {
          toValue: currentX,
          duration: 300,
          useNativeDriver: true,
        }),
      );

      let lastidx = columnsWithHorizontalLines[lineIndex].length - 1;

      if (
        currentY === columnsWithHorizontalLines[lineIndex][lastidx].yPosition
      ) {
        sequence.push(
          Animated.timing(positions[index].y, {
            toValue: ladderHeight + 50,
            duration: (500 - currentY) * 1,
            useNativeDriver: true,
          }),
        );
        currentY = 9999;
        break;
      }
    }
    setFinalIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = lineIndex;
      return newIndexes;
    });

    Animated.sequence(sequence).start();
  };
  //한번에 다 움직임
  const moveAllImages = () => {
    for (let i = 0; i < cnt; i++) {
      moveImage(i);
    }
  };

  const renderHorizontalLine = (index) => {
    const lines = horizontalLines.filter(
      (line) => line.fromColumn === index || line.toColumn === index,
    );

    return lines.map((line, lineIndex) => (
      <View
        key={`line-${index}-${lineIndex}`}
        style={{
          position: "absolute",
          width: columnWidth,
          height: 7,
          backgroundColor: "#A86250",
          left: line.fromColumn === index ? columnWidth / 2 : -columnWidth / 2,
          top: line.yPosition + 27,
          zIndex: 0,
        }}
      />
    ));
  };

  const sendNoti = async () => {
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    const token = await AsyncStorage.getItem("UserServerAccessToken");
    const chatroomId = await AsyncStorage.getItem("chatroomId");
    const response = await fetch(SERVER_ADDRESS + "/ladder", {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
  };

  const sendResultLadder = () => {
    console.log("결과전송");
    let results = [];
    const now = new Date();
    now.setHours(now.getHours() + 9); // 현재 시간에 9시간을 더함
    finalIndexes.map((finalIndex, i) => {
      // 유효한 결과를 확인하고, 해당하는 텍스트를 표시
      const resultText =
        finalIndex !== null && userTexts[finalIndex]
          ? userTexts[finalIndex]
          : "No result";
      results.push(`${name[i]} ----> ${resultText}`);
    });

    const separator = "\n";

    // 결과 문자열 생성
    const resultString = "⚡사다리 게임결과⚡\n" + results.join(separator);

    const messageData = {
      type: "TALK",
      roomId: roomNumber,
      sender: myName, // 적절한 멤버 ID 설정
      content: resultString.toString(),
      time: now.toISOString(),
    };

    stompClient.publish({
      destination: "/pub/chat",
      body: JSON.stringify(messageData),
    });
    sendNoti();
  };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 50,
        }}
      >
        {positions.map((position, i) => (
          <View
            key={`player-${i}`}
            style={{
              position: "relative",
              width: columnWidth,
              alignItems: "center",
            }}
          >
            {renderHorizontalLine(i)}
            <View
              style={{
                position: "absolute",
                width: 7,
                height: ladderHeight,
                backgroundColor: "#A86250",
                left: columnWidth / 2 - 5,
                top: 90,
                zIndex: 0,
              }}
            />

            <TouchableOpacity
              onPress={() => moveImage(i)}
              style={{ position: "absolute", zIndex: 100 }}
            >
              <Animated.View
                style={{
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                  ],
                  zIndex: 100,
                }}
              >
                <Image
                  source={findImageByName(name[i])}
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: "contain",
                    margin: 5,
                    zIndex: 100,
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
            <TextInput
              style={{
                position: "absolute",
                top: ladderHeight + 130,
                left: columnWidth / 2 - 15,
                color: "black",
                width: 100,
                height: 40,
                borderColor: "black",
                borderWidth: 0,
                fontWeight: "bold",
                fontSize: 20,
              }}
              onChangeText={(text) => handleUserTextChange(text, i)}
              value={userTexts[i]}
            />
          </View>
        ))}
      </View>

      {}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          top: "60%",
        }}
      >
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              openModal();
              sendResultLadder();
              handlePress();
            }}
          >
            <Text style={styles.btnText}>결과 보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      ></View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View>{renderModalContent()}</View>
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 10 }}>
              닫기
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {coverLadder && (
        <View style={styles.overlay}>
          <View style={styles.hiddenContent}>
            <View style={{ position: "absolute", top: "40%", right: "45%" }}>
              <TouchableOpacity onPress={()=>{moveAllImages();
              handlePress();}}>
                <Text
                  style={{ fontSize: 24, fontFamily: "dnf", color: "white" }}
                >
                  Start!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: "center",
    justifyContent: "center",
    top: "25%",
    backgroundColor: "#FFFDFD",
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 30,
    margin: 75,
    borderRadius: 30,
  },
  hiddenContent: {
    width: "90%",
    height: "60%",
    backgroundColor: "#B9AAD3",
    padding: 20,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
    bottom: "25%",
    backgroundColor: "rgba(0, 0, 0, 0)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#BF67BD",
    borderRadius: 50,
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    fontFamily: "dnf",
    fontSize: 24,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
  },
});

export default Sadari;
