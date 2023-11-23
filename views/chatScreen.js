import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import {Client} from '@stomp/stompjs';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder, TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const Xxx = () => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');

    const myName = "아빠";
    const createRoom = async () => {
        try {
            const formData = new FormData();
            formData.append('roomName', 'roomkk');
            formData.append('createAt', new Date().toISOString());

            const response = await fetch('http://43.202.241.133:8080/room', {
                method: 'POST', headers: {
                    // 'Content-Type': 'multipart/form-data'는 자동으로 설정됩니다.
                }, body: formData,
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
            brokerURL: 'ws://43.202.241.133:8080/ws',
            connectHeaders: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzQ5IiwiZXhwIjoxNzAwOTczMjEzfQ.IeHipzx60fWJRD2ZGs8SCKwpOjfSpN837Rjq2qrTli4'
            },
            onConnect: () => {
                console.log('Connected to the WebSocket server');
                client.subscribe('/sub/chat/room/343', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                });

            }, onStompError: (frame) => {
                console.error('Broker reported error:', frame.headers['message']);
                console.error('Additional details:', frame.body);
            },
        });
        const interval = setInterval(() => {
            if (!client.connected) {
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
    }, []);

    const sendMessage = () => {

        if (stompClient && message) {
            const messageData = {
                type: "TALK", roomId: "44", sender: "아빠", memberId: "23",        // 적절한 멤버 ID 설정
                content: message, time: new Date().toISOString()
            };
            const headerData = {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMyIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE3MDA4NzY4MjB9.-UP0pA8PUyJ2rNWLITJAfMf8YkBE7sFeZyzHqH9SNsY'
            }

            stompClient.publish({
                destination: '/pub/chat', headers: headerData, body: JSON.stringify(messageData)
            });

            setMessage('');
        }
    };

    return (<View style={{flex: 1, padding: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Room: {roomTitle}</Text>
        <Button title="Create Room" onPress={createRoom}/>

        <ScrollView style={{flex: 1}}>
            {messages.map((msg, index) => (<View
                key={index}
                style={{
                    alignSelf: msg.sender === myName ? 'flex-end' : 'flex-start', marginBottom: 10,
                }}>
                <Text>
                    {msg.sender}: {msg.content}
                </Text>
            </View>))}
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
    </View>);
};

export default Xxx;
