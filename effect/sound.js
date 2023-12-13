import React, { useState, useEffect } from 'react';
import {TouchableOpacity, Text, View, Image} from 'react-native';
import { Audio } from 'expo-av';

const SoundPlayer = () => {
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    async function loadSound() {
        const loadedSound = await Audio.Sound.createAsync(
            require('../assets/Circus.mp3')
        );
        setSound(loadedSound.sound);
    }

    const handlePress = async () => {
        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <View style={{marginTop: "5%"}}>
            <TouchableOpacity onPress={handlePress}>
                {isPlaying ? <Text>Pause Sound</Text> : (
                  <Image
                    style={{width:20, height:20, resizeMode: "contain"}}
                    source={require('../assets/img/soundUp.png')} />
                )}

            </TouchableOpacity>
        </View>
    );
};

export default SoundPlayer;
