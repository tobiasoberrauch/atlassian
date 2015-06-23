# Basics
#
FROM durdn/atlassian-base
MAINTAINER Nicola Paolucci <npaolucci@atlassian.com>

# Install Jira

ENV JIRA_VERSION 6.2.5
ENV CONTEXT_PATH ROOT
ADD launch.bash /launch
ADD provision.bash /provision

RUN ["/provision"]

# Launching Jira

WORKDIR /opt/jira
VOLUME ["/opt/atlassian-home"]
EXPOSE 8080
USER jira
CMD ["/launch"]
