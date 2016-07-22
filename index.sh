#!/usr/bin/env bash

bundles_plugins_array=(
    'com.atlassian.bundles:json-schema-validator-atlassian-bundle'
    'com.atlassian.upm:atlassian-universal-plugin-manager-plugin'
    'com.atlassian.jwt:jwt-plugin'
    'com.atlassian.plugins:atlassian-connect-plugin'
)
bundles_plugins=$(IFS=, ; echo "${bundles_plugins_array[*]}")

# --container tomcat7x

# --server localhost
# --http-port 80
# --context-path ROOT

# refapp
#atlas-run-standalone --product bamboo --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
#atlas-run-standalone --product bitbucket --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
atlas-run-standalone --product confluence --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
#atlas-run-standalone --product crowd --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
#atlas-run-standalone --product fecru --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
atlas-run-standalone --product jira --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
#atlas-run-standalone --product refapp --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true
#atlas-run-standalone --product stash --bundled-plugins ${bundles_plugins} --context-path ROOT --jvmargs -Datlassian.upm.on.demand=true

#cd ./add-on/ && node ./app.js