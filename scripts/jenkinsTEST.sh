#!/bin/bash
set -e

echo "HELLO JENKINS!"
echo "$PWD"

apiVersion=$(curl https://api.bodhi-stg.io/version)

#gridID=$(curl "https://api.flood.io/grids" -X POST -H "Accept: application/vnd.flood.v2+json" -u "KJ9BzL_KLbX4f__ivX3P:x" -F "grid[region]=us-east-1" -F "grid[infrastructure]=demand" -F "grid[instance_type]=m4.xlarge" -F "grid[instance_quantity]=1" -F "grid[stop_after]=5")
#grids=$(curl "https://api.flood.io/grids" -H "Accept: application/vnd.flood.v2+json" -u "KJ9BzL_KLbX4f__ivX3P:x")
#floods=$(curl "https://api.flood.io/api/floods" -H "Accept: application/vnd.flood.v2+json" -u "KJ9BzL_KLbX4f__ivX3P:x")

#echo "$gridID"
#echo "$grids"
#echo "$floods"
echo "$apiVersion"

stat=$(curl --silent --user KJ9BzL_KLbX4f__ivX3P:x https://api.flood.io/floods/64oTmfc3JRSmmfk1kjoiuA)

regStat="running"


echo $stat | grep -q $regStat
echo $?
echo $stat

if [[ $stat == *"running"* ]]; then
  echo "It's there!"
fi

STAT=$(curl --silent --user $FLOOD https://api.flood.io/floods/64oTmfc3JRSmmfk1kjoiuA)
while [[ $STAT == *"running"* ]]; do
  STAT=$(curl --silent --user $FLOOD https://api.flood.io/floods/64oTmfc3JRSmmfk1kjoiuA)
  sleep 60
  echo "[$(date +%FT%T)+00:00] Waiting for flood 64oTmfc3JRSmmfk1kjoiuA to finish"
done

echo "[$(date +%FT%T)+00:00] Flood $flood_uuid has finished"

report=$(curl -u $FLOOD https://api.flood.io/floods/64oTmfc3JRSmmfk1kjoiuA/report)
result=$(curl -u $FLOOD https://api.flood.io/floods/64oTmfc3JRSmmfk1kjoiuA/results)

echo $report

echo "******************************************************************"
echo "******************************************************************"
echo "******************************************************************"

echo $result



