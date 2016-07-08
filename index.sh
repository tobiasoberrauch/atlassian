#!/usr/bin/env bash


case $1 in
    run)
        docker run -d -p 8080:8080 cptactionhank/atlassian-jira
    ;;
esac