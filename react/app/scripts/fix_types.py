
import re

file_path = r"d:\rahi 2.0\react\app\src\integrations\supabase\types.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_relationships = False
brace_depth = 0

for line in lines:
    stripped = line.strip()
    
    # Detect start of Relationships block
    if "Relationships: [" in line:
        in_relationships = True
        new_lines.append(line)
        continue
        
    if in_relationships:
        if "]" in line and stripped.startswith("]"):
            in_relationships = False
            new_lines.append(line)
            continue
            
        # Inside Relationships, we are in an array of objects
        # We need to add commas to properties
        # Properties usually start with a key and end with a value
        # We should add a comma if it doesn't have one and isn't a closing brace
        
        if stripped == "{" or stripped == "},":
            new_lines.append(line)
        elif stripped.startswith("}"):
             # If it's a closing brace for an object in the array, it might need a comma if it's not the last one
             # But the file has objects separated by commas?
             # detailed check: line 622 is "}," -> correct
             new_lines.append(line)
        else:
            # It's a property line like 'foreignKeyName: "..."'
            # Add a comma if missing
            if stripped and not stripped.endswith(",") and not stripped.endswith("{") and not stripped.endswith("["):
                new_lines.append(line.rstrip() + ",\n")
            else:
                new_lines.append(line)
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed types.ts")
