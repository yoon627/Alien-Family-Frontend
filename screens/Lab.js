import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const MoveXY = () => {
  const startValue = useRef(new Animated.ValueXY(0, 0)).current;
  const endValue = 150;
  const duration = 5000;
  useEffect(() => {
    Animated.timing(startValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [startValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.square,
          {
            transform: [
              {
                translateX: startValue.x,
              },
              {translateY: startValue.y},
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    height: 50,
    width: 50,
    backgroundColor: 'blue',
  },
});

export default MoveXY;