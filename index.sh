#!/usr/bin/env bash




# jira
#docker build -t flow-jira container/jira
#docker run --detach --publish 8080:8080 flow-jira

# bitbucket
#docker run -u root -v /data/bitbucket:/var/atlassian/application-data/bitbucket atlassian/bitbucket-server chown -R daemon  /var/atlassian/application-data/bitbucket
#docker run -v /data/bitbucket:/var/atlassian/application-data/bitbucket --name="bitbucket" -d -p 7990:7990 -p 7999:7999 atlassian/bitbucket-server