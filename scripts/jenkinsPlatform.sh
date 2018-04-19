#!/bin/bash
set -e

echo "[$(date +%FT%T)+00:00] Launching flood"
flood_uuid=$(curl --silent -u "$FLOOD" -X POST https://api.flood.io/floods \
  -F "flood[tool]=jmeter" \
  -F "flood[threads]=$Threads" \
  -F "flood[rampup]=$Rampup" \
  -F "flood[duration]=$Duration" \
  -F "flood[privacy]=public" \
  -F "flood[project]=Platform" \
  -F "flood[name]=Jenkins Test" \
  -F "flood_files[]=@platformLoad.jmx" \
  -F "flood_files[]=@psrCSV.txt" \
  -F "flood_files[]=@webhooksCSV.txt" \
  -F "flood_files[]=@CHKITEMS" \
  -F "flood_files[]=@ADJTIME" \
  -F "flood_files[]=@AlohaFile1MB.txt" \
  -F "flood[grids][][infrastructure]=demand" \
  -F "flood[grids][][instance_quantity]=$Nodes" \
  -F "flood[grids][][region]=us-east-1" \
  -F "flood[grids][][instance_type]=m4.xlarge" \
  -F "flood[grids][][stop_after]=$Stop_grid_after")

echo "$flood_uuid" > FloodResponse.txt
