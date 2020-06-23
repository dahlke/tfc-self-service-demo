import React, { Component } from 'react';

const HOST = window.location.hostname;
// const PORT = window.location.port;
const PORT = 5000;
const CONFIG_BUNDLES_URL = `http://${HOST}:${PORT}/config_bundles`;


class BundleList extends Component {

  constructor(props) {
    super(props);
    const initState = {
      configBundles: {},
    };
    this.state = initState;
    this._fetchConfigBundles();
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

  _createFromConfigBundle(bundleId) {
      const url = `${CONFIG_BUNDLES_URL}/${bundleId}`;

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

  _clickConfigBundle(event) {
    const bundleId = event.currentTarget.dataset.tfConfigBundleId;
    this._createFromConfigBundle(bundleId);
  }

  _buildConfigBundleElements() {
    let configBundleElements = {};
    // TODO: add a create button
    // TODO: add a button to link to VCS so you can see what you're doing
    // TODO: Add AWS, GCP, Azure logos and descriptions
    // TODO: show link to VCS repo that is used
    for (var key in this.state.configBundles) {
      configBundleElements[key] = [];
      configBundleElements[key] = this.state.configBundles[key].map((data) => {
        return (
          <div className="config-bundle" key={data.id}>
            {data.name}
            <button data-tf-config-bundle-id={data.id} onClick={this._clickConfigBundle.bind(this)}>Create</button>
          </div>
        );
      })
    }
    return configBundleElements;
  }

  render() {
    const configBundleElements = this._buildConfigBundleElements();
    return (
        <div className="bundle-list">
            <h2>TF Bundle Catalog</h2>
            <h4>AWS Bundles</h4>
            {configBundleElements["aws"]}
            <h4>Azure Bundles</h4>
            {configBundleElements["azure"]}
            <h4>GCP Bundles</h4>
            {configBundleElements["gcp"]}
        </div>
    );
  }
}

export default BundleList;