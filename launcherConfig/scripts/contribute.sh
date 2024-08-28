#!/usr/bin/env bash
# contribute.sh
#  Adds the default metadata for the application to the Application Launcher
app='topologybrowser'

\cp -R /var/www/html/${app}/metadata/* /ericsson/tor/data/apps/
mkdir -p /ericsson/tor/data/apps/${app}/locales/en-us/
\cp /var/www/html/locales/en-us/${app}/app.json /ericsson/tor/data/apps/${app}/locales/en-us/
\cp /var/www/html/locales/en-us/${app}/app_actions.json /ericsson/tor/data/apps/${app}/locales/en-us/
chown -R jboss_user:jboss /ericsson/tor/data/apps/${app}
