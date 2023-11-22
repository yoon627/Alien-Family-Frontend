import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import {Client} from '@stomp/stompjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder, TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoom = () => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [myname, setMyname] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const test = await AsyncStorage.getItem("MyName");
                setMyname(test);
            } catch (error) {
                console.log("null");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://43.202.241.133:8080/ws', connectHeaders: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzQ5IiwiZXhwIjoxNzAwOTczMjEzfQ.IeHipzx60fWJRD2ZGs8SCKwpOjfSpN837Rjq2qrTli4'
            }, onConnect: () => {
                console.log('Connected to the WebSocket server');
                client.subscribe('/sub/chat/room/348', (message) => {
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
                console.log("연결시도중");
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
                type: "TALK", roomId: "348", sender: myname, memberId: "23",        // 적절한 멤버 ID 설정
                content: message, time: new Date().toISOString()
            };
            const headerData = {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZmFtaWx5IjoiMzQ5IiwiZXhwIjoxNzAwOTczMjEzfQ.IeHipzx60fWJRD2ZGs8SCKwpOjfSpN837Rjq2qrTli4'
            }

            stompClient.publish({
                destination: '/pub/chat', headers: headerData, body: JSON.stringify(messageData)
            });

            setMessage('');
        }
    };

    return (<View style={{flex: 1, padding: 20}}>

        <ScrollView style={{flex: 1}}>
            {messages.map((msg, index) => (<View
                key={index}
                style={{
                    alignSelf: msg.sender === myname ? 'flex-end' : 'flex-start', marginBottom: 10,
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

export default ChatRoom;
