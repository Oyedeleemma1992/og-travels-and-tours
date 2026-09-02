const fs = require('fs');
let content = fs.readFileSync('src/pages/KayakSearch.tsx', 'utf8');
content = content.replace("const handleSearch = async (e: React.FormEvent) => {", "const handleSearch = async (e: import('react').FormEvent) => {");
fs.writeFileSync('src/pages/KayakSearch.tsx', content);
