import React, { Component } from 'react';

// import AllResortsChart from './charts/AllResortsChart';
import './App.scss';

class App extends Component {
  // <AllResortsChart />

  render() {
    return (
      <div className="App">
        <div className="infra-set">
          Demo Spark Cluster
        </div>
        <div className="infra-set">
          Demo 3 Tier Web App (RDS, Route 53, EC2 Instance)
        </div>
        <div className="infra-set">
          Dynamo
        </div>
        <div className="infra-set">
          Spanner
        </div>
        <div className="infra-set">
          Cosmos
        </div>
        <div className="infra-set">
          Managed Kubernetes in all 3 majors.
        </div>
      </div>
    );
  }
}

export default App;