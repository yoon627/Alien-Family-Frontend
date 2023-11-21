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
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Home({ navigation }) {
  const movingObject = () => {
    const movingValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(movingValue, {
            toValue: 100,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            toValue: -100,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const interpolated = movingValue.interpolate({
      inputRange: [-1, 1],
      outputRange: [-1, 1],
    });

    return (
      <Animated.View style={{ transform: [{ translateX: interpolated }] }}>
        <TouchableOpacity onPress={() => navigation.navigate("Mini Games")}>
          <FontAwesome5 name="ghost" size={75} color="black" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Container>
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></View>
      <View style={styles.centeredView}>{movingObject()}</View>
      <MaterialCommunityIcons name="sprout" size={100} color="black" />
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
            style={{ color: "white", marginHorizontal: 30, marginVertical: 20 }}
          >
            TEST
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 20}}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Attendance")}
          style={{ backgroundColor: "black", borderRadius: 50 }}
        >
          <Text
            style={{ color: "white", marginHorizontal: 30, marginVertical: 20 }}
          >
            출첵
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
