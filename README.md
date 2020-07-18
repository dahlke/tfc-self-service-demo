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

### Run the App in Production
```
make npm_build_frontend
make docker_build_app
make docker_run_app
```

### Start the Frontend Server for Development
```
make docker_run_app_dev
```
