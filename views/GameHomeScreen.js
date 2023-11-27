import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
      }}
    >
      <Text>Home Screen</Text>
      <View style={styles.buttonContainer}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.text}>홈화면</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Ladder")}
          >
            <Text style={styles.text}>사다리</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Roulette")}
          >
            <Text style={styles.text}>룰렛</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("NewGame")}
          >
            <Text style={styles.text}>새거</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Chat")}
          >
            <Text style={styles.text}>채팅하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  button: {
    backgroundColor: "#264b62", // 버튼 색상
    paddingVertical: 20, // 세로 패딩
    paddingHorizontal: 20, // 가로 패딩
    borderRadius: 5, // 테두리 둥글게
    alignItems: "center",
    marginVertical: 5, // 버튼 간의 수직 마진
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 20,
    width: (windowWidth - 50) / 5,
  },

  text: {
    color: "white", // 텍스트 색상
    fontSize: 20, // 텍스트 크기
  },
});

export default HomeScreen;
