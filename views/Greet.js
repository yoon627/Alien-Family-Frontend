import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";

const Greet = ({ navigation }) => {
  const [userName, setUserName] = useState("이종윤");
  const [isGreetAnimationEnd, setIsGreetAnimationEnd] = useState(false);
  const [isFirstAnimationEnd, setIsFirstAnimationEnd] = useState(false);
  const [isSecondAnimationEnd, setIsSecondAnimationEnd] = useState(false);
  let nameRef;
  let textRef;
  let textRef2;
  let textRef3;
  useEffect(() => {
    nameRef.fadeIn(500).then(() => {
      textRef.fadeIn(600).then(() => {
        textRef2.fadeIn(300).then(() => {
          textRef3.fadeIn(300);
        });
      });
    });
  }, []);
  const { width, height } = Dimensions.get("window");

  return (
    <ImageBackground
      source={require("../assets/img/pinkBtn.png")}
      style={styles.backgroundImage}
    >
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 30,
            flex: 0.5,
            width: 0.85 * width,
          }}
        >
          <View
            style={{
              marginTop: 35,
              flex: 0.9,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animatable.Text
              ref={(ref) => (nameRef = ref)}
              style={{ fontSize: 55, fontWeight: "bold" }}
            >
              {userName}님
            </Animatable.Text>
            <Animatable.Text
              ref={(ref) => (textRef = ref)}
              style={{
                fontSize: 55,
                fontWeight: "bold",
                opacity: isGreetAnimationEnd ? 1 : 0, // 투명도 설정
              }}
            >
              반가워요!
            </Animatable.Text>
            <Text />
            <Animatable.View
              ref={(ref) => (textRef2 = ref)}
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                opacity: isFirstAnimationEnd ? 1 : 0, // 투명도 설정
                marginBottom: 0,
              }}
            >
              <Text style={{ fontSize: 20 }}>초대코드가 있으신가요?</Text>
            </Animatable.View>
          </View>
          <Animatable.View
            ref={(ref) => (textRef3 = ref)}
            style={{
              marginTop: 0,
              justifyContent: "center",
              opacity: isSecondAnimationEnd ? 1 : 0, // 투명도 설정
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 50,
                  marginHorizontal: 20,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  source={require("../assets/img/pinkBtn.png")}
                  style={{
                    borderRadius: 20, // Apply borderRadius to ImageBackground
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      navigation.navigate("Invitation");
                    }}
                    style={{
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      네!
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
              <View
                style={{
                  width: 90,
                  height: 50,
                  marginHorizontal: 20,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  source={require("../assets/img/grayBtn.png")}
                  style={{
                    borderRadius: 20, // Apply borderRadius to ImageBackground
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ClickBox")}
                    style={{
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      아니오?
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </Animatable.View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default Greet;
