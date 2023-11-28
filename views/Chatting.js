import React, { useEffect, useRef, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          "http://" + `${myIP}` + ":12345/chat/list?id=" + chatroomId,
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
        const test = await AsyncStorage.getItem("MyName");
        const token = await AsyncStorage.getItem("UserServerAccessToken");
        const familyId = await AsyncStorage.getItem("familyId");
        const chatroomId = await AsyncStorage.getItem("chatroomId");

        setMyname(test);
        setroomNumber(chatroomId);

        const client = new Client({
          brokerURL: "ws://" + `${myIP}` + ":12345/ws",
          connectHeaders: {
            Authorization: token,
          },
          onConnect: () => {
            // console.log('Connected to the WebSocket server');
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
        stompClient.subscribe("/sub/chat/room/" + chatroomId, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          scrollViewRef.current?.scrollToEnd({ animated: true }); // 여기에 스크롤 로직 추가
        });
      };
    }
  }, [stompClient]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.sender === myname ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <Text>
              {msg.sender}: {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            flex: 1,
            marginRight: 10,
          }}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatRoom;
