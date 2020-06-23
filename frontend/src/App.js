import React, { Component } from 'react';
import logo from './svg/logo_black.svg';
import './App.scss';

const HOST = window.location.hostname;
// const PORT = window.location.port;
const PORT = 5000;
const CONFIG_BUNDLES_URL = `http://${HOST}:${PORT}/config_bundles`;
const WORKSPACES_URL = `http://${HOST}:${PORT}/workspaces`;


class App extends Component {

  constructor(props) {
    super(props);
    const initState = {
      configBundles: {},
      workspaces: []
    };
    this.state = initState;
    this._fetchConfigBundles();
    this._fetchWorkspaces();
  }

  _fetchConfigBundles() {
      fetch(CONFIG_BUNDLES_URL)
        .then((response) => {
          return response.json()
        })
        .catch((err) => {
          console.log("Error retrieving config bundle data.");
        })
        .then((data) => {
          const newState = {
            configBundles: data
          }
          this.setState(newState);
        });
  }

  _fetchWorkspaces() {
      fetch(WORKSPACES_URL)
        .then((response) => {
          return response.json()
        })
        .catch((err) => {
          console.log("Error retrieving workspaces data.");
        })
        .then((data) => {
          const newState = {
            workspaces: data
          }
          this.setState(newState);
        });
  }

  _createFromConfigBundle(bundleId) {
      const url = `${CONFIG_BUNDLES_URL}/${bundleId}`;
      console.log("create from bundle", url)
      fetch(url)
        .then((response) => {
          return response.json()
        })
        .catch((err) => {
          console.error("Error retrieving config bundle data.");
        })
        .then((data) => {
          console.log("create response", data);
        });
  }

  _buildConfigBundleElements() {
    let configBundleElements = {};
    // TODO: add a create button
    // TODO: add a button to link to VCS so you can see what you're doing
    for (var key in this.state.configBundles) {
      configBundleElements[key] = [];
      configBundleElements[key] = this.state.configBundles[key].map((data) => {
        return (
          <div className="config-bundle" key={data.id} data-tf-config-bundle-id={data.id} onClick={this._clickConfigBundle.bind(this)}>
            {data.name}
          </div>
        );
      })
    }
    return configBundleElements;
  }

  _buildWorkspaceElements() {
    // TODO: add status badge
    const workspaceElements = this.state.workspaces.map((data) => {
        console.log(data);
        return (
          <div className="workspace" key={data.id} data-workspace-id={data.id} onClick={this._clickWorkspace.bind(this)}>
            {data.attributes.name}
          </div>
        );
    });
    return workspaceElements;
  }


  _clickConfigBundle(event) {
    const bundleId = event.currentTarget.dataset.tfConfigBundleId;
    this._createFromConfigBundle(bundleId);
  }

  _clickWorkspace(event) {
    console.log("TODO", event);
  }


  render() {
    const configBundleElements = this._buildConfigBundleElements();
    const workspaceElements = this._buildWorkspaceElements();
    return (
      <div className="App">
        <img src={logo} className="logo" alt="logo" />
        <h1>TFC Self Service Demo</h1>
        <div className="half-col config-bundles">
          <h2>TF Bundle Catalog</h2>
          {configBundleElements["aws"]}
          {configBundleElements["azure"]}
          {configBundleElements["gcp"]}
        </div>
        <div className="half-col workspaces">
          <h2>TF Workspaces </h2>
          {workspaceElements}
        </div>
      </div>
    );
  }
}

export default App;