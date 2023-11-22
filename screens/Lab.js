import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Lab() {
  return (
    <TouchableOpacity
      onPress={async () => {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const ServerAccessToken = await AsyncStorage.getItem(
          "ServerAccessToken"
        );
        await axios({
          method: "POST",
          url: SERVER_ADDRESS + "/api/register/newFamily",
          headers: {
            Authorization: "Bearer: " + ServerAccessToken,
          },
          data: {
            ufoName: "ㅇㅇㅇ",
            plantName: "ㅇㅇㅇ",
            code: "ABC",
          },
        })
          .then(async (resp) => {
            const UserServerAccessToken = resp.data.data.tokenInfo.accessToken;
            const UserServerRefreshToken =
              resp.data.data.tokenInfo.refreshToken;
            await AsyncStorage.setItem(
              "UserServerAccessToken",
              UserServerAccessToken
            );
            await AsyncStorage.setItem(
              "UserServerRefreshToken",
              UserServerRefreshToken
            );
            const familyid = resp.data.data;
            console.log(familyid);
            const members = resp.data.data.familyResponseDto.members;
            var myDB = {};
            for (i = 0; i < members.length; i++) {
              const newkey = members[i].memberId;
              console.log(members[i].memberId)
              myDB[newkey] = members[i];
            }
            await AsyncStorage.setItem("myDB", JSON.stringify(myDB));
          })
          .catch(function (error) {
            console.log("server error", error);
          });
        const test = await AsyncStorage.getItem("myDB");
        console.log(test);
      }}
      style={{
        backgroundColor: "black",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          marginHorizontal: 30,
          marginVertical: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        테스트
      </Text>
    </TouchableOpacity>
  );
}
// import { useEffect } from "react";
// import { useState } from "react";
// import { useRef } from "react";

// export default function Lab() {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const nextPageIdentifierRef = useRef();
//   const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

//   const fetchData = () => {
//     setIsLoading(true);
//     getDataFromApi(nextPageIdentifierRef.current).then((response) => {
//       const { data: newData, nextPageIdentifier } = parseResponse(response);
//       setData([...data, newData]);
//       nextPageIdentifierRef.current = nextPageIdentifier;
//       setIsLoading(false);
//       !isFirstPageReceived && setIsFirstPageReceived(true);
//     });
//   };

//   const fetchNextPage = () => {
//     if (nextPageIdentifierRef.current == null) {
//       // End of data.
//       return;
//     }
//     fetchData();
//   };

//   const getDataFromApi = () => {
//     // get the data from api
//     return Promise.resolve({ data: [1], nextPageIdentifier: "page-1" });
//   };
//   const parseResponse = (response) => {
//     let _data = response.data;
//     let nextPageIdentifier = response.nextPageIdentifier;
//     // parse response and return list and nextPage identifier.
//     return {
//       _data,
//       nextPageIdentifier,
//     };
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderItem = ({ item }) => {
//     return <Text>{item}</Text>;
//   };

//   const ListEndLoader = () => {
//     if (!isFirstPageReceived && isLoading) {
//       // Show loader at the end of list when fetching next page data.
//       return <ActivityIndicator size={"large"} />;
//     }
//   };

//   if (!isFirstPageReceived && isLoading) {
//     // Show loader when fetching first page data.
//     return <ActivityIndicator size={"small"} />;
//   }

//   return (
//     <FlatList
//       data={data}
//       renderItem={renderItem}
//       onEndReached={fetchNextPage}
//       onEndReachedThreshold={0.8}
//       ListFooterComponent={ListEndLoader} // Loader when loading next page.
//     />
//   );
// }
