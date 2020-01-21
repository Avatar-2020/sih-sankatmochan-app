import React from 'react';
import RegWindow from './Reg';
import EmergencyWindow from './emergency';
import { registerRootComponent } from "expo";
import { Provider, Appbar } from "react-native-paper";
import WindowChooser from './drawer';
import { View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { window: 0 };
  }

  handleChoice(choice) {
    this.setState({ window: choice });
  }


  render() {
    let area, subtitle;
    switch (this.state.window) {
      case 1: area = <RegWindow />; subtitle = "Register Device"; break;
      case 2: area = <EmergencyWindow />; subtitle = "Report Accident"; break;
      default: area = <View />; subtitle = ""; break;
    }


    return <Provider>
      <WrapperToKeepAwake>
        <Appbar.Header>
          <Appbar.Content title="Sankatmochan" subtitle={subtitle} >

          </Appbar.Content>
        </Appbar.Header>


        <WindowChooser handleChoice={this.handleChoice.bind(this)} />

        {area}
      </WrapperToKeepAwake>
    </Provider>



  }

}

function WrapperToKeepAwake({ children }) {
  useKeepAwake();
  return <>
    {children}
  </>
}


registerRootComponent(App);
