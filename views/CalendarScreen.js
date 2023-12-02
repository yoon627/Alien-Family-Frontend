import React, {useEffect, useState} from "react";
import {Button, Modal, Text, TextInput, View, StyleSheet, Pressable} from "react-native";
import {Calendar} from "react-native-calendars";
import {TouchableOpacity} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChoseCalendar from "./ChoseCalendar";
import {Ionicons} from "@expo/vector-icons";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import {Octicons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const colors = ["#DEA690", "#B4DE9B", "#6FDECB", "#DC7ADE", "#DF8588"];

const getRandomColor = (index) => {
  return colors[index % colors.length];
};

export default function CalendarScreen({navigation}) {
  const [selected, setSelected] = useState("");
  const [events, setEvents] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isNewEventModalVisible, setNewEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [memo, setMemo] = useState('');
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

  useEffect(() => {
    dayjs.locale('ko');
    setLocaleSet(true);
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
    const nowYear = new Date().getFullYear();
    const year = new Date(date).getFullYear();

    // 현재 시간과 같은 년도면 생략, 년도 다를 때만 표시
    if (year === nowYear) {
      return dayjs(date).format('M월 D일 (dd)');
    }
    return dayjs(date).format('YY년 MM월 D일 (dd)');
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
        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
          <Ionicons name={"person"} size={15}/>
          <Text style={{fontWeight: "bold", paddingLeft: 10}}>
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
      const newEvents = {...events};

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
    setEditingEvent({...event});
    setStartAt(new Date(event.startDate));
    setEndAt(new Date(event.endDate));
    setModalVisible(true);
  };

  const handleEditEvent = async () => {
    const updatedEvents = {...events};

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

      marked[date] = {periods: periods};
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
        const updatedEvents = {...prevEvents};
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

  const handleDelete = () => {
    setNewEventTitle('');
    setMemo('');
    setNewEventModalVisible(false);
  }

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
    // textDayFontFamily: "dnf",
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
              style={{alignSelf: 'center'}}
            />
          )}>
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

  return (
    <View style={{backgroundColor: "white"}}>
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
          <Text></Text>
        )}
      </View>

      <View>
        <TouchableOpacity>
          <Text
            style={{
              padding: 15,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {localeSet ? (
              selected ? (
                dayjs(selected).format('YYYY년 MM월 D일 (dd)')
              ) : (
                dayjs().format('YYYY년 MM월 D일 (dd)')
              )
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        // onPress={toggleAddOrEditModal}
        onPress={() => {
          setNewEventModalVisible(true);
          toggleAddOrEditModal();
        }}
        style={{
          margin: 10,
          padding: 15,
          paddingVertical: 18,
          marginTop: 5,
          backgroundColor: "rgba(161, 161, 161, 0.15)",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="black"/>
        <Text
          style={{fontSize: 18, marginLeft: 10,}}>새로운 이벤트</Text>
      </TouchableOpacity>

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
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={{marginTop: 50, marginHorizontal: 20}}>
          <Text>일정 수정</Text>
          <TextInput
            value={editingEvent?.title}
            onChangeText={(text) =>
              setEditingEvent({...editingEvent, title: text})
            }
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
            }}
          />
          <View style={styles.dateChoice}>
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

          <Button title="수정하기" onPress={handleEditEvent}/>
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
        presentationStyle="formSheet"
        visible={isNewEventModalVisible}
        onRequestClose={() => setNewEventModalVisible(false)}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.eventContainer}>
          <View style={{alignItems: "center"}}>
            <View style={styles.separator}/>
          </View>
          <TextInput
            style={styles.title}
            placeholder='제목'
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />

          <View style={styles.dateChoice}>
            <MaterialCommunityIcons name="clock-time-nine-outline" size={24} color="gray"/>
            <Pressable
              onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}
              >
                {formatYYYYMMDD(startAt)}
              </Text>
            </Pressable>

            <MaterialIcons name="navigate-next" size={24} color="black" style={{paddingLeft: 10,}}/>
            <Pressable
              onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}
              >
                {formatYYYYMMDD(endAt)}
              </Text>
            </Pressable>
          </View>

          <View style={{alignSelf: 'center'}}>
            {showStartDatePicker && (
              <DateTimePicker
                value={startAt}
                mode="date"
                display="spinner"
                onChange={onStartDateChange}
                style={{alignSelf: 'center'}}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endAt}
                mode="date"
                display="spinner"
                onChange={onEndDateChange}
                style={{alignSelf: 'center'}}
              />
            )}
          </View>

          <View style={styles.load}>
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color="gray"/>
            <Pressable
              style={styles.tagButton}
              onPress={() => {
                toggleAddOrEditModal();
                toggleLocalCalendarModal();
              }}>
              <Text
                style={styles.tagText}
              >
                일정 가져오기
              </Text>
            </Pressable>
          </View>

          <View style={styles.memo}>
            <MaterialCommunityIcons name="note-text-outline" size={24} color="gray"/>
            <TextInput
              value={memo}
              onChangeText={(text) => {
                if (text.length <= 20) {
                  setMemo(text);
                }
              }}
              placeholder='메모'
              style={styles.memoText}
              multiline
            />
          </View>

        </View>


        <View style={styles.check}>
          <Pressable
            onPress={handleDelete}>
            <Text
              style={{paddingRight: 20, color: "gray"}}>
              작성을 취소할래요
            </Text>
          </Pressable>
          <Octicons name="check-circle-fill" size={56} color="black" onPress={addNewEvent}/>
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
            <ChoseCalendar/>

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
  separator: {
    height: 4,
    width: '12%',
    backgroundColor: '#CCC6C6',
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
    alignItems: 'center',
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
  }
})