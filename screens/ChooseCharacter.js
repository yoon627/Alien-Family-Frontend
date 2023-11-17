import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ChooseCharacter = ({ navigation }) => {
  const Characters = [1, 2, 3, 4, 5];
  return (
    <View style={styles.container}>
      <ScrollView indicatorStyle="black" pagingEnabled horizontal>
        {Characters.map((Character,index) => (
        <View key={index} style={styles.character}>
          <Text style={styles.characterFont}>{Character}</Text>
        </View>
        ))}
      </ScrollView>
      <Button
          title="Invitation"
          onPress={() => navigation.navigate("Invitation")}
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
  loginText: {
    fontSize: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
  character:{
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  characterFont:{
    fontSize: 500,
  }
});

export default ChooseCharacter;
