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

api = TFC(TFC_TOKEN)
api.set_org(TFC_ORG_NAME)

# TODO: add as many other bundles as I can, including the Omni demo
CONFIG_BUNDLES = {
    "aws": [
        {
            "id": "aws-two-tier",
            "working-dir": "two-tier-tfc-demo-app/aws",
            "name": "AWS Two Tier App"
        },
        {
            "id": "aws-fargate",
            "working-dir": "/",
            "name": "AWS Fargate App"
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


"""
        self._run = self._api.runs.create(create_run_payload)["data"]
        self._api.runs.apply(self._run_id)
        applied_run = self._api.runs.show(self._run_id)["data"]

        self._logger.debug("Waiting for apply to kick off...")
        while applied_run["attributes"]["status-timestamps"]["applying-at"] is None:
            applied_run = self._api.runs.show(self._run_id)["data"]
            time.sleep(1)
        self._logger.debug("Apply kicked off.")
        self.assertIsNotNone(applied_run["attributes"]["status-timestamps"]["applying-at"])
"""


def _get_create_payload(bundle_id):
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

def _get_plan_payload(ws_id):
    return {
        "data": {
            "attributes": {
                "is-destroy": False,
                "message": "test"
            },
            "type": "runs",
            "relationships": {
                "workspace": {
                    "data": {
                        "type": "workspaces",
                        "id": ws_id
                    }
                }
            }
        }
    }

@app.route('/config_bundles/')
def config_bundles():
    return jsonify(CONFIG_BUNDLES)

@app.route('/workspaces/')
def list_workspaces():
    all_workspaces = api.workspaces.list()["data"]
    return jsonify(all_workspaces)

@app.route('/workspaces/plan/<workspace_id>')
def plan_workspace(workspace_id):
    plan_payload = _get_plan_payload(workspace_id)
    print("plan", plan_payload)
    run = api.runs.create(plan_payload)["data"]
    print("run", run)
    return jsonify(run)

@app.route('/workspaces/apply/<run_id>')
def apply_workspace(run_id):
    print("apply", run_id)
    return jsonify({})

@app.route('/workspaces/destroy/<workspace_id>')
def destroy_workspace(workspace_id):
    print("destroy", workspace_id)
    return jsonify({})

@app.route('/workspaces/delete/<workspace_id>')
def delete_workspace(workspace_id):
    api.workspaces.destroy(workspace_id=workspace_id)
    return jsonify({"status": "ok"})

@app.route('/config_bundles/<bundle_id>')
def create_bundle(bundle_id):
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