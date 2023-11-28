import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Stomp } from "@stomp/stompjs";

const Randomkkkk = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const stomp = Stomp.client("ws://192.249.20.103:8080/ws");
    stomp.connect({}, () => setStompClient(stomp));

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  const handleMouseClick = (event) => {
    if (stompClient) {
      const { locationX, locationY } = event.nativeEvent;
      const coordinate = { x: locationX, y: locationY };
      stompClient.send("/app/click", {}, JSON.stringify(coordinate));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleMouseClick}
        style={{ flex: 1, backgroundColor: "lightgray" }}
      >
        {/* 게임 UI */}
      </TouchableOpacity>
    </View>
  );
};

export default Randomkkkk;
