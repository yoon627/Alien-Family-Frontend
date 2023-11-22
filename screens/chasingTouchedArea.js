import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: blue;
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function Lab({ navigation }) {
  const POSITION = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH / 2 - 25,
      y: SCREEN_HEIGHT / 2 + 150,
    })
  ).current;

  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    Animated.timing(POSITION, {
      toValue: { x: locationX - 25, y: locationY - 25 },
      useNativeDriver: true,
    }).start();
  };

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={handlePress}
          style={{ backgroundColor: "transparent" }}
          activeOpacity={1}
        >
          <AnimatedBox
            style={{
              // X,Y 좌표를 각각 이동할 수 있게 설정하는 것
              transform: [
                { translateX: POSITION.x },
                { translateY: POSITION.y },
              ],

              // 이 함수를 이용하면 위의 X,Y 좌표를 받오므로 아래와 같이 한번에 작성가능함
              transform: [...POSITION.getTranslateTransform()],
            }}
          ></AnimatedBox>
          <View
            style={{
              padding: 20,
              backgroundColor: "tranparent",
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            }}
          ></View>
        </TouchableOpacity>
      </View>
      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <TouchableOpacity
            onPress={async () =>
              console.log(await AsyncStorage.getItem("UserServerAccessToken"))
            }
            style={{ backgroundColor: "black", borderRadius: 50 }}
          >
            <Text
              style={{
                color: "white",
                marginHorizontal: 30,
                marginVertical: 20,
              }}
            >
              TEST
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
