#!/bin/bash
FILE="src/pages/Dashboard/layout/TechContent.jsx"

# Add imports if missing
if ! grep -q "import SubjectManager" "$FILE"; then
  sed -i '/import StudentEnrollment/a\
import SubjectManager from '\''../roles/SubjectManager'\'';' "$FILE"
fi

if ! grep -q "import ClassManager" "$FILE"; then
  sed -i '/import StudentEnrollment/a\
import ClassManager from '\''../roles/ClassManager'\'';' "$FILE"
fi

if ! grep -q "import SubjectAssignments" "$FILE"; then
  sed -i '/import StudentEnrollment/a\
import SubjectAssignments from '\''../roles/SubjectAssignments'\'';' "$FILE"
fi

if ! grep -q "import FormMasterAssignment" "$FILE"; then
  sed -i '/import StudentEnrollment/a\
import FormMasterAssignment from '\''../roles/FormMasterAssignment'\'';' "$FILE"
fi

# Add case statements before the default case
sed -i '/default:/i\
  case '\''add-subjects'\'':\
    return <SubjectManager />;\
\
  case '\''manage-classes'\'':\
    return <ClassManager />;\
\
  case '\''teacher-assignment'\'':\
    return <SubjectAssignments />;\
\
  case '\''form-master-assignment'\'':\
    return <FormMasterAssignment />;' "$FILE"

echo "VP Academic modules added to TechContent"
