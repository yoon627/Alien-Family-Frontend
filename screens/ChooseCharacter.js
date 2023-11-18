import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SERVER_ADDRESS = "43.200.3.232:8080";

const ChooseCharacter = ({ navigation }) => {
  const [AlienType, setAlienType] = useState(0);
  const [AlienColor, setAlienColor] = useState("red");
  const Characters = [1, 2, 3, 4];

  const ChooseType = (event) => {
    const { width } = Dimensions.get("window");
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / width);
    // console.log(page)
    setAlienType(page + 1);
  };
  const ChooseColor = (event) => {
    const { width } = Dimensions.get("window");
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / width);
    // console.log(page)
    setAlienColor(page + 1);
  };
  const color1 = () => {
    setAlienColor("red");
  };
  const color2 = () => {
    setAlienColor("blue");
  };
  const color3 = () => {
    setAlienColor("green");
  };
  const color4 = () => {
    setAlienColor("black");
  };
  return (
    <View style={styles.container}>
      <ScrollView
        indicatorStyle="black"
        pagingEnabled
        horizontal
        onScroll={ChooseType}
        showsHorizontalScrollIndicator={false}
      >
        {Characters.map((Character, index) => (
          <View key={index} style={styles.character}>
            <Text style={{...styles.characterFont,color:AlienColor}}>{Character}</Text>
          </View>
        ))}
      </ScrollView>
      {/* <ScrollView
        indicatorStyle="black"
        pagingEnabled
        horizontal
        onScroll={ChooseColor}
      >
        {Characters.map((Character, index) => (
          <View key={index} style={styles.character}>
            <Text style={styles.characterFont}>{Character}</Text>
          </View>
        ))}
      </ScrollView>       */}
      <View style={styles.buttongroup}>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "red" }}
          onPress={color1}
        >
          <Text style={styles.colortxt}>RED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "blue" }}
          onPress={color2}
        >
          <Text style={styles.colortxt}>BLUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "green" }}
          onPress={color3}
        >
          <Text style={styles.colortxt}>GREEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.colorbtn, backgroundColor: "black" }}
          onPress={color4}
        >
          <Text style={styles.colortxt}>BLACK</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Invitation"
        onPress={() => {
          console.log(AlienType);
          navigation.navigate("Invitation");
        }}
      />
      {/* <Button
          title="Invitation"
          onPress={async() => 
                (await axios({
                  method:'POST',
                  url:"http://" + SERVER_ADDRESS + "/api/register/alien",
                  headers:{
                    Authorization: `Bearer: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiQVVUSE9SSVRJRVNfS0VZIjoiUk9MRV9HVUVTVCIsImV4cCI6MTcwMDMxMjI2MH0.0JVHZpy_69t4-OXNPX65anTE7znhgMBEW5dZi5Pw0OM`
                  },
                  data:{
                    "AlienColor":AlienColor,
                    "AlienType":AlienType,
                  }
                })
      .then((resp) => {
        navigation.navigate("Invitation")
      })
      .catch(function (error) {
        console.log("server error", error);
      }))}
        /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  character: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  characterFont: {
    fontSize: 500,
  },
  buttongroup: {
    flexDirection: "row",
  },
  colorbtn: {
    paddingHorizontal: 20,
  },
  colortxt: {
    color: "white",
  },
});

export default ChooseCharacter;
