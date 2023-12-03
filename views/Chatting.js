import React, { useEffect, useRef, useState } from "react";
import {
  Image,
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

const TextEncodingPolyfill = require("text-encoding");

Object.assign("global", {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoom = () => {
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myname, setMyname] = useState(null);
  const [roomNumber, setroomNumber] = useState(null);
  const scrollViewRef = useRef(); // ScrollView 참조 생성

  const myIP = "43.202.241.133";
  // const myIP = '13.209.81.119';

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const chatroomId = await AsyncStorage.getItem("chatroomId");

        const response = await fetch(
          "http://" + `${myIP}` + ":1998/chat/list?id=" + chatroomId,
          {
            method: "get",
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Response not ok");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error getMsg:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const connection = async () => {
      try {
        const name = await AsyncStorage.getItem("nickname");
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const familyId = await AsyncStorage.getItem("familyId");
        const chatroomId = await AsyncStorage.getItem("chatroomId");

        setMyname(name);
        setroomNumber(chatroomId);

        const client = new Client({
          brokerURL: "ws://" + `${myIP}` + ":1998/ws",
          connectHeaders: {
            Authorization: token,
          },
          onConnect: () => {
            console.log("Connected to the WebSocket server");
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
    if (stompClient && message) {
      const messageData = {
        type: "TALK",
        roomId: roomNumber,
        sender: myname, // 적절한 멤버 ID 설정
        content: message,
        time: new Date().toISOString(),
      };
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1, marginLeft: 10 }} ref={scrollViewRef}>
        {messages.map((msg, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                marginBottom: 4,
              }}
            >
              {msg.sender !== myname && (
                <Image
                  source={require("../assets/img/profile.jpg")}
                  style={styles.profilePic}
                />
              )}
              <View style={{ flex: 1 }}>
                {msg.sender !== myname && (
                  <Text style={styles.senderName}>{msg.sender}</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === myname
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.content}</Text>
                </View>
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
    backgroundColor: "#bc1fe6",
    marginRight: 8,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#3c3434",
    marginLeft: 8,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 2,
  },
  senderName: {
    color: "#100f0f",
    fontSize: 15,
    marginLeft: 10,
  },
  messageText: {
    fontFamily: "dnf",
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
    backgroundColor: "#cd0beb", // 원하는 색상으로 변경하세요
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 60, // 이미지 크기 조절
    height: 60, // 이미지 크기 조절
    borderRadius: 20, // 원형으로 만들기
    marginRight: 10, // 메시지 버블과의 간격
  },
});
export default ChatRoom;
