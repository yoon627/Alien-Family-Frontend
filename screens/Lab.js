import React from 'react';
import { View, FlatList, Text, style} from 'react-native';

const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

export default function Lab(){
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );
    var DATA = [];
  return (
    <FlatList
    	data={DATA}
  		renderItem={renderItem}
		keyExtractor={item => item.id}
	/>)
};