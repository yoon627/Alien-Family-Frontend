import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ImageBackground,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChoseCalendar from "./ChoseCalendar";
import { Ionicons } from "@expo/vector-icons";

const colors = ["#DEA690", "#B4DE9B", "#6FDECB", "#DC7ADE", "#DF8588"];

const getRandomColor = (index) => {
  return colors[index % colors.length];
};

export default function CalendarScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [events, setEvents] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isNewEventModalVisible, setNewEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
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
    getData();
  }, [currentMonth]);

  const handleMonthChange = (date) => {
    let year = date.year;
    let month = date.month;
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const toggleAddOrEditModal = () => {
    setNewEventTitle("");
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

    try {
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
      if (response.ok) {
        await AsyncStorage.removeItem("calendarEvents");

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

          await AsyncStorage.setItem(
            "calendarEvents",
            JSON.stringify(newEvents),
          );
        }
      } else {
        throw new Error("서버 응답 노노 해");
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
      // 서버에서 데이터를 가져오는데 실패한 경우, AsyncStorage에서 데이터 로드
      const storedEvents = await AsyncStorage.getItem("calendarEvents");
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
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
    const formatdate = new Date(date);
    const year = formatdate.getFullYear();
    const month = (formatdate.getMonth() + 1).toString().padStart(2, "0");
    const day = formatdate.getDate().toString().padStart(2, "0");
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
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Ionicons name={"person"} size={15} />
          <Text style={{ fontWeight: "bold", paddingLeft: 10 }}>
            {event.name} : {event.title}
          </Text>
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
    if (startAt > endAt) {
      // 경고 창 바로 표시
      Alert.alert(
        "", // 경고 창 제목
        "시작 날짜는 종료 날짜보다 이전이어야 합니다.", // 경고 창 내용
        [
          {
            text: "확인",
          },
        ],
        { cancelable: true },
      );
      return;
    }

    if (newEventTitle === "") {
      Alert.alert(
        "", // 경고 창 제목
        "일정 제목은 필수항목입니다.", // 경고 창 내용
        [
          {
            text: "확인",
          },
        ],
        { cancelable: true },
      );
      return;
    }

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
        startDate: startAt,
        endDate: endAt,
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
    setStartAt(event.startDate);
    setEndAt(event.endDate);
    setModalVisible(true);
  };

  const handleEditEvent = async () => {
    if (startAt > endAt) {
      // 경고 창 바로 표시
      Alert.alert(
        "", // 경고 창 제목
        "시작 날짜는 종료 날짜보다 이전이어야 합니다.", // 경고 창 내용
        [
          {
            text: "확인",
          },
        ],
        { cancelable: true },
      );
      return;
    }
    if (editingEvent.title === "") {
      Alert.alert(
        "", // 경고 창 제목
        "일정 제목은 필수항목입니다.", // 경고 창 내용
        [
          {
            text: "확인",
          },
        ],
        { cancelable: true },
      );
      return;
    }

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
    let marked = {};

    Object.keys(events).forEach((date) => {
      let periods = events[date].map((event) => {
        return {
          startingDay: formatYYYYMMDD(event.startDate) === date,
          endingDay: formatYYYYMMDD(event.endDate) === date,
          color: getRandomColor(events[date].indexOf(event)),
        };
      });

      marked[date] = { periods: periods };
    });

    // Ensure the selected date is marked
    if (selected && !marked[selected]) {
      marked[selected] = {
        selected: true,
        selectedColor: "#e0b3e8",
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

  const theme = {
    backgroundColor: "#ffffff",
    calendarBackground: "#f2f2f2",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#ff7f50", // Coral color for the selected day
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#ff4500", // Orange Red color for the current day
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "pink", // Arrows for switching months
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "purple", // Color for the month's title
    indicatorColor: "blue",
    textDayFontWeight: "bold",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
    textDayFontFamily: "dnf",
  };

  const customHeader = () => {
    return (
      <View>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: "dnf",
              fontSize: 32,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >{`${currentMonth}  ${currentYear}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType={"multi-period"}
        onMonthChange={handleMonthChange}
        renderHeader={customHeader}
        theme={theme}
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
        style={{ padding: 10, marginTop: 5, backgroundColor: "#cecccc" }}
      >
        <Text> + 새로운 일정</Text>
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
      {/*새 일정 추가 하기*/}
      <Modal
        visible={isNewEventModalVisible}
        onRequestClose={() => setNewEventModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={{ marginTop: 50, marginHorizontal: 20, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            새 일정 추가
          </Text>
          <TextInput
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            placeholder="제목"
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
            }}
          />
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 32 }}>시작 </Text>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startAt}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <Text style={{ fontSize: 32 }}>{formatYYYYMMDD(startAt)}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 32 }}>종료 </Text>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endAt}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                <Text style={{ fontSize: 32 }}>{formatYYYYMMDD(endAt)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 40,
            }}
          >
            <Button
              title="달력에서 가져오기"
              onPress={() => {
                toggleAddOrEditModal();
                toggleLocalCalendarModal();
              }}
            />
            <TouchableOpacity
              onPress={addNewEvent}
              style={{ marginRight: 20, borderRadius: 20 }}
            >
              <ImageBackground
                source={require("../assets/img/pinkBtn.png")}
                style={{
                  width: 100,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontSize: 32, color: "white" }}>확인</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setNewEventModalVisible(false);
              }}
              style={{ marginRight: 20, borderRadius: 20 }}
            >
              <ImageBackground
                source={require("../assets/img/pinkBtn.png")}
                style={{
                  width: 100,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontSize: 32, color: "white" }}>취소</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
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
