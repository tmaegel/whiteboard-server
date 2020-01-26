#!/bin/bash

source lib.sh

#FILE="equipment.json"
#LOOP=$(($(grep -c '"equipment":' $FILE)-1))
#for i in $(seq 0 $LOOP); do
#    dataset="$(cat "$FILE" | jq ".[$i]")"
#
#    RES=$(curl -k -s $SERVER:$PORT/equipment -X POST -H "Content-Type: application/json" -d "$dataset")
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
    echo $dataset | jq

    RES=$(curl -k -s -w %{http_code} $SERVER:$PORT/workout -X POST -H "$DEFAULT_H" -H "$TOKEN_H" -d "$dataset" | jq)
    RET=$(get_ret "$RES")
    RES=$(get_res "$RES")
    if [ "$RET" == "201" ]; then echo "> OK: Workout created!" ; else echo "> ERROR: $RET" ; exit 1 ; fi

    for x in $(seq 0 $scoreNum); do
        score=$(echo "$dataset" | jq ".scores[$x]")
        score=$(echo "$score" | sed "s/\"score\"/\"workoutId\":\"$ID\", &/g")
        echo $score
        RES=$(curl -k -s -w %{http_code} $SERVER:$PORT/score -X POST -H "$DEFAULT_H" -H "$TOKEN_H" -d "$score" | jq)
        RET=$(get_ret "$RES")
        RES=$(get_res "$RES")
        echo "$RES"
        if [ "$RET" == "201" ]; then echo "> OK: Score created!" ; else echo "> ERROR: $RET" ; exit 1 ; fi
    done
    
    ID=$(($ID+1))
done

exit 0
