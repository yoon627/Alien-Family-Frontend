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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Home({ navigation }) {

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      </View>
      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
      >
        <Button
          title="Mini Games"
          onPress={() => navigation.navigate("Mini Games")}
        />
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
