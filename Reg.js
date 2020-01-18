//This file cotains code for Registration window
import React, { Component } from "react";
import { View, Text } from "react-native";
import { TextInput, Button, Headline } from "react-native-paper";
import * as FileSystem from "expo-file-system";

export default class RegWindow extends Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };

    }

    handleBtnPress(e) {
        const x = JSON.stringify({
            did: this.state.text,
            time: Date.now()
        });
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/dev.json", x, { endcoding: FileSystem.EncodingType.UTF8 })
            .then(() => {
                console.log("Record written ", x);
            })
            .catch(err => {
                console.log("Error while writing : ", err.code, err.message);
            });
    }

    componentDidMount(){
        FileSystem.readAsStringAsync(FileSystem.documentDirectory+"/dev.json",{encoding:FileSystem.EncodingType.UTF8})
        .then(r=>{
            const {did}= JSON.parse(r);
            this.setState({text:did});
        })
    }


    render() {

        return <View >
            <Headline>Register Device</Headline>
            <TextInput mode="outlined" label="Device Id" value={this.state.text} onChangeText={text => { this.setState({ text }) }} />
            <Button mode="contained" onPress={this.handleBtnPress.bind(this)} >
                Set Device Id
                </Button>

        </View>


    }


}