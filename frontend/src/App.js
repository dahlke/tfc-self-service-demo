import React, { Component } from 'react';
import logo from './svg/logo_black.svg';
import BundleList from './components/BundleList.js'
import WorkspaceList from './components/WorkspaceList.js'

import './App.scss';

/*
const HOST = window.location.hostname;
// const PORT = window.location.port;
const PORT = 5000;
const CONFIG_BUNDLES_URL = `http://${HOST}:${PORT}/config_bundles`;
const WORKSPACES_URL = `http://${HOST}:${PORT}/workspaces`;
*/

class App extends Component {

  constructor(props) {
    super(props);
    const initState = {
      selectedTab: "bundles"
    };
    this.state = initState;
  }

  _clickTab(event) {
    const selectedTab = event.currentTarget.dataset.tab;
    this.setState({
      selectedTab: selectedTab
    });
  }

  render() {
    const shownList = this.state.selectedTab === "bundles" ? (
      <BundleList />
    ) : (
      <WorkspaceList />
    );

    return (
      <div className="App">
        <img src={logo} className="logo" alt="logo" />
        <h1>TFC Self Service Demo</h1>
        <div className="tabs">
          <div className={`tab half-col ${this.state.selectedTab === "bundles" ? "selected" : ""}`} data-tab="bundles" onClick={this._clickTab.bind(this)}>
            Bundles
          </div>
          <div className={`tab half-col ${this.state.selectedTab === "workspaces" ? "selected" : ""}`} data-tab="workspaces" onClick={this._clickTab.bind(this)}>
            Workspaces
          </div>
        </div>
        {shownList}
      </div>
    );
  }
}

export default App;