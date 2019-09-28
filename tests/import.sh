#!/bin/bash

HOST="https://localhost"
PORT="3000"

TOKEN=$(curl -k -X POST $HOST:$PORT/authentication/login -d @user.json -H "Content-Type: application/json" | jq '.token' | sed 's/\"//g')
echo "$TOKEN"

#FILE="equipment.json"
#LOOP=$(($(grep -c '"equipment":' $FILE)-1))
#for i in $(seq 0 $LOOP); do
#    dataset="$(cat "$FILE" | jq ".[$i]")"
#
#    RES=$(curl -k -s $HOST:$PORT/equipment -X POST -H "Content-Type: application/json" -d "$dataset")
#    echo "$RES"
#    if [ "$(echo $RES | jq '.type' | sed 's/\"//g')"  == "ERROR" ]; then
#        exit 1
#    fi
#
#    echo ""
#    echo "########################################"
#    echo ""
#done


##
## Workout
##

FILE="workouts.json"
LOOP=$(($(grep -c '"name":' $FILE)-1))

ID=1
for i in $(seq 0 $LOOP); do
    dataset="$(cat "$FILE" | jq ".[$i]")"
    scoreNum=$(($(echo "$dataset" | grep -c '"score":')-1))
    # echo $dataset | jq

    RES=$(curl -k -s $HOST:$PORT/workout -X POST -H "Content-Type: application/json" -H "Authorization:$TOKEN" -d "$dataset")
    echo "$RES"
    if [ "$(echo $RES | jq '.type' | sed 's/\"//g')"  == "ERROR" ]; then
        exit 1
    fi

    for x in $(seq 0 $scoreNum); do
        score=$(echo "$dataset" | jq ".scores[$x]")
        score=$(echo "$score" | sed "s/\"score\"/\"workoutId\":\"$ID\", &/g")
        echo $score
        RES=$(curl -k -s $HOST:$PORT/score -X POST -H "Content-Type: application/json" -H "Authorization:$TOKEN" -d "$score")
        echo "$RES"
        if [ "$(echo $RES | jq '.type' | sed 's/\"//g')"  == "ERROR" ]; then
            exit 1
        fi
    done
    
    ID=$(($ID+1))

    echo ""
    echo "########################################"
    echo ""
done

exit 0
