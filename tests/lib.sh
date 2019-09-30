#!/bin/bash

SERVER="https://localhost"
PORT="3000"
DEFAULT_H="Content-Type: application/json"
TOKEN_H=""

DEBUG=0

function get_res() {
    echo "$1" | head -n -1
}

function get_ret() {
    echo "$1" | tail -n1
}

# @param rest endpoint
function GET_request() {
    if [ -z $1 ]; then
        echo "ERROR: Missing parameter"
    fi

    if [ $DEBUG -eq 1 ]; then
        echo "curl -k -s -w %{http_code} -X GET $SERVER:$PORT/$1 -H \"$DEFAULT_H\" -H \"$TOKEN_H\""
    fi

    RES=$(curl -k -s -w %{http_code} -X GET $SERVER:$PORT/$1 -H "$DEFAULT_H" -H "$TOKEN_H")
    RET=$?

    echo "$(echo $RES | jq)"
    return $RET
}

# @param rest endpoint
# @param rest payload
function POST_request() {
    if [ -z $1 ] || [ -z $2 ]; then
        echo "ERROR: Missing parameter"
    fi

    if [ $DEBUG -eq 1 ]; then
        echo "curl -k -s -w %{http_code} -X POST $SERVER:$PORT/$1 -H \"$DEFAULT_H\" -H \"$TOKEN_H\" -d @$2"
    fi

    RES=$(curl -k -s -w %{http_code} -X POST $SERVER:$PORT/$1 -H "$DEFAULT_H" -H "$TOKEN_H" -d @$2)
    RET=$?

    echo "$(echo $RES | jq)"
    return $RET
}

function get_token() {
    TOKEN=$(curl -k -s -X POST $SERVER:$PORT/authentication/login -H "$DEFAULT_H" -d @user.json | jq '.token' | sed 's/\"//g')
    TOKEN_H="Authorization:$TOKEN"
    echo "$TOKEN"
}

get_token
