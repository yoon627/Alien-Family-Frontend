import React, {useEffect, useState} from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet, Image,
} from "react-native";
import * as Calendar from "expo-calendar";
import {Checkbox} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MaterialCommunityIcons, Octicons} from '@expo/vector-icons';

export default function ChoseCalendar({closeModal, closeAddModal}) {
    const [events, setEvents] = useState([]);
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendars, setSelectedCalendars] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [isEventsModalVisible, setIsEventsModalVisible] = useState(false);
    const [isChoiceEvent, setChoiceEvent] = useState(false);

    const setCalendarsModal = () => {
        setIsModalVisible((prevState) => !prevState);
    };
    const setEventsModal = () => {
        setIsEventsModalVisible((prevState) => !prevState);
    };

    const setCloseModal = () => {
        setIsModalVisible(true);
        setIsEventsModalVisible((prevState) => !prevState);
    };

    useEffect(() => {
        (async () => {
            const {status} = await Calendar.requestCalendarPermissionsAsync();
            if (status === "granted") {
                const calendars = await Calendar.getCalendarsAsync(
                    Calendar.EntityTypes.EVENT,
                );
                setCalendars(
                    calendars.map((calendar) => ({...calendar, selected: false})),
                );
            }
        })();
    }, []);

    function getDatesInRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        while (start <= end) {
            dates.push(formatYYYYMMDD(start));
            start.setDate(start.getDate() + 1);
        }

        return dates;
    }

    function formatYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const handleImportEvents = async () => {
        if (selectedEvents.length > 0) {
            for (const i of selectedEvents) {
                const payload = {
                    eventName: i.title,
                    startDate: new Date(i.startDate),
                    endDate: new Date(i.endDate),
                };
                //시차적용
                payload.startDate.setHours(payload.startDate.getHours() + 9);
                payload.endDate.setHours(payload.endDate.getHours() + 9);

                try {
                    const token = await AsyncStorage.getItem("UserServerAccessToken");
                    const response = await fetch(
                        "http://43.202.241.133:1998/calendarEvent",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload),
                        },
                    );

                    if (!response.ok) {
                        throw new Error("HTTP error! status: " + response.status);
                    } else if (response.ok) {
                        // console.log("성공!!");
                        closeModal(false);
                        closeAddModal(false);
                        alert("업로드 완료!");
                    }
                } catch (error) {
                    console.error("There was an error creating the event:", error);
                }
            }
        }
    };
    const toggleEventSelection = (id) => {
        const updatedEvents = events.map((event) => {
            if (event.id === id) {
                return {...event, selected: !event.selected};
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    const handleConfirmSelection = () => {
        setSelectedEvents(events.filter((event) => event.selected));
        setEventsModal(false);
        setChoiceEvent(true);
    };

    const fetchCalendarEvents = async (calendarId) => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 13); // 한 달 간의 이벤트

        const calendarEvents = await Calendar.getEventsAsync(
            [calendarId],
            startDate,
            endDate,
        );

        setEvents(calendarEvents);
        setCalendarsModal();
        setEventsModal();
    };

    return (
        <View
            style={{flex: 1}}
        >
            <View style={{flexDirection: "row", alignItems: "center",}}>
                <MaterialCommunityIcons name="calendar-check-outline" size={36} color="#555456"/>
                <TouchableOpacity
                    onPress={setCalendarsModal}>
                    <Text style={{fontSize: 30, fontWeight: "bold", paddingLeft: 7, color: "#555456"}}>캘린더</Text>
                </TouchableOpacity>

            </View>
            {isModalVisible &&
                <ScrollView>
                    <View
                        style={{
                            marginTop: "5%",
                            backgroundColor: "white",
                        }}
                    >
                        {calendars.map((calendar) => (
                            <TouchableOpacity
                                key={calendar.id}
                                onPress={() => fetchCalendarEvents(calendar.id)}
                                style={styles.event}
                            >
                                <Text style={{fontSize: 18,}}>
                                    ▪️ {calendar.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            }
            {isEventsModalVisible &&
                <ScrollView>
                    <View
                        style={{
                            marginTop: "5%",
                            marginHorizontal: 20,
                            backgroundColor: "white",
                        }}
                    >
                        {events.map((event, index) => (
                            <View
                                key={`${event.id}-${index}`}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    margin: 10,
                                }}
                            >
                                <Checkbox
                                    status={event.selected ? "checked" : "unchecked"}
                                    onPress={() => toggleEventSelection(event.id)}
                                />
                                <Text style={{fontSize: 18, color: "#555456"}}>{event.title}</Text>
                            </View>
                        ))}
                        <View style={{flexDirection: "row", marginVertical: 15}}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonWrite]}
                                onPress={handleConfirmSelection}
                            >
                                <Text style={{...styles.textStyle, color: "#fff"}}>추가</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={setCloseModal}
                            >
                                <Text style={{...styles.textStyle, color: "#555456"}}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }

            <View style={styles.line}/>

            {isChoiceEvent &&
                <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 24, marginVertical: 10, color: "#555456"}}>선택한 이벤트</Text>
                    {selectedEvents.map((event) => (
                        <ScrollView>
                            <View style={{flexDirection: "row", alignItems: "center", margin: 5, paddingLeft: 15,}}>
                                <Image
                                    source={require('../assets/img/circle.png')}
                                    style={{width: 8, height: 10, resizeMode: "contain",}}
                                />
                                <Text
                                    key={event.id}
                                    style={{fontSize: 20, paddingLeft: 10, color: "#555456"}}
                                >
                                    {event.title}
                                </Text>
                            </View>
                        </ScrollView>
                    ))}
                    <TouchableOpacity
                        style={{position: "absolute", right: 30, bottom: 5,}}
                        onPress={handleImportEvents}
                    >
                        <Octicons
                            name="check-circle-fill"
                            size={45}
                            color="#B2B6DB"
                        />
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    event: {
        marginHorizontal: 5,
        marginVertical: 7,
        padding: 12,
        paddingVertical: 12,
        backgroundColor: "rgba(161, 161, 161, 0.15)",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    line: {
        borderColor: "#DBDBDB",
        borderWidth: 0.4,
        marginVertical: 20,
    },
    button: {
        width: 65,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        opacity: 0.9,
    },
    buttonWrite: {
        backgroundColor: "#B2B6DB",
        marginLeft: 15,
    },
    buttonClose: {
        backgroundColor: "#F0F2FF",
        marginLeft: 15,
    },
    textStyle: {
        textAlign: "center",
        fontFamily: "dnf",
    },
})
