import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AlienType from "../components/AlienType";
import axios from "axios";

const TextEncodingPolyfill = require("text-encoding");

Object.assign("global", {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ChatRoom = () => {
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myName, setMyName] = useState(null);
  const [roomNumber, setRoomNumber] = useState(null);
  const scrollViewRef = useRef(); // ScrollView 참조 생성

  const myIP = "43.202.241.133";

  useEffect(() => {
    const getData = async () => {
      try {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const chatroomId = await AsyncStorage.getItem("chatroomId");
        const response = await fetch(
          SERVER_ADDRESS + "/chat/list?id=" + chatroomId,
          {
            method: "get",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Response not ok");
        }
        const data = await response.json();
        setMessages(data);
        scrollViewRef.current?.scrollToEnd({animated: true});
        // console.log("챗룸 아디", chatroomId);
        // console.log("가져온 채팅내역", data);
      } catch (error) {
        console.error("Error getMsg:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const connection = async () => {
      try {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const name = await AsyncStorage.getItem("nickname");
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const familyId = await AsyncStorage.getItem("familyId");
        const chatroomId = await AsyncStorage.getItem("chatroomId");

        setMyName(name);
        setRoomNumber(chatroomId);
        // console.log(SERVER_ADDRESS.slice(7));
        const client = new Client({
          brokerURL: "ws://" + SERVER_ADDRESS.slice(7) + "/ws",
          connectHeaders: {
            Authorization: token,
          },
          onConnect: () => {
            // console.log("Connected to the WebSocket server");
            client.subscribe("/sub/chat/room/" + chatroomId, (message) => {
              const receivedMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
              scrollViewRef.current?.scrollToEnd({ animated: true }); // 여기에 스크롤 로직 추가
            });
          },
          onStompError: (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
          },
        });

        const interval = setInterval(() => {
          if (!client.connected) {
            // console.log("연결시도중");
            client.activate();
          }
        }, 1000); // 1초마다 연결 상태 체크
        setStompClient(client);
        return () => {
          clearInterval(interval);
          if (client) {
            client.deactivate();
          }
        };
      } catch (error) {
        console.log("Error :", error);
      }
    };

    connection();
  }, []);

  const sendMessage = () => {
    const now = new Date();
    now.setHours(now.getHours() + 9); // 현재 시간에 9시간을 더함
    // console.log(now);
    // const tmp = new Date();
    // const test =tmp.toISOString();
    // console.log(typeof(tmp));
    // console.log(tmp);
    // console.log(typeof(test));
    // console.log(test);
    if (stompClient && message) {
      const messageData = {
        type: "TALK",
        roomId: roomNumber,
        sender: myName, // 적절한 멤버 ID 설정
        content: message,
        time: now.toISOString(),
      };
      // console.log(typeof(formatTime(now.toISOString())));
      const headerData = {
        // Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNTIiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzU2IiwiZXhwIjoxNzAwOTgzOTE4fQ.EHLgXe4iFJrjr2veJlkZiHafd8tomybIyxty66xmU38'
      };
      stompClient.publish({
        destination: "/pub/chat",
        headers: headerData,
        body: JSON.stringify(messageData),
      });
      setMessage("");
    }
    const mission = async () => {
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      const ktc = new Date();
      ktc.setHours(ktc.getHours() + 9);
      const str_today = JSON.stringify(ktc).toString().slice(1, 11);
      const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
      const todayMissions = [
        "사진 찍어서 올리기",
        "내 갤러리 사진 등록하기",
        "사진에 댓글 달기",
        "가족들과 채팅으로 인사하기",
        "캘린더에 일정 등록하기",
      ];
      if (test) {
        if (test && typeof test === "object" && str_today in test) {
          if (test[str_today] === "가족들과 채팅으로 인사하기") {
            await AsyncStorage.setItem("todayMissionClear", "true");
            await axios({
              method: "GET",
              url: "http://43.202.241.133:1998/mission",
              headers: {
                Authorization: "Bearer " + UserServerAccessToken,
              },
            })
              .then((resp) => console.log(resp))
              .catch((e) => console.log(e));
          }
        } else {
          const randomIndex = Math.floor(Math.random() * todayMissions.length);
          await AsyncStorage.setItem(
            "todayMission",
            JSON.stringify({ [str_today]: todayMissions[randomIndex] })
          );
          if (test[str_today] === "가족들과 채팅으로 인사하기") {
            await AsyncStorage.setItem("todayMissionClear", "true");
            await AsyncStorage.setItem("dailyMissionClear", "false");
            await axios({
              method: "GET",
              url: "http://43.202.241.133:1998/mission",
              headers: {
                Authorization: "Bearer " + UserServerAccessToken,
              },
            })
              .then((resp) => console.log(resp))
              .catch((e) => console.log(e));
          } else {
            await AsyncStorage.setItem("todayMissionClear", "false");
            await AsyncStorage.setItem("dailyMissionClear", "false");
          }
        }
      } else {
        const randomIndex = Math.floor(Math.random() * todayMissions.length);
        await AsyncStorage.setItem(
          "todayMission",
          JSON.stringify({ [str_today]: todayMissions[randomIndex] })
        );
        if (test[str_today] === "가족들과 채팅으로 인사하기") {
          await AsyncStorage.setItem("todayMissionClear", "true");
          await AsyncStorage.setItem("dailyMissionClear", "false");
          await axios({
            method: "GET",
            url: "http://43.202.241.133:1998/mission",
            headers: {
              Authorization: "Bearer " + UserServerAccessToken,
            },
          })
            .then((resp) => console.log(resp))
            .catch((e) => console.log(e));
        } else {
          await AsyncStorage.setItem("todayMissionClear", "false");
          await AsyncStorage.setItem("dailyMissionClear", "false");
        }
      }
    };
    mission();
  };

  useEffect(() => {
    if (stompClient) {
      stompClient.onConnect = () => {
        // ... 기존 로직
        stompClient.subscribe("/sub/chat/room/" + roomNumber, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          scrollViewRef.current?.scrollToEnd({ animated: true }); // 여기에 스크롤 로직 추가
        });
      };
    }
  }, [stompClient]);

  function formatTime(isoString) {
    try {
      let date = new Date(isoString);

      // 날짜가 유효하지 않은 경우 현재 시각으로 설정
      if (isNaN(date.getTime())) {
        date = new Date();
        date.setHours(date.getHours());
      }

      return (
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0")
      );
    } catch (error) {
      console.error("Date parsing error:", error);
      // 에러 발생시 현재 시각을 반환
      const now = new Date();
      now.setHours(now.getHours() + 9);
      return (
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0")
      );
    }
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, marginHorizontal: 5 }}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {messages.map((msg, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                marginBottom: 15,
              }}
            >
              {msg.sender !== myName && (
                <View style={{justifyContent: "center",}}>
                  <Text style={styles.senderName}>{msg.sender}</Text>
                  <AlienType writer={msg.sender} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === myName
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.content}</Text>
                </View>

                {msg.sender === myName && (
                  <Text style={styles.timeTextRight}>
                    {formatTime(msg.createAt)}
                  </Text>
                )}
                {msg.sender !== myName && (
                  <Text style={styles.timeTextLeft}>
                    {formatTime(msg.createAt)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: "75%",
    minWidth: "20%",
    borderRadius: 18,
    elevation: 1,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#603D9B",
    marginRight: 7,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#B9A9D3",
    marginLeft: 8,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 2,
  },
  senderName: {
    color: "#100f0f",
    fontSize: 14,
    marginVertical: 5,
    marginRight: 10,
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    color: "white",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 40, // 높이 조정
  },
  sendButton: {
    backgroundColor: "#603D9B",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1, // 이미지 크기 조절
    borderRadius: (SCREEN_WIDTH * 0.1) / 2, // 원형으로 만들기
    marginRight: 10, // 메시지 버블과의 간격,
    resizeMode: "contain",
    backgroundColor: "#FFEEC3",
  },
  timeTextRight: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end", // Align right for sent messages
    marginBottom: 2, // Adjust as needed
  },
  timeTextLeft: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-start", // Align left for received messages
    marginBottom: 2, // Adjust as needed
  },
});
export default ChatRoom;