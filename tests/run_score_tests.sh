#!/bin/bash

source lib.sh

echo "#"
echo "# CREATE"
echo "#"

# score_note_empty.json
echo -e "\n# CREATE score with empty note"
RES=$(POST_request "score" "score/score_note_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_note_valid.json
echo -e "\n# CREATE score with valid note"
RES=$(POST_request "score" "score/score_note_valid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_note_invalid.json
echo -e "\n# CREATE score with invalid note"
RES=$(POST_request "score" "score/score_note_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_empty.json
echo -e "\n# CREATE score with empty score"
RES=$(POST_request "score" "score/score_score_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid01.json
echo -e "\n# CREATE score with invalid score 01"
RES=$(POST_request "score" "score/score_score_invalid01.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid02.json
echo -e "\n# CREATE score with invalid score 02"
RES=$(POST_request "score" "score/score_score_invalid02.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid03.json
echo -e "\n# CREATE score with invalid score 03"
RES=$(POST_request "score" "score/score_score_invalid03.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid01.json
echo -e "\n# CREATE score with valid score 01"
RES=$(POST_request "score" "score/score_score_valid01.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid02.json
echo -e "\n# CREATE score with valid score 02"
RES=$(POST_request "score" "score/score_score_valid02.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid03.json
echo -e "\n# CREATE score with valid score 03"
RES=$(POST_request "score" "score/score_score_valid03.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "201" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_timestamp_empty.json
echo -e "\n# CREATE score with empty timestamp"
RES=$(POST_request "score" "score/score_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_timestamp_invalid.json
echo -e "\n# CREATE score with invalid timestamp"
RES=$(POST_request "score" "score/score_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

echo "#"
echo "# CREATE"
echo "#"

# score_note_empty.json
echo -e "\n# UPDATE score with empty note"
RES=$(POST_request "score/1" "score/score_note_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_note_invalid.json
echo -e "\n# UPDATE score with invalid note"
RES=$(POST_request "score/1" "score/score_note_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_empty.json
echo -e "\n# UPDATE score with empty score"
RES=$(POST_request "score/1" "score/score_score_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid01.json
echo -e "\n# UPDATE score with invalid score 01"
RES=$(POST_request "score/1" "score/score_score_invalid01.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid02.json
echo -e "\n# UPDATE score with invalid score 02"
RES=$(POST_request "score/1" "score/score_score_invalid02.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_invalid03.json
echo -e "\n# UPDATE score with invalid score 03"
RES=$(POST_request "score/1" "score/score_score_invalid03.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid01.json
echo -e "\n# UPDATE score with valid score 01"
RES=$(POST_request "score/1" "score/score_score_valid01.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid02.json
echo -e "\n# UPDATE score with valid score 02"
RES=$(POST_request "score/1" "score/score_score_valid02.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_score_valid03.json
echo -e "\n# UPDATE score with valid score 03"
RES=$(POST_request "score/1" "score/score_score_valid03.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_timestamp_empty.json
echo -e "\n# UPDATE score with empty timestamp"
RES=$(POST_request "score/1" "score/score_timestamp_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# score_timestamp_invalid.json
echo -e "\n# UPDATE score with invalid timestamp"
RES=$(POST_request "score/1" "score/score_timestamp_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

echo ""
echo "# SCORE tests successful"
echo ""
