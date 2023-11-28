import React, { useState } from "react";
import {
  Button,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CalendarScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [events, setEvents] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isNewEventModalVisible, setNewEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("일정 제목");
  const [startAt, setStartAt] = useState(new Date());
  const [endAt, setEndAt] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event, selected) => {
    const startDate = selected || startAt;
    setShowStartDatePicker(false);
    setStartAt(startDate); // Ensure currentDate is a Date object
  };

  const onEndDateChange = (event, selected) => {
    const endDate = selected || endAt;
    setShowEndDatePicker(false);
    setEndAt(endDate); // Ensure currentDate is a Date object
  };

  function formatYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const onDayPress = (day) => {
    setSelected(day.dateString);
  };

  const openEditModal = (event) => {
    setEditingEvent({ ...event });
    setModalVisible(true);
  };

  const handleEditEvent = () => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selected]: prevEvents[selected].map((event) =>
        event.id === editingEvent.id
          ? { ...event, title: editingEvent.title }
          : event,
      ),
    }));
    setModalVisible(false);
  };

  const renderEvents = () => {
    return events[selected]?.map((event, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => openEditModal(event)}
        style={{ padding: 10, marginTop: 5, backgroundColor: "#f0f0f0" }}
      >
        <Text>{event.title}</Text>
      </TouchableOpacity>
    ));
  };

  const addNewEvent = () => {
    const newEvent = { id: Date.now(), title: newEventTitle };
    setEvents({
      ...events,
      [selected]: [...(events[selected] || []), newEvent],
    });
    setNewEventTitle("");
    setNewEventModalVisible(false);
  };

  const payload = {
    calendar_id: "primary",
    event: JSON.stringify({
      title: `${newEventTitle}`,
      time: {
        // start_at: startAt,
        start_at: formatYYYYMMDD(startAt),
        // end_at: endAt,
        end_at: formatYYYYMMDD(endAt),
        time_zone: "Asia/Seoul",
        all_day: false,
        lunar: false,
      },
    }),
  };

  const formBody = Object.keys(payload)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]),
    )
    .join("&");

  const CreateCalendarEvent = async () => {
    try {
      const token = await AsyncStorage.getItem("KakaoAccessToken");
      const response = await fetch(
        "https://kapi.kakao.com/v2/api/calendar/create/event",
        // "https://kapi.kakao.com/v2/api/calendar/calendars",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token, // Replace YOUR_ACCESS_TOKEN with your actual access token
            "Content-Type": "application/x-www-form-urlencoded",
          },

          body: formBody,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("There was an error create event:", error);
    }
  };

  const getMarkedDates = () => {
    const marked = Object.keys(events).reduce((acc, date) => {
      acc[date] = {
        marked: events[date].length > 0, // Mark date if there are events
        selected: date === selected,
        selectedColor: "orange",
        disableTouchEvent: false,
      };
      return acc;
    }, {});

    // Ensure the selected date is marked even if there are no events
    if (selected && !marked[selected]) {
      marked[selected] = {
        selected: true,
        selectedColor: "orange",
        disableTouchEvent: true,
      };
    }

    return marked;
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        // markedDates={{
        //   [selected]: {
        //     selected: true,
        //     disableTouchEvent: true,
        //     selectedDotColor: "orange",
        //   },
        // }}
      />
      <View>
        {selected && events[selected] ? (
          renderEvents()
        ) : (
          <Text>일정이 없네요 백수세요?</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => setNewEventModalVisible(true)}
        style={{ padding: 10, marginTop: 5, backgroundColor: "#f0f0f0" }}
      >
        <Text>일정 추가하기</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={{ marginTop: 50, marginHorizontal: 20 }}>
          <Text>일정 수정</Text>
          <TextInput
            value={editingEvent?.title}
            onChangeText={(text) =>
              setEditingEvent({ ...editingEvent, title: text })
            }
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
            }}
          />
          <Button title="수정하기" onPress={handleEditEvent} />
          <Button
            title="취소"
            onPress={() => setModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>

      <Modal
        visible={isNewEventModalVisible}
        onRequestClose={() => setNewEventModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={{ marginTop: 50, marginHorizontal: 20 }}>
          <Text>새 일정 추가</Text>
          <TextInput
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
            }}
          />
          <View>
            <Text>시작 {formatYYYYMMDD(startAt)}</Text>
            <Button
              title="Start Date"
              onPress={() => setShowStartDatePicker(true)}
            />
            {showStartDatePicker && (
              <DateTimePicker
                value={startAt}
                mode="date"
                display="spinner"
                minuteInterval={5}
                onChange={onStartDateChange}
              />
            )}

            <Text>끝 {formatYYYYMMDD(endAt)}</Text>
            <Button
              title="End Date"
              onPress={() => setShowEndDatePicker(true)}
            />
            {showEndDatePicker && (
              <DateTimePicker
                value={endAt}
                mode="date"
                display="spinner"
                onChange={onEndDateChange}
              />
            )}
          </View>

          <Button title="추가하기" onPress={addNewEvent} />
          <Button title="업로드" onPress={CreateCalendarEvent} />
          <Button
            title="취소"
            onPress={() => setNewEventModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>
    </View>
  );
}
