import React, { Component } from 'react';

const HOST = window.location.hostname;
// const PORT = window.location.port;
const PORT = 5000;
const WORKSPACES_URL = `http://${HOST}:${PORT}/workspaces`;


class App extends Component {

  constructor(props) {
    super(props);
    const initState = {
      workspaces: []
    };
    this.state = initState;
    this._fetchWorkspaces();
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

  _planWorkspace(event) {
    const workspaceId = event.currentTarget.dataset.workspaceId;
    const url = `${WORKSPACES_URL}/plan/${workspaceId}`;
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        console.log("Error planning workspace.");
      })
      .then((data) => {
        console.log("plan response", data);
      });
  }

  _applyWorkspace(event) {
    const workspaceId = event.currentTarget.dataset.workspaceId;
    const url = `${WORKSPACES_URL}/apply/${workspaceId}`;
    console.log("apply", url);
  }

  _destroyWorkspace(event) {
    const workspaceId = event.currentTarget.dataset.workspaceId;
    const url = `${WORKSPACES_URL}/destroy/${workspaceId}`;
    console.log("destroy", url);
  }

  _deleteWorkspace(event) {
    const workspaceId = event.currentTarget.dataset.workspaceId;
    const url = `${WORKSPACES_URL}/delete/${workspaceId}`;
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        console.log("Error planning workspace.");
      })
      .then((data) => {
        console.log("destroy response", data);
      });
  }

  _buildWorkspaceElements() {
    // TODO: add status badge, button to confirm, apply
    const workspaceElements = this.state.workspaces.map((data) => {
        const url = `https://app.terraform.io/app/hc-se-tfe-demo-neil/workspaces/${data.attributes.name}/runs`;

        console.log(data.attributes);

        return (
          <div className="workspace" key={data.id} data-workspace-id={data.id}>
            <a href={url} _target="blank" rel="noopener noreferrer">{data.attributes.name}</a>
            <button data-workspace-id={data.id} onClick={this._planWorkspace.bind(this)}>Plan</button>
            <button data-workspace-id={data.id} onClick={this._applyWorkspace.bind(this)}>Apply</button>
            <button data-workspace-id={data.id} onClick={this._destroyWorkspace.bind(this)}>Destroy</button>
            <button data-workspace-id={data.id} onClick={this._deleteWorkspace.bind(this)}>Delete</button>
          </div>
        );
    });
    return workspaceElements;
  }

  render() {
    const workspaceElements = this._buildWorkspaceElements();
    return (
    <div className="workspaces-list">
        <h2>TF Workspaces </h2>
        {workspaceElements}
    </div>
    );
  }
}

export default App;