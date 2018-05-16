import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './Components/Common/interceptor';


injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <Routes/>
      </MuiThemeProvider>
    );
  }
};

export default App;
