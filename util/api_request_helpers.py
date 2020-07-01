import json
import time


def get_config_bundles():
    bundles = None
    with open("./conf/bundles.json", "r") as f:
        bundles = json.loads(f.read())
    return bundles

def get_create_payload(bundle_id):
    working_dir = None
    bundles = get_config_bundles()
    for provider in bundles:
        for bundle in bundles[provider]:
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

def get_plan_payload(ws_id):
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