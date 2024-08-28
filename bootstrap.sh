#!/usr/bin/env bash

# setup Network Object Lib
echo 'setting up Network Object Lib'
cd networkobjectlib

echo 'installing npm dependencies'
npm install --proxy http://http-proxy.seli.gic.ericsson.se:8080
npm install ericsson_yui_theme --registry http://presentation-layer.lmera.ericsson.se/registry  --proxy http://http-proxy.seli.gic.ericsson.se:8080

echo 'installing cdt2 dependencies'
cdt2 package install --autofill --proxy http://http-proxy.seli.gic.ericsson.se:8080


# setup Topology Browser
echo 'setting up Topology Browser'
cd ../TopologyBrowser-ui

echo 'installing npm dependencies'
npm install --proxy http://http-proxy.seli.gic.ericsson.se:8080

echo 'installing cdt2 dependencies'
cdt2 package install --autofill --proxy http://http-proxy.seli.gic.ericsson.se:8080

echo 'linking networkobjectlib'
cdt2 package link ../networkobjectlib