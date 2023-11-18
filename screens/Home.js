import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  TextInput,
  PanResponder,
  Easing,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import styled from "styled-components/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Tab = createBottomTabNavigator();
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: blue;
  width: 50px;
  height: 50px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function Home({ navigation }) {
  const POSITION = useRef(
    new Animated.ValueXY({
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    })
  ).current;

  // 화면의 구석으로 이동시키는 각각의 애니메이션
  const topLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  
  // 여러 애니메이션을 sequnce로 연결해서 실행할 수 있다.
    const moveUp = () => {
    // loop를 쓰면 반복이 되고, sequnce안에 배열로 animation을 전달
    // start()를 써주어야 시작이 됨
    Animated.loop(
      Animated.sequence([bottomLeft, bottomRight, topRight, topLeft])
    ).start();
  };

  return (
    <Container>
      <Pressable
        style={{ borderWidth: 5, borderColor: "black" }}
        onPress={moveUp}
      >
        <AnimatedBox
          style={{
            // X,Y 좌표를 각각 이동할 수 있게 설정하는 것
            transform: [{ translateX: POSITION.x }, { translateY: POSITION.y }],

            // 이 함수를 이용하면 위의 X,Y 좌표를 받오므로 아래와 같이 한번에 작성가능함
            transform: [...POSITION.getTranslateTransform()],
          }}
        ></AnimatedBox>
      </Pressable>
      <Button
          title="Mini Games"
          onPress={() => navigation.navigate("Mini Games")}
        />      
    </Container>
  );
}
//   const startValue = useRef(new Animated.ValueXY(0, 0)).current;
//   const endValue = 100;
//   const duration = 10000;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(startValue, {
//         toValue: endValue,
//         duration: duration,
//         useNativeDriver: true,
//       }),
//       {iterations:-1},
//     ).start();
//   }, [startValue]);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.square,
//           {
//             transform: [
//               { translateX: startValue.x },
//               { translateY: startValue.y },
//             ],
//           },
//         ]}
//       />
//       <View style={styles.footer}>
//         <Button
//           title="Mini Games"
//           onPress={() => navigation.navigate("Mini Games")}
//         />
//       </View>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
  square: {
    height: 50,
    width: 50,
    backgroundColor: "blue",
    borderRadius: 50,
  },
});
