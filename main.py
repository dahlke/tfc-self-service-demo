#!/usr/bin/python3
import os
import json
import time
import socket
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from terrasnek.api import TFC
from util import api_request_helpers

app = Flask(__name__, static_folder='react_app/build')
CORS(app)

TFC_ORG_NAME = os.getenv("TFC_ORG_NAME", None)
TFC_OAUTH_TOKEN_ID = os.getenv("TFC_OAUTH_TOKEN_ID", None)
TFC_TOKEN = os.getenv("TFC_TOKEN", None)
TFC_SAAS_URL = "https://app.terraform.io"
TFC_URL = os.getenv("TFC_URL", TFC_SAAS_URL)

api = TFC(TFC_TOKEN, url=TFC_URL)
api.set_org(TFC_ORG_NAME)

@app.route('/config_bundles/')
def config_bundles():
    return jsonify(api_request_helpers.get_config_bundles())

@app.route('/workspaces/')
def list_workspaces():
    all_workspaces = api.workspaces.list()["data"]
    return jsonify(all_workspaces)

@app.route('/workspaces/plan/<workspace_id>')
def plan_workspace(workspace_id):
    plan_payload = api_request_helpers.get_plan_payload(workspace_id)
    run = api.runs.create(plan_payload)["data"]
    return jsonify(run)

@app.route('/workspaces/apply/<run_id>')
def apply_workspace(run_id):
    # TODO
    print("apply", run_id)
    return jsonify({})

@app.route('/workspaces/destroy/<workspace_id>')
def destroy_workspace(workspace_id):
    # TODO
    print("destroy", workspace_id)
    return jsonify({})

@app.route('/workspaces/delete/<workspace_id>')
def delete_workspace(workspace_id):
    api.workspaces.destroy(workspace_id=workspace_id)
    return jsonify({"status": "ok"})

@app.route('/workspaces/show/<workspace_id>')
def show_workspace(workspace_id):
    ws = api.workspaces.show(workspace_id=workspace_id)["data"]
    latest_run_id = None
    run = None

    if "latest-run" in ws["relationships"] and \
        "data" in ws["relationships"]["latest-run"] and \
        ws["relationships"]["latest-run"]["data"] is not None:
        print(ws["relationships"]["latest-run"])
        latest_run_id = ws["relationships"]["latest-run"]["data"]["id"]
        run = api.runs.show(latest_run_id)["data"]

    return jsonify({
        "workspace": ws,
        "latest-run": run
    })

@app.route('/config_bundles/<bundle_id>')
def create_bundle(bundle_id):
    create_payload = api_request_helpers.get_create_payload(bundle_id)
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
    bundles = api_request_helpers.get_config_bundles()
    print(bundles)
    app.run(host='0.0.0.0', use_reloader=True, port=5000, threaded=True)