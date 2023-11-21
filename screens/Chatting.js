import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import {Client} from '@stomp/stompjs';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoom = () => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');

    const createRoom = async () => {
        try {
            const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
            const formData = new FormData();
            formData.append('roomName', 'json');

            const response = await fetch(SERVER_ADDRESS+'/room', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data'는 자동으로 설정됩니다.
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Response not ok');
            }

            const data = await response.json();
            console.log('Room created:', data);

            // 서버 응답에서 roomName을 추출하여 채팅방 제목으로 설정
            setRoomTitle(data.roomName);

        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    useEffect(() => {
        const client = new Client({
          //todo
            brokerURL: 'ws:/3.35.234.254:8080/ws',
            onConnect: () => {
                console.log('Connected to the WebSocket server');

                client.subscribe('/sub/chat/room/1', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error:', frame.headers['message']);
                console.error('Additional details:', frame.body);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    const sendMessage = () => {

        if (stompClient && message) {
            const messageData = {
                type: "TALK",
                roomId: "1",
                sender: "아빠",
                memberId: "", // 적절한 멤버 ID 설정
                content: message,
                time: new Date().toISOString()
            };

            stompClient.publish({
                destination: '/pub/chat',
                body: JSON.stringify(messageData)
            });

            setMessage('');
        }
    };

    return (
        <View style={{flex: 1, padding: 20}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Room: {roomTitle}</Text>
            <Button title="Create Room" onPress={createRoom}/>
            <ScrollView style={{flex: 1}}>
                {messages.map((msg, index) => (
                    <Text key={index} style={{marginBottom: 10}}>
                        {msg.sender}: {msg.content}
                    </Text>
                ))}
            </ScrollView>
            <View style={{flexDirection: 'row', marginTop: 10}}>
                <TextInput
                    style={{borderWidth: 1, borderColor: 'gray', flex: 1, marginRight: 10}}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage}/>
            </View>
        </View>
    );
};

export default ChatRoom;