#!/bin/bash
# Use first parameter to set a specific port
# e.g. <scriptname> 8585
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PORT=8585
if [ ! -z "$1" ]; then
    PORT=$1
fi
. proxyCookieUpdate.sh
cd ${SCRIPT_DIR}/../TopologyBrowser-ui
cdt2 serve -p $PORT --proxy-config ../proxy/proxyConfig.json