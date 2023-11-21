import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const MoleGame = () => {
    const [moles, setMoles] = useState(Array(36).fill(false));
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            let newMoles = Array(36).fill(false);
            const randomIndex = Math.floor(Math.random() * 36);
            newMoles[randomIndex] = true;
            setMoles(newMoles);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handlePress = index => {
        if (moles[index]) {
            setScore(score + 1);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Score: {score}</Text>
            <View style={styles.grid}>
                {moles.map((mole, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.moleBox}
                        onPress={() => handlePress(index)}
                    >
                        {mole && <View style={styles.mole} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 300,
        justifyContent: 'center',
    },
    moleBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mole: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'brown',
    },
});

export default MoleGame;
