#!/bin/bash

SERVER="localhost"
PORT="3000"
DEFAULT_H="Content-Type: application/json"

TOKEN=$(curl -s -X POST http://$SERVER:$PORT/authentication/login -H "$DEFAULT_H" -d @user.json | jq '.token' | sed 's/\"//g')

TOKEN_H="Authorization:$TOKEN"

echo "TOKEN: $TOKEN"
echo ""

# @param rest endpoint
function GET_request() {
    if [ -z $1 ]; then
        echo "ERROR: Missing parameter"
    fi
    RES=$(curl -s -w %{http_code} -X GET http://$SERVER:$PORT/$1 -H "$DEFAULT_H" -H "$TOKEN_H")
    RET=$?

    echo "RESULT: $(echo $RES | jq)"
    echo "RETURN: $RET"
}

# @param rest endpoint
# @param rest payload
function POST_request() {
    if [ -z $1 ] || [ -z $2 ]; then
        echo "ERROR: Missing parameter"
    fi
    RES=$(curl -s -w %{http_code} -X POST http://$SERVER:$PORT/$1 -H "$DEFAULT_H" -H "$TOKEN_H" -d @$2)
    RET=$?

    echo "RESULT: $(echo $RES | jq)"
    echo "RETURN: $RET"
}

# POST_request "POST" "workout" workout.json
