import { Audio } from 'expo-av';

let recording = null;

export async function startRecording() {
  try {
    console.log('Requesting permissions..');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    }); 

    console.log('Starting recording..');
    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync(); 
    console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

export async function stopRecording() {
  console.log('Stopping recording..');
  if (recording) {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
    return uri;
  }
  return null;
}
