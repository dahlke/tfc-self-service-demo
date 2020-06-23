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
    console.log("TODO", event);
  }

  _applyWorkspace(event) {
    console.log("TODO", event);
  }

  _buildWorkspaceElements() {
    // TODO: add status badge, button to confirm, apply
    const workspaceElements = this.state.workspaces.map((data) => {
        const url = `https://app.terraform.io/app/hc-se-tfe-demo-neil/workspaces/${data.attributes.name}/runs`;

        console.log(data.attributes);

        return (
          <div className="workspace" key={data.id} data-workspace-id={data.id}>
            <a href={url} target="_blank">{data.attributes.name}</a>
            <button>Plan</button>
            <button>Apply</button>
            <button>Destroy</button>
            <button>Delete</button>
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