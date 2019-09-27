#!/bin/bash

source lib.sh

echo "#"
echo "# CREATE"
echo "#"

# workout_name_empty.json
echo -e "\n# CREATE workout with empty name"
RES=$(POST_request "workout" "workout/workout_name_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_name_invalid.json
echo -e "\n# CREATE workout with invalid name"
RES=$(POST_request "workout" "workout/workout_name_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_empty.json
echo -e "\n# CREATE workout with empty description"
RES=$(POST_request "workout" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_invalid.json
echo -e "\n# CREATE workout with invalid description"
RES=$(POST_request "workout" "workout/workout_description_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_empty.json
echo -e "\n# CREATE workout with empty timestamp"
RES=$(POST_request "workout" "workout/workout_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_invalid.json
echo -e "\n# CREATE workout with invalid timestamp"
RES=$(POST_request "workout" "workout/workout_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_valid.json
echo -e "\n# CREATE workout valid workout"
RES=$(POST_request "workout" "workout/workout_valid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

##
## UPDATE
##

# workout_name_empty.json
echo -e "\n# UPDATE workout with empty name"
RES=$(POST_request "workout/1" "workout/workout_name_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_name_invalid.json
echo -e "\n# UPDATE workout with invalid name"
RES=$(POST_request "workout/1" "workout/workout_name_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_empty.json
echo -e "\n# UPDATE workout with empty description"
RES=$(POST_request "workout/1" "workout/workout_description_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_description_invalid.json
echo -e "\n# UPDATE workout with invalid description"
RES=$(POST_request "workout/1" "workout/workout_description_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_empty.json
echo -e "\n# UPDATE workout with empty timestamp"
RES=$(POST_request "workout/1" "workout/workout_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_timestamp_invalid.json
echo -e "\n# UPDATE workout with invalid timestamp"
RES=$(POST_request "workout/1" "workout/workout_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# workout_valid.json
echo -e "\n# UPDATE workout with valid workout"
RES=$(POST_request "workout/1" "workout/workout_valid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

echo ""
echo "# WORKOUT tests successful"
echo ""
