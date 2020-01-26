#!/bin/bash

file_bak="workouts.csv.bak"
file_old="workouts.csv"
file_new="workouts.csv.new"
file_json="workouts.json.new"

rm -v $file_json
cp -v $file_bak $file_old

sed -zi 's/\n/\<br\>/g' $file_old
sed -i  's/;#<br>/\
/g' $file_old

cp -v $file_old $file_new

echo "[" >> $file_json
while read line; do 
    echo "{" >> $file_json
    echo "\"user_id\":\"0\"," >> $file_json
    NAME=$(echo "$line" | cut -d ";" -f1 | sed 's/"//g') 
    echo "\"name\":\"$NAME\"," >> $file_json
    TYPE=$(echo "$line" | cut -d ";" -f2 | sed 's/"//g') 
    echo "$line"
    WOD=$(echo "$line" | cut -d ";" -f3 | sed 's/"//g' | sed 's/<br>/\\n/g')
    echo "$WOD"
    echo "\"description\":\"$TYPE\n$WOD\"," >> $file_json
    echo "\"datetime\":\"0\"" >> $file_json
    echo "}," >> $file_json
done < $file_new
echo "]" >> $file_json
