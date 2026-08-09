#!/bin/bash
# OSRM Setup Helper for Cascade
# ============================================================
# 1. Download your city extract from https://download.geofabrik.de/
#    Example for Mumbai/Maharashtra:
#    wget https://download.geofabrik.de/asia/india/maharashtra-latest.osm.pbf \
#         -O server/osrm-data/region.osm.pbf
#
# 2. Pre-process (one-time steps):
#    docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
#      osrm-extract -p /opt/car.lua /data/region.osm.pbf
#    docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
#      osrm-partition /data/region.osrm
#    docker run -t -v $(pwd)/server/osrm-data:/data osrm/osrm-backend \
#      osrm-customize /data/region.osrm
#
# 3. Run the routing server:
docker run --rm -p 5000:5000 \
  -v "$(pwd)/server/osrm-data:/data" \
  osrm/osrm-backend \
  osrm-routed --algorithm mld /data/region.osrm
