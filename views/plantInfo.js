import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  View,
  StatusBar,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlantInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const [todayMission, setTodayMission] = useState("");

  useEffect(() => {
    // 타이머를 사용하여 5초마다 말풍선을 표시
    const interval = setInterval(() => {
      setIsVisible(true);
      // 3초 후에 말풍선을 숨김
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 2000);

    // 컴포넌트 언마운트 시에 타이머 클리어
    return () => clearInterval(interval);
  }, []);
  const [plantPoint, setPlantPoint] = useState(4);

  const renderFlower = () => {
    switch (plantPoint) {
      case 0:
        return (
          <Image
            source={require("../assets/img/level_0.png")}
            style={styles.plantImage}
          />
        );
      case 1:
        return (
          <Image
            source={require("../assets/img/level_1.png")}
            style={styles.plantImage}
          />
        );
      case 2:
        return (
          <Image
            source={require("../assets/img/level_2.png")}
            style={styles.plantImage}
          />
        );
      case 3:
        return (
          <Image
            source={require("../assets/img/level_3.png")}
            style={styles.plantImage}
          />
        );
      case 4:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plantImage}
          />
        );
      default:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plantImage}
          />
        );
    }
  };

  const renderChat = () => {
    const chatContainerStyles = [
      styles.plantSay0,
      styles.plantSay1,
      styles.plantSay2,
      styles.plantSay3,
      styles.plantSay4,
      styles.plantSay4, // fallback for default case
    ];
    const chatMessages = [
      "오늘 하루도 힘찬 시작이에요!",
      "새싹쿠키와 함께 행복한 하루 보내세요!",
      "물 좀 주세요~",
      "안녕하세요! 뭐 좀 얘기해주세요.",
      "새싹쿠키가 여러분을 응원합니다!",
    ];

    const randomMessage = () => {
      const randomIndex = Math.floor(Math.random() * chatMessages.length);
      return chatMessages[randomIndex];
    };
    return (
      <View style={chatContainerStyles[plantPoint]}>
        {isVisible && (
          <View
            style={{
              padding: 10,
              backgroundColor: "yellow",
              borderRadius: 5,
              zIndex: 1,
              alignItems: "center",
            }}
          >
            <Text>{randomMessage()}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderBonusMission = () => {
    const bonusMissions = [
      "보너스 미션 : 가족과 함께 저녁 식사하기",
      "보너스 미션 : 친구에게 전화 걸기",
      "보너스 미션 : 새로운 취미 시작해보기",
      "보너스 미션 : 근처 공원 산책 가기",
      "보너스 미션 : 독서 시간 갖기",
    ];

    const randomBonusMission = () => {
      // const ktc = new Date();
      // ktc.setHours(ktc.getHours() + 9);
      // const str_today = JSON.stringify(ktc).toString().slice(1, 11);
      const randomIndex = Math.floor(Math.random() * bonusMissions.length);
      return bonusMissions[randomIndex];
    };

    return (
      <View style={styles.bonusMissionContainer}>
        <Text style={{ ...styles.bonusMissionText, ...styles.missionText }}>
          {randomBonusMission()}
        </Text>
      </View>
    );
  };
  useEffect(() => {
    const getMission = async () => {
      const ktc = new Date();
      ktc.setHours(ktc.getHours() + 9);
      const str_today = JSON.stringify(ktc).toString().slice(1, 11);
      const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
      if (test) {
        console.log(test);
        if (test && typeof test === 'object' && str_today in test) {
          setTodayMission(test[str_today]);
        } else {
          const bonusMissions = [
            "보너스 미션 : 사진 찍어 올리기",
            "보너스 미션 : 내 갤러리 사진 등록하기",
            "보너스 미션 : 사진에 댓글달기",
            "보너스 미션 : 가족들과 채팅으로 인사하기",
            "보너스 미션 : 캘린더에 자기 일정 추가하기",
          ];
          const randomIndex = Math.floor(Math.random() * bonusMissions.length);
          setTodayMission(bonusMissions[randomIndex]);
          await AsyncStorage.setItem(
            "todayMission",
            JSON.stringify({ [str_today]: bonusMissions[randomIndex] })
          );
        }
      } else {
        const bonusMissions = [
          "보너스 미션 : 사진 찍어 올리기",
          "보너스 미션 : 내 갤러리 사진 등록하기",
          "보너스 미션 : 사진에 댓글달기",
          "보너스 미션 : 가족들과 채팅으로 인사하기",
          "보너스 미션 : 캘린더에 자기 일정 추가하기",
        ];
        const randomIndex = Math.floor(Math.random() * bonusMissions.length);
        setTodayMission(bonusMissions[randomIndex]);
        await AsyncStorage.setItem(
          "todayMission",
          JSON.stringify({ [str_today]: bonusMissions[randomIndex] })
        );
      }
    };
    getMission();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <View style={styles.missionContainer}>
          <Text style={styles.missionText}>일일 미션: TMI 작성하기</Text>
          <Text style={styles.missionText}>{todayMission}</Text>
        </View>
        <View style={styles.familyContainer}>
          <Text style={styles.familyText}>아빠: 1점</Text>
          <Text style={styles.familyText}>엄마: 2점</Text>
          <Text style={styles.familyText}>첫째: 3점</Text>
          <Text style={styles.familyText}>둘째: 4점</Text>
        </View>
      </View>
      <View style={{ flex: 2, backgroundColor: "orange" }}>
        <View>{renderChat()}</View>
        <View style={styles.plantContainer}>{renderFlower()}</View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30 }}>LV.1 새싹쿠키</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  plantContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // position: 'absolute',
    backgroundColor: "blue",
  },
  plantImage: {
    flex: 1,
    position: "absolute",
    width: SCREEN_WIDTH * 0.5, // Adjust the width as needed
    height: SCREEN_HEIGHT * 0.5, // Adjust the height as needed
    resizeMode: "contain",
    zIndex: 0,
    // bottom: 0,
    // backgroundColor: 'gray',
  },
  missionContainer: {
    alignItems: "center",
    backgroundColor: "cyan",
  },
  missionText: {
    fontSize: 20,
  },
  familyContainer: {
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: "green",
  },
  familyText: {
    fontSize: 20,
  },
  plantSay0: {
    marginTop: 200,
  },
  plantSay1: {
    marginTop: 150,
  },
  plantSay2: {
    marginTop: 100,
  },
  plantSay3: {
    marginTop: 50,
  },
  plantSay4: {
    marginTop: 0,
  },

  bonusMissionContainer: {
    marginTop: 20,
    alignItems: "center",
    // backgroundColor: 'purple',
    flexDirection: "row",
  },
  bonusMissionText: {
    fontSize: 20,
    // color: 'white',
  },
});
