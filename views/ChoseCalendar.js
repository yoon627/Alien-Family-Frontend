import React, { useEffect, useState } from "react";
import { Button, Modal, ScrollView, Text, View } from "react-native";
import * as Calendar from "expo-calendar";
import { Checkbox } from "react-native-paper";

export default function ChoseCalendar() {
  const [events, setEvents] = useState([]);
  const [calendars1, setCalendars] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setCalendars(calendars);

        if (calendars.length > 0) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(startDate.getMonth() + 13); // 다음 달까지의 이벤트
          const calendarId = calendars[1].id; // 첫 번째 캘린더의 ID 사용
          const allEvents = await Calendar.getEventsAsync(
            [calendarId],
            startDate,
            endDate,
          );
          setEvents(allEvents.map((event) => ({ ...event, selected: false })));
        }
      }

      console.log(calendars1);
    })();
  }, []);

  const toggleEventSelection = (id) => {
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        return { ...event, selected: !event.selected };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleConfirmSelection = () => {
    setSelectedEvents(events.filter((event) => event.selected));
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {calendars1.map((calendar) => (
        <Text key={calendar.id}>{calendar.title}</Text>
      ))}

      <Button title="이벤트 선택" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView>
          {events.map((event) => (
            <View
              key={event.id}
              style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
            >
              <Checkbox
                status={event.selected ? "checked" : "unchecked"}
                onPress={() => toggleEventSelection(event.id)}
              />
              <Text>{event.title}</Text>
            </View>
          ))}
          <Button title="확인" onPress={handleConfirmSelection} />
        </ScrollView>
      </Modal>
      <Text>선택된 이벤트:</Text>
      {selectedEvents.map((event) => (
        <Text key={event.id}>{event.title}</Text>
      ))}
    </View>
  );
}
