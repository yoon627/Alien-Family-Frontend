import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChoseCalendar from "./ChoseCalendar";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { LocaleConfig } from "react-native-calendars/src/index";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12.",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

const colors = ["#FFCA8B", "#B4DE9B", "#6FDECB", "#DC7ADE", "#DF8588"];

const getRandomColor = (index) => {
  return colors[index % colors.length];
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function CalendarScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [events, setEvents] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isNewEventModalVisible, setNewEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [memo, setMemo] = useState("");
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
  const [localeSet, setLocaleSet] = useState(false);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();

  useEffect(() => {
    dayjs.locale("ko");
    setLocaleSet(true);
    setStartAt(new Date());
    setEndAt(new Date());
    // console.log("78778678678987", startAt.getHours());
    // console.log("end", endAt);
  }, []);

  useEffect(() => {
    getData();
  }, [
    isLocalCalendarModalVisible,
    currentMonth,
    isAddOrEditModalVisible,
    isModalVisible,
  ]);

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
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    try {
      const response = await fetch(
        SERVER_ADDRESS +
          "/calendarEvent/day/" +
          `${currentYear}/${currentMonth}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
          },
        }
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
              memo: eventData.memo,
            };

            const datesInRange = getDatesInRange(
              new Date(eventData.startDate),
              new Date(eventData.endDate)
            );

            datesInRange.forEach((date) => {
              newEvents[date] = [...(newEvents[date] || []), newEvent];
            });
          });

          setEvents(newEvents);
          await AsyncStorage.setItem(
            "calendarEvents",
            JSON.stringify(newEvents)
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

  const checkYear = (date, compareDate) => {
    const sameYear = dayjs(date).year() === dayjs(compareDate).year();
    return dayjs(date).format(sameYear ? "M월 D일 (dd)" : "YY년 M월 D일 (dd)");
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
      <TouchableOpacity key={index} onPress={() => openEditModal(event)}>
        <View style={{ ...styles.event, paddingVertical: 9 }}>
          <Ionicons name={"person"} size={17} color={getRandomColor(index)} />
          <Text style={{ fontSize: 17, fontWeight: "bold", paddingLeft: 10 }}>
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
    memo: memo,
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
        { cancelable: true }
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
        { cancelable: true }
      );
      return;
    }
    // payload.startDate.setHours(payload.startDate.getHours() + 9);
    // payload.endDate.setHours(payload.endDate.getHours() + 9);
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    try {
      const token = await AsyncStorage.getItem("UserServerAccessToken"); // 적절한 토큰 키 사용

      const response = await fetch(SERVER_ADDRESS + "/calendarEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      // console.log("페이로드", payload);

      const data = await response.json(); // 응답을 JSON으로 변환
      const newEvent = {
        id: data.data.eventId,
        title: newEventTitle,
        name: name,
        startDate: startAt,
        endDate: endAt,
        memo: memo,
      };
      const datesInRange = getDatesInRange(startAt, endAt);
      const newEvents = { ...events };

      datesInRange.forEach((date) => {
        newEvents[date] = [...(newEvents[date] || []), newEvent];
      });

      setEvents(newEvents);
      setNewEventTitle("");
      setMemo("");
      setNewEventModalVisible(false);
    } catch (error) {
      console.error("There was an error creating the event:", error);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent({ ...event });
    setStartAt(event.startDate);
    // console.log("스따뚜", startAt);
    setEndAt(event.endDate);

    setModalVisible(true);
  };

  const handleEditEvent = async () => {
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
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
        { cancelable: true }
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
        { cancelable: true }
      );
      return;
    }

    const updatedEvents = { ...events };

    // 기존 이벤트를 삭제
    if (editingEvent) {
      const oldDates = getDatesInRange(
        new Date(editingEvent.startDate),
        new Date(editingEvent.endDate)
      );
      oldDates.forEach((date) => {
        updatedEvents[date] = updatedEvents[date].filter(
          (event) => event.id !== editingEvent.id
        );
      });
    }

    // 수정된 이벤트 정보 업데이트
    const newEvent = {
      ...editingEvent,
      title: editingEvent.title,
      memo: editingEvent.memo,
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
      SERVER_ADDRESS + "/calendarEvent/" + editingEvent.id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 필요한 경우 인증 헤더 추가
        },
        body: JSON.stringify(editPayload),
      }
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
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    try {
      const token = await AsyncStorage.getItem("UserServerAccessToken");
      const response = await fetch(
        SERVER_ADDRESS + `/calendarEvent/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      // Update the UI to remove the deleted event
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        Object.keys(updatedEvents).forEach((date) => {
          updatedEvents[date] = updatedEvents[date].filter(
            (event) => event.id !== eventId
          );
        });
        return updatedEvents;
      });

      setModalVisible(false);
    } catch (error) {
      console.error("There was an error deleting the event:", error);
    }
  };

  const handleDelete = () => {
    setNewEventTitle("");
    setMemo("");
    setNewEventModalVisible(false);
  };

  const theme = {
    backgroundColor: "#fff",
    calendarBackground: "#fff",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#ff7f50", // Coral color for the selected day
    selectedDayTextColor: "#ffffff",
    todayBackgroundColor: "rgba(161, 161, 161, 0.2)",
    // todayTextColor: "#ff4500", // Orange Red color for the current day
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "gray", // Arrows for switching months
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "purple", // Color for the month's title
    indicatorColor: "blue",
    // textDayFontWeight: "bold",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
    // "stylesheet.day.basic": {
    //   base: {
    //     width: 32, // 날짜 셀의 너비 조정
    //     height: 32, // 날짜 셀의 높이 조정
    //     alignItems: "center",
    //     justifyContent: "center",
    //     marginHorizontal: 4, // 날짜 간 가로 간격 조정
    //     marginVertical: 2, // 날짜 간 세로 간격 조정
    //   },
    // },
  };

  const customHeader = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => (
            <DateTimePicker
              value={selected}
              mode="date"
              display="spinner"
              onChange={setSelected}
              style={{ alignSelf: "center" }}
            />
          )}
        >
          <Text
            style={{
              fontFamily: "dnf",
              fontSize: 30,
              alignItems: "center",
            }}
          >{`${currentMonth}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        if (notification.request.content.title == "Family") {
          console.log("update Family");
        } else if (notification.request.content.title == "TMI") {
          console.log("update TMI");
        } else if (notification.request.content.title == "Calendar") {
          console.log("update Calendar");
          getData();
        } else if (notification.request.content.title == "Photo") {
          console.log("update Photo");
        } else if (notification.request.content.title == "Plant") {
          console.log("update Plant");
        } else {
          console.log("update Chatting");
        }
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, [notification]);
  useFocusEffect(
    useCallback(() => {
      getData();
      // 여기에 다른 포커스를 받았을 때 실행하고 싶은 작업들을 추가할 수 있습니다.
      return () => {
        // 스크린이 포커스를 잃을 때 정리 작업을 수행할 수 있습니다.
      };
    }, []) // 두 번째 매개변수로 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.
  );
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType={"multi-period"}
        onMonthChange={handleMonthChange}
        renderHeader={customHeader}
        theme={theme}
      />

      <ScrollView>
        <Text
          style={{
            padding: 15,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {localeSet
            ? selected
              ? dayjs(selected).format("YYYY년 M월 D일 (dd)")
              : dayjs().format("YYYY년 M월 D일 (dd)")
            : null}
        </Text>
        <TouchableOpacity
          // onPress={toggleAddOrEditModal}
          onPress={() => {
            setNewEventModalVisible(true);
            toggleAddOrEditModal();
          }}
          style={styles.event}
        >
          <MaterialCommunityIcons name="plus" size={24} color="black" />
          <Text style={{ fontSize: 18, marginLeft: 10 }}>새로운 이벤트</Text>
        </TouchableOpacity>
        {selected && events[selected] ? (
          renderEvents()
        ) : (
          <Text>등록된 일정이 없습니다.</Text>
        )}
      </ScrollView>

      {/*<Modal*/}
      {/*  visible={isAddOrEditModalVisible}*/}
      {/*  onRequestClose={toggleAddOrEditModal}*/}
      {/*  transparent={true}*/}
      {/*  animationType="slide"*/}
      {/*>*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      flex: 1,*/}
      {/*      justifyContent: "center",*/}
      {/*      alignItems: "center",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        backgroundColor: "white",*/}
      {/*        padding: 20,*/}
      {/*        borderRadius: 10,*/}
      {/*        shadowOpacity: 0.25,*/}
      {/*        shadowRadius: 3.84,*/}
      {/*        elevation: 5,*/}
      {/*        width: "50%", // 너비 조정*/}
      {/*        height: "17%", // 높이 조정*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Button*/}
      {/*        title="새 일정 추가"*/}
      {/*        onPress={() => {*/}
      {/*          setNewEventModalVisible(true);*/}
      {/*          toggleAddOrEditModal();*/}
      {/*        }}*/}
      {/*      />*/}

      {/*      <Button title="취소" onPress={toggleAddOrEditModal}/>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*</Modal>*/}

      <Modal
        presentationStyle="formSheet"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.eventContainer}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.separator} />
          </View>

          <Pressable
            style={{ position: "absolute", right: 0, marginTop: 20 }}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </Pressable>

          <TextInput
            style={styles.title}
            value={editingEvent?.title}
            onChangeText={(text) =>
              setEditingEvent({ ...editingEvent, title: text })
            }
          />
          <View style={styles.dateChoice}>
            <MaterialCommunityIcons
              name="clock-time-nine-outline"
              size={24}
              color="gray"
            />
            <Pressable onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>{checkYear(startAt, endAt)}</Text>
            </Pressable>
            <MaterialIcons
              name="navigate-next"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
            <Pressable onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{checkYear(endAt, startAt)}</Text>
            </Pressable>
          </View>

          <View>
            {showStartDatePicker && (
              <DateTimePicker
                value={startAt}
                mode="date"
                display="spinner"
                onChange={onStartDateChange}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={endAt}
                mode="date"
                display="spinner"
                onChange={onEndDateChange}
              />
            )}
          </View>

          <View style={styles.memo}>
            <MaterialCommunityIcons
              name="note-text-outline"
              size={24}
              color="gray"
            />
            <TextInput
              value={editingEvent?.memo}
              onChangeText={(text) => {
                if (text.length <= 20) {
                  setEditingEvent({ ...editingEvent, memo: text });
                }
              }}
              placeholder="메모"
              style={styles.memoText}
            />
          </View>
        </View>

        <View style={styles.check}>
          <Pressable onPress={() => deleteEvent(editingEvent.id)}>
            <Ionicons
              style={{ paddingRight: 20 }}
              name="ios-trash-outline"
              size={30}
              color="gray"
            />
          </Pressable>
          <Octicons
            name="check-circle-fill"
            size={56}
            color="black"
            onPress={handleEditEvent}
          />
        </View>
      </Modal>

      <Modal
        presentationStyle="formSheet"
        visible={isNewEventModalVisible}
        onRequestClose={() => setNewEventModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.eventContainer}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.separator} />
          </View>
          <TextInput
            style={styles.title}
            placeholder="제목"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />

          <View style={styles.dateChoice}>
            <MaterialCommunityIcons
              name="clock-time-nine-outline"
              size={24}
              color="gray"
            />
            <Pressable onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>{checkYear(startAt, endAt)}</Text>
            </Pressable>

            <MaterialIcons
              name="navigate-next"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
            <Pressable onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>{checkYear(endAt, startAt)}</Text>
            </Pressable>
          </View>

          <View style={{ alignSelf: "center" }}>
            {showStartDatePicker && (
              <DateTimePicker
                value={startAt}
                mode="date"
                display="spinner"
                onChange={onStartDateChange}
                style={{ alignSelf: "center" }}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endAt}
                mode="date"
                display="spinner"
                onChange={onEndDateChange}
                style={{ alignSelf: "center" }}
              />
            )}
          </View>

          <View style={styles.load}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={24}
              color="gray"
            />
            <Pressable
              style={styles.tagButton}
              onPress={() => {
                toggleAddOrEditModal();
                toggleLocalCalendarModal();
              }}
            >
              <Text style={styles.tagText}>일정 가져오기</Text>
            </Pressable>
          </View>

          <View style={styles.memo}>
            <MaterialCommunityIcons
              name="note-text-outline"
              size={24}
              color="gray"
            />
            <TextInput
              value={memo}
              onChangeText={(text) => {
                if (text.length <= 20) {
                  setMemo(text);
                }
              }}
              placeholder="메모"
              style={styles.memoText}
            />
          </View>
        </View>

        <View style={styles.check}>
          <Pressable onPress={handleDelete}>
            <Text style={{ paddingRight: 20, color: "gray" }}>
              작성을 취소할래요
            </Text>
          </Pressable>
          <Octicons
            name="check-circle-fill"
            size={56}
            color="black"
            onPress={addNewEvent}
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

const styles = StyleSheet.create({
  container: {},
  separator: {
    height: 4,
    width: "12%",
    backgroundColor: "#CCC6C6",
    marginTop: "6%",
    marginVertical: 10,
    borderRadius: 50,
  },
  eventContainer: {
    marginHorizontal: 20,
    paddingHorizontal: 7,
  },
  title: {
    marginTop: 50,
    fontSize: 34,
    fontWeight: "bold",
    height: 50,
    marginBottom: 30,
  },
  dateChoice: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dateText: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  load: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tagButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    backgroundColor: "rgba(161, 161, 161, 0.2)",
    marginLeft: 10,
  },
  tagText: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  memo: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 50,
    marginBottom: 70,
  },
  memoText: {
    fontSize: 18,
    paddingLeft: 10,
  },
  check: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    right: 30,
    bottom: 55,
  },
  event: {
    margin: 10,
    marginTop: 0,
    padding: 15,
    paddingVertical: 17,
    backgroundColor: "rgba(161, 161, 161, 0.15)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
