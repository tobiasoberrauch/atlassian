FROM ghostsquad/docker-java8
MAINTAINER "Wes McNamee" <ghost.squadron@gmail.com>

WORKDIR /opt
RUN wget https://marketplace.atlassian.com/download/plugins/atlassian-plugin-sdk-tgz -O atlassian-plugin-sdk.tar.gz
RUN tar -xvf atlassian-plugin-sdk.tar.gz

RUN mkdir atlassian-plugin-sdk
RUN tar -xvzf atlassian-plugin-sdk.tar.gz --strip-components 1 -C atlassian-plugin-sdk

RUN ln -s /opt/atlassian-plugin-sdk/bin /usr/local/bin/atlassian-plugin-sdk
ENV PATH $PATH:/opt/atlassian-plugin-sdk/bin

RUN yum install -y epel-release
RUN yum install -y python-setuptools python-pip
RUN pip install supervisor
RUN mkdir -p /etc/supervisord
RUN mkdir -p /var/log/supervisor

RUN mkdir -p /home/atlassian/amps-standalone/target
WORKDIR /opt/atlassian-plugin-sdk

RUN atlas-version