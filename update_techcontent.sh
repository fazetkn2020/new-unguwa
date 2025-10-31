#!/bin/bash
FILE="src/pages/Dashboard/layout/TechContent.jsx"

# Add cases for VP Academic modules after the existing cases
awk '
/add-subjects/ { found = 1 }
found && /case/ { 
    print "  case '\''add-subjects'\'':"
    print "    return <SubjectManager />;"
    print ""
    print "  case '\''manage-classes'\'':"
    print "    return <ClassManager />;"
    print ""
    print "  case '\''teacher-assignment'\'':"
    print "    return <SubjectAssignments />;"
    print ""
    print "  case '\''form-master-assignment'\'':"
    print "    return <FormMasterAssignment />;"
    found = 0
    next
}
{ print }
' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

echo "TechContent updated with VP Academic modules"
