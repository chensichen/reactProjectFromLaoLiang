import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Admin from  './admin';
import 'antd-mobile/dist/antd-mobile.css';
import Auth from './auth';
import 'babel-polyfill';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    let TabMenu = sessionStorage.getItem('TabMenu');
    function getTabMenu(TabMenu) {
      return sessionStorage.setItem("TabMenu", TabMenu)
    }
    switch (TabMenu) {
      case 'blueTab':
        getTabMenu(TabMenu)
        break;
      case 'redTab': 
        getTabMenu(TabMenu)
        break;
      case 'greenTab': 
        getTabMenu(TabMenu)
        break;
      case 'yellowTab': 
        getTabMenu(TabMenu)
        break;
      default: 
        getTabMenu(TabMenu)
    }
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/admin' component={Admin}/>
          <Route path='/auth' component={Auth}/>
          <Redirect to='/admin'/>
        </Switch>
      </Router>
    );
  }
}