#!/bin/bash
# Export all the interesting collections from the DB.
#
# Uses a config.txt file formatted like so:
#
# password: <password>
# uri: <mongodb+srv://...>
#

for COLLECTION in gamestate gearOrders invites removed_users sponsors teams tickets transactions users; do
    mongoexport --config=config.txt --username tmp-noah \
                --db greatpuzzlehunt --collection $COLLECTION \
                --type json -o "${COLLECTION}.json";
done
