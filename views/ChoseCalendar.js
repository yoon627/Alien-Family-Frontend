import React, {useEffect, useState} from "react";
import {
  Button,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import * as Calendar from "expo-calendar";
import {Checkbox} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChoseCalendar({closeModal, closeAddModal}) {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEventsModalVisible, setIsEventsModalVisible] = useState(false);

  const setCalendarsModal = () => {
    setIsModalVisible((prevState) => !prevState);
  };
  const setEventsModal = () => {
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
      style={{flex: 1, justifyContent: "center", alignItems: "center"}}
    >
      <TouchableOpacity
        onPress={setCalendarsModal}>
        <Text>캘린더 선택</Text>
      </TouchableOpacity>
      {isModalVisible &&
      <View
        style={{
          marginTop: "30%",
          marginHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        {calendars.map((calendar) => (
          <TouchableOpacity
            key={calendar.id}
            onPress={() => fetchCalendarEvents(calendar.id)}
            style={{flexDirection: "row", alignItems: "center", margin: 10}}
          >
            <Text>{calendar.title}</Text>
          </TouchableOpacity>
        ))}
      </View> }
      {isEventsModalVisible &&
        <ScrollView>
          <View
            style={{
              marginTop: "30%",
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
                <Text>{event.title}</Text>
              </View>
            ))}
            <Button title="확인" onPress={handleConfirmSelection}/>
            <Button title="닫기" onPress={setEventsModal}/>
          </View>
        </ScrollView>
      }

      {/*<Modal*/}
      {/*  visible={isModalVisible}*/}
      {/*  onRequestClose={setCalendarsModal}*/}
      {/*  transparent={true}*/}
      {/*  animationType="slide"*/}
      {/*>*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      marginTop: "30%",*/}
      {/*      marginHorizontal: 20,*/}
      {/*      backgroundColor: "white",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {calendars.map((calendar) => (*/}
      {/*      <TouchableOpacity*/}
      {/*        key={calendar.id}*/}
      {/*        onPress={() => fetchCalendarEvents(calendar.id)}*/}
      {/*        style={{flexDirection: "row", alignItems: "center", margin: 10}}*/}
      {/*      >*/}
      {/*        <Text>{calendar.title}</Text>*/}
      {/*      </TouchableOpacity>*/}
      {/*    ))}*/}
      {/*    <Button title="닫기" onPress={setCalendarsModal}/>*/}
      {/*  </View>*/}
      {/*</Modal>*/}

      {/*<Modal*/}
      {/*  visible={isEventsModalVisible}*/}
      {/*  onRequestClose={isEventsModalVisible}*/}
      {/*  transparent={true}*/}
      {/*  animationType="slide"*/}
      {/*>*/}
      {/*  <ScrollView>*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        marginTop: "30%",*/}
      {/*        marginHorizontal: 20,*/}
      {/*        backgroundColor: "white",*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {events.map((event, index) => (*/}
      {/*        <View*/}
      {/*          key={`${event.id}-${index}`}*/}
      {/*          style={{*/}
      {/*            flexDirection: "row",*/}
      {/*            alignItems: "center",*/}
      {/*            margin: 10,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Checkbox*/}
      {/*            status={event.selected ? "checked" : "unchecked"}*/}
      {/*            onPress={() => toggleEventSelection(event.id)}*/}
      {/*          />*/}
      {/*          <Text>{event.title}</Text>*/}
      {/*        </View>*/}
      {/*      ))}*/}
      {/*      <Button title="확인" onPress={handleConfirmSelection}/>*/}
      {/*      <Button title="닫기" onPress={setEventsModal}/>*/}
      {/*    </View>*/}
      {/*  </ScrollView>*/}
      {/*</Modal>*/}

      <Text>선택된 이벤트:</Text>
      {selectedEvents.map((event) => (
        <Text key={event.id}>{event.title}</Text>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={handleImportEvents}
      >
        <Text>이벤트 등록</Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  button: {}
})
