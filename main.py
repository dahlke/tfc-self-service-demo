#!/usr/bin/python3
import os
import json
import time
import socket
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from terrasnek.api import TFC

app = Flask(__name__, static_folder='react_app/build')
CORS(app)
TFC_ORG_NAME="hc-se-tfe-demo-neil"
TFC_OAUTH_TOKEN_ID = os.getenv("TFC_OAUTH_TOKEN_ID", None)
TFC_TOKEN = os.getenv("TFC_TOKEN", None)

# TODO: add as many other bundles as I can, including the Omni demo
CONFIG_BUNDLES = {
    "aws": [
        {
            "id": "aws-two-tier",
            "working-dir": "two-tier-tfc-demo-app/aws",
            "name": "AWS Two Tier App"
        }
    ],
    "azure": [
        {
            "id": "azure-two-tier",
            "working-dir": "two-tier-tfc-demo-app/azure",
            "name": "Azure Two Tier App"
        }
    ],
    "gcp": [
        {
            "id": "gcp-two-tier",
            "working-dir": "two-tier-tfc-demo-app/gcp",
            "name": "GCP Two Tier App"
        }
    ]
}

def _get_create_payload(bundle_id):
    # TODO: fix workspace name

    working_dir = None
    for provider in CONFIG_BUNDLES:
        for bundle in CONFIG_BUNDLES[provider]:
            print(bundle)
            if bundle["id"] == bundle_id:
                working_dir = bundle["working-dir"]
                break

    workspace_name = f"{bundle_id}-{int(time.time())}"

    return {
        "data": {
            "attributes": {
                "name": workspace_name, 
                "terraform_version": "0.12.24",
                "working-directory": working_dir,
                "vcs-repo": {
                    "identifier": "dahlke/tfc-demo",
                    "oauth-token-id": TFC_OAUTH_TOKEN_ID,
                    "branch": "master"
                }
            },
            "type": "workspaces"
        }
    }

@app.route('/config_bundles/')
def config_bundles():
    return jsonify(CONFIG_BUNDLES)

# TODO: apply by ID function which I can even enter manually.
@app.route('/workspaces/')
def list_workspaces():
    api = TFC(TFC_TOKEN)
    api.set_org(TFC_ORG_NAME)
    all_workspaces = api.workspaces.list()["data"]
    print("get the workspaces")
    return jsonify(all_workspaces)

@app.route('/config_bundles/<bundle_id>')
def create_bundle(bundle_id):
    api = TFC(TFC_TOKEN)
    api.set_org(TFC_ORG_NAME)
    # TODO: webhook receive, explain why I'm not applying
    create_payload = _get_create_payload(bundle_id)
    workspace = api.workspaces.create(create_payload)["data"]
    return jsonify(workspace)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("frontend/build/" + path):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', use_reloader=True, port=5000, threaded=True)