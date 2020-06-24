import React, { Component } from 'react';
import Modal from 'react-modal';

const HOST = window.location.hostname;
// const PORT = window.location.port;
const PORT = 5000;
const WORKSPACES_URL = `http://${HOST}:${PORT}/workspaces`;

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    const initState = {
      workspaces: [],
      showModal: false,
      shownWorkspace: {
        "workspace": null,
        "latest-run": null
      }
    };
    this.state = initState;
    this._fetchWorkspaces();
  }

  componentDidMount() {
    // Refresh workspaces every 3 seconds
    setTimeout(() => this._fetchWorkspaces(), 3000)
  }

  _fetchWorkspaces(){
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
        console.log("Error deleting workspace.");
      })
      .then((data) => {
        console.log("delete response", data);
      });
  }

  _showWorkspace(event) {
    const workspaceId = event.currentTarget.dataset.workspaceId;
    const url = `${WORKSPACES_URL}/show/${workspaceId}`;
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        console.log("Error showing workspace.");
      })
      .then((data) => {
        console.log("show response", data);
        this.setState({
          shownWorkspace: data,
          showModal: true
        })
      });
  }

  _buildWorkspaceElements() {
    const workspaceElements = this.state.workspaces.map((data) => {
        const url = `https://app.terraform.io/app/hc-se-tfe-demo-neil/workspaces/${data.attributes.name}/runs`;

        return (
          <div className="workspace" key={data.id} data-workspace-id={data.id} onClick={this.showModal}>
            <a href={url} _target="blank" rel="noopener noreferrer">{data.attributes.name}</a>
            <button data-workspace-id={data.id} onClick={this._showWorkspace.bind(this)}>Show</button>
          </div>
        );
    });
    return workspaceElements;
  }
  
  handleCloseModal () {
    this.setState({ 
      showModal: false,
      shownWorkspace: {
        "workspace": null,
        "latest-run": null
      }
    });
  }

  render() {
    const workspaceElements = this._buildWorkspaceElements();
    let shownWorkspaceElement = null;

    if (this.state.shownWorkspace.workspace) {
      const ws_id = this.state.shownWorkspace.workspace.id;
      const ws_name = this.state.shownWorkspace.workspace.attributes.name;
      const latest_run = this.state.shownWorkspace["latest-run"];
      const url = `https://app.terraform.io/app/hc-se-tfe-demo-neil/workspaces/${ws_name}/runs`;

      let isConfirmable = false;
      // let isDiscardable = false;
      // let isCancelable = false;
      // let isForceCancelable = false;

      let actions = null;
      if (latest_run) {
        const actions = latest_run.attributes.actions;
        isConfirmable = actions["is-confirmable"];
        // isDiscardable = actions["is-discardable"];
        // isCancelable = actions["is-cancelable"];
        // isForceCancelable = actions["is-force-cancelable"];
      }

      const planButton = !isConfirmable ? (
          <button data-workspace-id={ws_id} onClick={this._planWorkspace.bind(this)}>Plan</button>
      ) : null;

      const applyButton = isConfirmable ? (
          <button data-workspace-id={ws_id} onClick={this._applyWorkspace.bind(this)}>Apply</button>
      ) : null;

      console.log(actions);

      // <button data-workspace-id={ws_id} onClick={this._destroyWorkspace.bind(this)}>Destroy</button>

      // TODO show buttons based on availability
      // {this.state.shownWorkspace.workspace}
      shownWorkspaceElement = (
        <div className="modal-content">
          <h1>
            <a href={url} _target="blank" rel="noopener noreferrer">{ws_name}</a>
          </h1>
          <h3>{ws_id}</h3>
          <code>
          </code>
          <code>
          </code>
          {planButton}
          {applyButton}
          <button data-workspace-id={ws_id} onClick={this._deleteWorkspace.bind(this)}>Delete</button>
        </div>
      );
    }

    console.log(shownWorkspaceElement)

    return (
      <div className="workspaces-list">
          <h2>TF Workspaces </h2>
          {workspaceElements}

          <Modal 
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            ariaHideApp={false}
            style={customStyles}
          >
            <button onClick={this.handleCloseModal.bind(this)}>Close Modal</button>
            {shownWorkspaceElement}
          </Modal>
      </div>
    );
  }
}

export default App;