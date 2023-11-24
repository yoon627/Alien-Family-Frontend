import React,{useState} from "react";
import { View} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MainScreen from "./MainScreen";
import {Calendar} from 'react-native-calendars';


const Tab = createBottomTabNavigator();

export default function CalendarScreen({navigation}){
  const [selected, setSelected] = useState('');
  return (
    <View>
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
    />      
    </View>
  );
};