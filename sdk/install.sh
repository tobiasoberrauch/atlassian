#!/usr/bin/env bash

mkdir -p data/atlassian-plugin-sdk
cd data/atlassian-plugin-sdk

curl -L https://marketplace.atlassian.com/download/plugins/atlassian-plugin-sdk-tgz
tar -xvzf atlassian-plugin-sdk-tgz
mv atlassian-plugin-sdk-*.tar.gz /opt/atlassian-plugin-sdk
rm atlassian-plugin-sdk-tgz
cd -