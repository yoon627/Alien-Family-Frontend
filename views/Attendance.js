import React from "react";
import { View, Text, StyleSheet,TouchableOpacity } from "react-native";


// async function fetchData() {
//   const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
//   const UserServerAccessToken = await AsyncStorage.getItem(
//     "UserServerAccessToken"
//   );
//   await axios({
//     method: "GET",
//     url: SERVER_ADDRESS + "/familyTmi",

//     headers: {
//       Authorization: "Bearer: " + UserServerAccessToken,
//     },
//   })
//     .then((resp) => {
//       const tmis = resp.data;
//       var mytmi = "";
//       for (i = 0; i < tmis.length; i++) {
//         mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
//       }
//       setTodayTMI(mytmi);
//     })
//     .catch((e) => console.log(e));
// }
export default function Attendance({ navigation }) {
  // useEffect(()=>{
  //   fetchData();
  // },[])
  return (
    <View style={styles.container}>
      <Text>Attendance</Text>
      <TouchableOpacity
              onPress={() => {
                const today = (new Date()).toString().slice(1,11);
                console.log(typeof(today));
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
