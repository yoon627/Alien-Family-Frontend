import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateCalendarEvent = async () => {
  try {
    const token = await AsyncStorage.getItem("KakaoAccessToken");
    console.log("kakao token", token);
    const response = await fetch(
      "https://kapi.kakao.com/v2/api/calendar/events?calendar_id=primary&from=2023-11-01T00:00:00Z&to=2023-11-30T00:00:00Z",
      // "https://kapi.kakao.com/v2/api/calendar/calendars",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token, // Replace YOUR_ACCESS_TOKEN with your actual access token
        },
        body: JSON.stringify({
          calendar_id: "user_63759daa38e1f752188e0cc9",
          event: {
            title: "앱에서 요청보냄",
            time: {
              start_at: "2022-11-27T03:00:00Z",
              end_at: "2022-11-27T06:00:00Z",
              time_zone: "Asia/Seoul",
              all_day: false,
              lunar: false,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("There was an error create event:", error);
  }
};
export default CreateCalendarEvent();
