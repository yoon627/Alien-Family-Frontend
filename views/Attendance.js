import React from "react";
import { View, Text, StyleSheet } from "react-native";

async function fetchData() {
  const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
  const UserServerAccessToken = await AsyncStorage.getItem(
    "UserServerAccessToken"
  );
  const familyId = await AsyncStorage.getItem("familyId");
  await axios({
    method: "GET",
    url: SERVER_ADDRESS + "/familyTmi",

    headers: {
      Authorization: "Bearer: " + UserServerAccessToken,
    },
  })
    .then((resp) => {
      const tmis = resp.data;
      var mytmi = "";
      for (i = 0; i < tmis.length; i++) {
        mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
      }
      setTodayTMI(mytmi);
    })
    .catch((e) => console.log(e));
}

export default function Attendance({ navigation }) {
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <View style={styles.container}>
      <Text>Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
