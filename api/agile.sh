#!/usr/bin/env bash

read password

get() {
    curl -D- -u t.oberrauch@simplicity.ag:${password} -X GET -H "Content-Type: application/json" $1
}

# /board
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board?type=scrum
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board/33
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board/33/epic

# /sprint
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board/33/sprint
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board/33/sprint?state=active
get https://horizon.simplicity.ag/jira/rest/agile/1.0/board/33/sprint?state=future

