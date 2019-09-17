#!/bin/bash

source lib.sh

# workout.json

echo "#"
echo "# CREATE"
echo "#"

# workout.json
echo -e "\n# CREATE valid"
RES=$(POST_request "workout" "workout/workout.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_name_empty.json
echo -e "\n# CREATE empty name"
RES=$(POST_request "workout" "workout/workout_name_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_name_invalid.json
echo -e "\n# CREATE invalid name"
RES=$(POST_request "workout" "workout/workout_name_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_empty.json
echo -e "\n# CREATE empty description"
RES=$(POST_request "workout" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_invalid.json
echo -e "\n# CREATE invalid description"
RES=$(POST_request "workout" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_empty.json
echo -e "\n# CREATE empty timestamp"
RES=$(POST_request "workout" "workout/workout_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_invalid.json
echo -e "\n# CREATE invalid timestamp"
RES=$(POST_request "workout" "workout/workout_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

##
## UPDATE
##

# workout_name_empty.json
echo -e "\n# UPDATE empty name"
RES=$(POST_request "workout/1" "workout/workout_name_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_name_invalid.json
echo -e "\n# UPDATE invalid name"
RES=$(POST_request "workout/1" "workout/workout_name_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_empty.json
echo -e "\n# UPDATE empty description"
RES=$(POST_request "workout/1" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_invalid.json
echo -e "\n# UPDATE invalid description"
RES=$(POST_request "workout/1" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_empty.json
echo -e "\n# UPDATE empty timestamp"
RES=$(POST_request "workout/1" "workout/workout_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_invalid.json
echo -e "\n# UPDATE invalid timestamp"
RES=$(POST_request "workout/1" "workout/workout_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout.json
echo -e "\n# UPDATE valid"
RES=$(POST_request "workout/1" "workout/workout.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

echo ""
echo "# WORKOUT tests successful"
echo ""
