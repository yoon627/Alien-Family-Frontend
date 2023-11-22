import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const MoveXY = () => {
  const startValue = useRef(new Animated.ValueXY(0, 0)).current;
  const endValue = 150;
  const duration = 5000;
  useEffect(() => {
    Animated.timing(startValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [startValue]);
  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
        <TouchableOpacity
          onPress={async () => {
            const t = await AsyncStorage.getItem("아들");
            if (t) {
              console.log(t);
            } else {
              console.log("error");
            }
          }}
          style={{ backgroundColor: "black", borderRadius: 50 }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 30,
              marginVertical: 20,
            }}
          >
            테스트
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.square,
          {
            transform: [
              {
                translateX: startValue.x,
              },
              { translateY: startValue.y },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    height: 50,
    width: 50,
    backgroundColor: "blue",
  },
});

export default MoveXY;
