//This file contains code for drawer


import React,{Component} from "react";
import { Drawer } from "react-native-paper";

export default function WindowChooser({handleChoice}){
    return <Drawer.Section title="Sankatmochan">
        <Drawer.Item label="Register Device" onPress={handleChoice.bind(null,1)}   />
        <Drawer.Item label="Report Accident" onPress={handleChoice.bind(null,2)} />
    </Drawer.Section>
}
