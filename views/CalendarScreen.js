import React, { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChoseCalendar from "./ChoseCalendar";

const colors = [
  "#FEE1E8",
  "#C6DBDA",
  "#d1c089",
  "#92346e",
  "#55CBCD",
  "#C08863",
  "#483020",
  "#9ec8a0",
];

const getRandomColor = (index) => {
  return colors[index % colors.length];
};

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
  const [name, setName] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [eventId, setEventId] = useState("");
  const [isAddOrEditModalVisible, setIsAddOrEditModalVisible] = useState(false);
  const [isLocalCalendarModalVisible, setIsLocalCalendarModalVisible] =
    useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    console.log(currentYear, "년", currentMonth, "월");

    getData();
  }, [isLocalCalendarModalVisible, currentMonth]);

  const handleMonthChange = (date) => {
    let year = date.year;
    let month = date.month;
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const toggleAddOrEditModal = () => {
    if (Object.is(startAt.valueOf(), NaN)) {
      setStartAt(new Date());
      setEndAt(new Date());
    }
    setIsAddOrEditModalVisible((prevState) => !prevState);
  };

  const toggleLocalCalendarModal = () => {
    setIsLocalCalendarModalVisible((prevState) => !prevState);
  };

  const getData = async () => {
    const name = await AsyncStorage.getItem("MyName");
    const id = await AsyncStorage.getItem("familyId");
    const token = await AsyncStorage.getItem("UserServerAccessToken"); // 적절한 토큰 키 사용

    const response = await fetch(
      "http://43.202.241.133:12345/calendarEvent/day/" +
        `${currentYear}/${currentMonth}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
        },
      },
    );
    const data = await response.json();
    if (data.code === 200 && data.data.length > 0) {
      let newEvents = {};

      data.data.forEach((eventData) => {
        const newEvent = {
          id: eventData.eventId,
          title: eventData.eventName,
          name: eventData.member.nickname,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
        };

        const datesInRange = getDatesInRange(
          new Date(eventData.startDate),
          new Date(eventData.endDate),
        );

        datesInRange.forEach((date) => {
          newEvents[date] = [...(newEvents[date] || []), newEvent];
        });
      });

      setEvents(newEvents);
    }
    setFamilyId(id);
    setName(name);
  };

  useEffect(() => {
    setStartAt(new Date(selected));
    setEndAt(new Date(selected));
  }, [selected]);

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

  function getDatesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    while (start <= end) {
      dates.push(formatYYYYMMDD(new Date(start)));
      start.setDate(start.getDate() + 1);
    }

    return dates;
  }

  const onDayPress = (day) => {
    setSelected(day.dateString);
  };

  const renderEvents = () => {
    return events[selected]?.map((event, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => openEditModal(event)}
        style={{
          padding: 10,
          marginTop: 5,
          backgroundColor: getRandomColor(index),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>{event.title}</Text>
          <Text>{event.name}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const payload = {
    eventName: newEventTitle,
    startDate: startAt,
    endDate: endAt,
  };

  const addNewEvent = async () => {
    try {
      const token = await AsyncStorage.getItem("UserServerAccessToken"); // 적절한 토큰 키 사용
      const response = await fetch(
        "http://43.202.241.133:12345/calendarEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const data = await response.json(); // 응답을 JSON으로 변환
      const newEvent = {
        id: data.data.eventId,
        title: newEventTitle,
        name: name,
      };
      const datesInRange = getDatesInRange(startAt, endAt);
      const newEvents = { ...events };

      datesInRange.forEach((date) => {
        newEvents[date] = [...(newEvents[date] || []), newEvent];
      });

      setEvents(newEvents);
      setNewEventTitle("");
      setNewEventModalVisible(false);
    } catch (error) {
      console.error("There was an error creating the event:", error);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent({ ...event });
    setStartAt(new Date(event.startDate));
    setEndAt(new Date(event.endDate));
    setModalVisible(true);
  };

  const handleEditEvent = async () => {
    const updatedEvents = { ...events };

    // 기존 이벤트를 삭제
    if (editingEvent) {
      const oldDates = getDatesInRange(
        new Date(editingEvent.startDate),
        new Date(editingEvent.endDate),
      );
      oldDates.forEach((date) => {
        updatedEvents[date] = updatedEvents[date].filter(
          (event) => event.id !== editingEvent.id,
        );
      });
    }

    // 수정된 이벤트 정보 업데이트
    const newEvent = {
      ...editingEvent,
      title: editingEvent.title,
      startDate: startAt,
      endDate: endAt,
    };

    // 새로운 날짜에 이벤트 추가
    const newDates = getDatesInRange(startAt, endAt);
    newDates.forEach((date) => {
      updatedEvents[date] = [...(updatedEvents[date] || []), newEvent];
    });

    setEvents(updatedEvents);

    const token = await AsyncStorage.getItem("UserServerAccessToken");
    const editPayload = {
      eventId: editingEvent.id, // 이벤트 ID
      eventName: editingEvent.title, // 수정된 제목
      startDate: startAt, // 수정된 시작 날짜
      endDate: endAt, // 수정된 종료 날짜
    };

    const response = await fetch(
      "http://43.202.241.133:12345/calendarEvent/" + editingEvent.id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
        },
        body: JSON.stringify(editPayload),
      },
    );

    const data = await response.json();
    setModalVisible(false);
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

  const deleteEvent = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem("UserServerAccessToken");
      const response = await fetch(
        `http://43.202.241.133:12345/calendarEvent/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      // Update the UI to remove the deleted event
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        Object.keys(updatedEvents).forEach((date) => {
          updatedEvents[date] = updatedEvents[date].filter(
            (event) => event.id !== eventId,
          );
        });
        return updatedEvents;
      });

      setModalVisible(false);
    } catch (error) {
      console.error("There was an error deleting the event:", error);
    }
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        onMonthChange={handleMonthChange}
      />
      <View>
        {selected && events[selected] ? (
          renderEvents()
        ) : (
          <Text>일정이 없네요 백수세요?</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={toggleAddOrEditModal}
        style={{ padding: 10, marginTop: 5, backgroundColor: "#a273c3" }}
      >
        <Text>일정 추가하기ㅋㅋ</Text>
      </TouchableOpacity>

      <Modal
        visible={isAddOrEditModalVisible}
        onRequestClose={toggleAddOrEditModal}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: "50%", // 너비 조정
              height: "17%", // 높이 조정
            }}
          >
            <Button
              title="새 일정 추가"
              onPress={() => {
                setNewEventModalVisible(true);
                toggleAddOrEditModal();
              }}
            />
            <Button
              title="달력에서 가져오기"
              onPress={() => {
                toggleAddOrEditModal();
                toggleLocalCalendarModal();
              }}
            />
            <Button title="취소" onPress={toggleAddOrEditModal} />
          </View>
        </View>
      </Modal>

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
          <Button title="수정하기" onPress={handleEditEvent} />
          <Button
            title="Delete Event"
            onPress={() => deleteEvent(editingEvent.id)}
            color="red"
          />
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
          <Button
            title="취소"
            onPress={() => setNewEventModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>

      <Modal
        visible={isLocalCalendarModalVisible}
        onRequestClose={() => setIsLocalCalendarModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: "50%", // 너비 조정
              height: "50%", // 높이 조정
            }}
          >
            <ChoseCalendar />

            <Button
              title="취소"
              onPress={() => toggleLocalCalendarModal()}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
