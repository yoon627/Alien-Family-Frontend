import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KorolJoystick } from "korol-joystick";

// Joystick 컴포넌트 정의
const Joystick = ({ onMove, style }) => {
    return (
        <GestureHandlerRootView style={style}>
            <KorolJoystick
                color="#FFFFFF"
                radius={70}
                onMove={onMove}
            />
        </GestureHandlerRootView>
    );
};

export default Joystick;
