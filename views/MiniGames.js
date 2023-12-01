import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  View,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MiniGames({ navigation }) {
  // alienId 가져오기
  // const [db, setDb] = useState({});
  //
  // useEffect(() => {
  //     const viewDb = async () => {
  //         const info = await AsyncStorage.getItem("myDB")
  //         console.log(info);
  //         // setDb(info);
  //     };
  // }, []);

  const [stompClient, setStompClient] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [characterPosition, setCharacterPosition] = useState({
    x: 200,
    y: 200,
  });
  const [showButton, setShowButton] = useState({
    ladder: false,
    mole: false,
    roulette: false,
    door: false,
  });

  // console.log("받아온 좌표!!!!!: ", coordinates.x, coordinates.y);
  const SOME_THRESHOLD = 100;
  const joystickPosition = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: joystickPosition.x, dy: joystickPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // // 좌표 서버로 전송
        // if (stompClient && coordinates.x !== 0 && coordinates.y !== 0) {
        //   const headerData = {
        //     Authorization:
        //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzQ5IiwiZXhwIjoxNzAwOTczMjEzfQ.IeHipzx60fWJRD2ZGs8SCKwpOjfSpN837Rjq2qrTli4",
        //   };
        //   const sendData = {
        //     familyId: 356,
        //     x: joystickPosition.x,
        //     y: joystickPosition.y,
        //   };
        //   stompClient.publish({
        //     destination: "/pub/map",
        //     headers: headerData,
        //     body: JSON.stringify(sendData),
        //   });
        //   setCoordinates({ x: 0, y: 0 });
        // }
        Animated.spring(joystickPosition, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // useEffect(() => {
  // //   여기서 웹소켓 연결 및 이벤트 리스너 등록
    // const sokcet = new WebSocket("ws://43.202.241.133:8080/ws");
    // const client = new Client({
    //   brokerURL: "ws://43.202.241.133:8080/ws",
    //   connectHeaders: {
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzQ5IiwiZXhwIjoxNzAwOTczMjEzfQ.IeHipzx60fWJRD2ZGs8SCKwpOjfSpN837Rjq2qrTli4",
    //   },
    //   onConnect: () => {
    //     // console.log("👌🏻connect 성공: 웹소켓 서버 연결~~~~");
    //     // 이 땐 좌표 받아오는 거
    //     client.subscribe("/sub/map/356", (message) => {
    //       const receiveCoordinates = JSON.parse(message.body);
    //       // console.log(receiveCoordinates);
    //       setCoordinates((prevCoordinates) => ({
    //         x: Math.max(
    //           0,
    //           Math.min(
    //             prevCoordinates.x + receiveCoordinates.x,
    //             SCREEN_WIDTH - SCREEN_WIDTH * 0.12
    //           )
    //         ),
    //         y: Math.max(
    //           0,
    //           Math.min(
    //             prevCoordinates.y - receiveCoordinates.y,
    //             SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1
    //           )
    //         ),
    //       }));
    //       // console.log("💭받은 좌표", receiveCoordinates.x, receiveCoordinates.y);
    //     });
    //   },
    //   onStompError: (frame) => {
    //     console.error("Broker reported error:", frame.headers["message"]);
    //     console.error("Additional details:", frame.body);
    //   },
    // });

    // sokcet.onopen = () => {
    //   // console.log("🚀 WebSokcet open");
    //   setStompClient(client);
    // };
    //
    // sokcet.onerror = (error) => {
    //   // console.log("❌ sokcet error");
    // };
    //
    // sokcet.onclose = (event) => {
    //   // console.log("👋🏻 WebSokcet close");
    // };

    joystickPosition.addListener((position) => {
      // 조이스틱 움직임에 따라 캐릭터 위치 업데이트
      const deltaX = position.x * 0.1;
      const deltaY = -position.y * 0.1;
      // 캐릭터 위치 업데이트
      setCharacterPosition((prevPosition) => ({
        x: Math.max(
          0,
          Math.min(prevPosition.x + deltaX, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)
        ),
        y: Math.max(
          0,
          Math.min(prevPosition.y - deltaY, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)
        ),
      }));
    });

  //   const interval = setInterval(() => {
  //     if (!client.connected) {
  //       client.activate();
  //     }
  //   }, 1000); // 1초마다 연결 상태 체크
  //   setStompClient(client);
  //
  //   // 언마운트시 연결 해제
  //   return () => {
  //     clearInterval(interval);
  //     if (client) {
  //       client.deactivate();
  //     }
  //     sokcet.close();
  //     joystickPosition.removeAllListeners();
  //   };
  // }, []);

  // 게임 이미지 & 캐릭터 사이 거리 계산
  const calculateDistance = (pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
  };

  useLayoutEffect(() => {
    const gameImgPosition = {
      ladder: { x: SCREEN_WIDTH * 0.018, y: SCREEN_HEIGHT * 0.14 },
      mole: { x: SCREEN_WIDTH * 0.9, y: SCREEN_HEIGHT * 0.2 },
      roulette: { x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.6 },
      door: { x: SCREEN_WIDTH * 0.95, y: SCREEN_HEIGHT * 0.65 },
    };

    const updatedShowButton = {};

    Object.keys(gameImgPosition).forEach((button) => {
      const distance = calculateDistance(
        characterPosition,
        gameImgPosition[button]
      );
      updatedShowButton[button] = distance < SOME_THRESHOLD;
    });

    setShowButton(updatedShowButton);
  }, [characterPosition]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
      >
        <StatusBar style="light" />
        <View style={styles.doorForm}>
          <Image
            style={styles.door}
            source={require("../assets/img/close_door.png")}
          />
        </View>
        {showButton.door ? (
          <Animated.View style={styles.spaceshipForm}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("맵을 나가시겠습니까?", null, [
                  {
                    text: "취소",
                    style: "cancel",
                  },
                  {
                    text: "나가기",
                    onPress: () => {
                      navigation.navigate("Home");
                    },
                  },
                ]);
              }}
            >
              <LottieView
                style={styles.spaceship}
                source={require("../assets/json/open_door.json")}
                loop
                autoPlay
              />
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        <View style={styles.ladderForm}>
          <Image
            style={styles.ladder}
            source={require("../assets/img/ladder.png")}
          />
        </View>

        {showButton.ladder ? (
          <View style={styles.spaceshipForm}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Ladder");
              }}
            >
              <Image
                style={styles.ladder}
                source={require("../assets/img/ladder.png")}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.moleForm}>
          <Image
            style={styles.mole}
            source={require("../assets/img/mole.png")}
          />
        </View>

        {showButton.mole ? (
          <View style={styles.spaceshipForm}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Mole");
              }}
            >
              <Image
                style={styles.mole}
                source={require("../assets/img/mole.png")}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.joystickArea}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[joystickPosition.getLayout(), styles.joystick]}
          />
        </View>

        <Animated.View style={styles.rouletteForm}>
          <LottieView
            style={styles.roulette}
            source={require("../assets/json/roulette.json")}
            autoPlay
            loop
          />
        </Animated.View>

        {showButton.roulette ? (
          <View style={styles.spaceshipForm}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Roulette");
              }}
            >
              <LottieView
                style={styles.roulette}
                source={require("../assets/json/roulette.json")}
                autoPlay
                loop
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View
          style={{
            position: "absolute",
            left: characterPosition.x,
            top: characterPosition.y,
          }}
        >
          <Image
            style={styles.alien}
            source={require("../assets/img/alien.png")}
          />
        </View>

        {/*에일리언들*/}
        <View
          style={{
            position: "absolute",
            left: coordinates.x,
            top: coordinates.y,
          }}
        >
          <Image
            style={styles.alien}
            source={require("../assets/img/alien2.png")}
          />
        </View>

        <View style={{ position: "absolute", left: "20%", top: "20%" }}>
          <Image
            style={styles.alien}
            source={require("../assets/img/alien3.png")}
          />
        </View>
        <View style={{ position: "absolute", left: "70%", top: "35%" }}>
          <Image
            style={styles.alien}
            source={require("../assets/img/alien4.png")}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#000000",
  },
  ladderForm: {
    position: "absolute",
    left: -SCREEN_WIDTH * 0.018,
    top: SCREEN_HEIGHT * 0.1,
  },
  ladder: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.07,
    resizeMode: "contain",
  },
  moleForm: {
    position: "absolute",
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_HEIGHT * 0.2,
  },
  mole: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.08,
    resizeMode: "contain",
  },
  rouletteForm: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.3,
    bottom: SCREEN_HEIGHT * 0.3,
  },
  roulette: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.08,
    resizeMode: "contain",
  },
  doorForm: {
    position: "absolute",
    right: -SCREEN_WIDTH * 0.02,
    bottom: SCREEN_HEIGHT * 0.25,
  },
  door: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.17,
    opacity: 0.5,
    resizeMode: "contain",
  },
  spaceshipForm: {
    position: "absolute",
    right: "10%",
    bottom: "9%",
  },
  spaceship: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
    // backgroundColor: "rgba(255, 255, 255, 0)",
    // ...Platform.select({
    //     ios: {
    //         shadowColor: 'lightyellow', // 그림자 색상
    //         shadowOpacity: 1,
    //         shadowRadius: 2,
    //         shadowOffset: {width: 2, height: 2},
    //     },
    //     android: {
    //         elevation: 5,
    //     }
    // })
  },
  joystickArea: {
    position: "absolute",
    left: "15%",
    bottom: "17%",
  },
  joystick: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderRadius: (SCREEN_WIDTH * 0.13) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    // ...Platform.select({
    //     ios: {
    //         shadowColor: "rgb(250, 250, 250)", // 그림자 색상
    //         shadowOpacity: 1,
    //         shadowRadius: 6,
    //         shadowOffset: {width: 3, height: 3},
    //     },
    //     android: {
    //         elevation: 5,
    //     },
    // })
  },
  alien: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.08,
    resizeMode: "contain",
  },
});
