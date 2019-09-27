#!/bin/bash

source lib.sh

echo "#"
echo "# AUTHENTICATION"
echo "#"

# user_name_empty.json
echo -e "\n# AUTHENTICATION user with empty name"
RES=$(POST_request "authentication/login" "auth/user_name_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# user_name_invalid.json
echo -e "\n# AUTHENTICATION user with invalid name"
RES=$(POST_request "authentication/login" "auth/user_name_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "403" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# user_password_empty.json
echo -e "\n# AUTHENTICATION user with empty password"
RES=$(POST_request "authentication/login" "auth/user_password_empty.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "400" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# user_password_invalid.json
echo -e "\n# AUTHENTICATION user with invalid password"
RES=$(POST_request "authentication/login" "auth/user_password_invalid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "403" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

# user_valid.json
echo -e "\n# AUTHENTICATION valid user"
RES=$(POST_request "authentication/login" "auth/user_valid.json")
RET=$(get_ret "$RES")
RES=$(get_res "$RES")
echo "$RES"
if [ "$RET" == "200" ]; then echo "> OK" ; else echo "> ERROR: $RET" ; exit 1 ; fi

echo ""
echo "# AUTH tests successful"
echo ""
