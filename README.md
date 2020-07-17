# TFC Self Service Demo

### Requirements
```
- venv
- pip3 / python3
- yarn
```

### Install Python Deps in a `venv`
```
virtualenv venv
source venv/bin/activate
pip install -r conf/pip-reqs.txt
```

### Set Required TFC env vars
```
export TFC_URL="https://app.terraform.io";
export TFC_ORG="hc-se-tfe-demo-neil";
export TFC_TOKEN="";
export TFC_OAUTH_TOKEN_ID="";
```

### Start the Web Server
```
make docker_build_app
make npm_build_frontend
make docker_run_app
```

### Start the Frontend Server for Development
```
cd frontend/
yarn start
open http://localhost:3000/
```
