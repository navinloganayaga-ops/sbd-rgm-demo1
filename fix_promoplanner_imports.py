import re

with open('src/components/PromoPlanner.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Save, useState } from 'react';", "import React, { useState } from 'react';")
content = content.replace("import { Save, \n  Check", "import {\n  Check")
content = content.replace("import { Save, \n  BarChart", "import {\n  BarChart")

# To be safe, just fix all "import { Save, "
content = content.replace("import { Save, ", "import { ")

# Then correctly add Save to lucide-react if it's not there
lucide_import_regex = re.compile(r"import\s*\{([^\}]*)\}\s*from\s*'lucide-react';")

def add_save(match):
    imports = match.group(1)
    if "Save" not in imports:
        imports += ", Save"
    return f"import {{{imports}}} from 'lucide-react';"

content = lucide_import_regex.sub(add_save, content)

with open('src/components/PromoPlanner.tsx', 'w') as f:
    f.write(content)
