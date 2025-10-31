#!/bin/bash
FILE="src/config/dashboardConfig.js"

# Create backup
cp "$FILE" "$FILE.backup"

# Replace VP Academic modules section
awk '
/"VP Academic":/ { in_vp_academic = 1 }
in_vp_academic && /modules: \[/ { 
    print "      modules: ["
    print "        { id: \"add-subjects\", label: \"Add Subjects\", icon: \"📝\" },"
    print "        { id: \"manage-classes\", label: \"Manage Classes\", icon: \"🏫\" },"
    print "        { id: \"teacher-assignment\", label: \"Teacher Assignment\", icon: \"👨‍🏫\" },"
    print "        { id: \"form-master-assignment\", label: \"Form Master Assignment\", icon: \"🎯\" }"
    next
}
in_vp_academic && /\]/ && modules_printed { in_vp_academic = 0; modules_printed = 0 }
{ print }
' "$FILE.backup" > "$FILE"

echo "VP Academic modules updated successfully"
