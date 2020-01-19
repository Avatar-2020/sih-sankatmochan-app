//This file contains for video capturing 

import React, { Component } from "react";


import { View,  Text } from 'react-native';
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Permission from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { Headline } from "react-native-paper";
import { Button } from "react-native-paper";


const STAGE = "dev";

export default class EmergencyWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { statusText: "", disabled: false, btnText: "Panic Situation" }
    }

    async askForPermission() {

        let k = await Permission.getAsync(Permission.CAMERA);

        if (k.status === Permission.PermissionStatus.DENIED || k.status === Permission.PermissionStatus.UNDETERMINED) {
            await Permission.askAsync(Permission.CAMERA);
        }
        let p = await Permission.getAsync(Permission.LOCATION);
        if (p.status === Permission.PermissionStatus.DENIED || p.status === Permission.PermissionStatus.UNDETERMINED) {
            await Permission.askAsync(Permission.LOCATION);
        }
        let a = await Permission.getAsync(Permission.AUDIO_RECORDING);
        if (a.status === Permission.PermissionStatus.DENIED || a.status === Permission.PermissionStatus.UNDETERMINED) {
            await Permission.askAsync(Permission.AUDIO_RECORDING);
        }
        console.log(k, p, a);
    }

    componentDidMount() {
        this.askForPermission();

    }


    handlePanic(e) {
        //Getting geolocation based on FuseApi

        Location.getCurrentPositionAsync({ enableHighAccuracy: true })
            .then(position => {
                console.log("Position: ", position);
                this.setState({ position });
            }).catch(error => {
                console.log("Error Code : ", error.code, "Error Message : ", error.message);
            });

        //Getting device info    
        FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/dev.json", { encoding: FileSystem.EncodingType.UTF8 })
            .then(content => {
                this.setState({ deviceId: JSON.parse(content) });
            })


        if (this.camera) {
            const cam = this.camera;
            this.setState({ statusText: "Video Recording started" });
            cam.recordAsync({
                maxDuration: 25, //25 secs
                mute: true
            }).then(async uri => {
                console.log("Cached file Info : ", uri);
                this.setState({ statusText: "Video Recorded" });
                const content = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                const payload = {
                    loc: this.state.position,
                    deviceId: this.state.deviceId,
                    video: content
                }
                console.log("Sending all the data in cloud");
                this.setState({ statusText: "Sending data in cloud" });
                if (STAGE !== "dev") {
                    fetch("url", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: payload
                    }).then(r => {
                        if (r.status === 200) {

                            return r.json();
                        }
                    }).then(r => {
                        console.log("Accident Recorded at the backend : Response : ", r);
                        this.setState({ statusText: "Accident Recorded" });
                    }).catch(err => {
                        console.log("Error occured while sending data to the cloud : ", err.code, err.message);
                    })
                }

            }).catch(err => {
                console.log("Error Report Occured : ", err.code, " : ", err.message);

            });
            this.setState({ disabled: true });
            setTimeout(() => {
                this.camera.stopRecording();
                console.log("Recording is stopped");
                this.setState({ disabled: false });
            }, 20 * 1000);

        }

    }


    render() {



        return (
            <View style={{ flex: 1 }}>
                <Headline>Report Accident</Headline>
                <Button disabled={this.state.disabled} onPress={this.handlePanic.bind(this)} title="Press me" >{this.state.btnText}</Button>
                <Camera ref={ref => { this.camera = ref }} style={{ flex: 1 }} type={Camera.Constants.Type.back} />
                <Text>{this.state.statusText}</Text>
            </View>
        );
    }
}
