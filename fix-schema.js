import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve('./shared/schema.ts');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace all sql`(unixepoch())` with Date.now
content = content.replace(/sql`\(unixepoch\(\)\)`/g, 'Date.now');

fs.writeFileSync(schemaPath, content);
console.log('Schema file fixed successfully!'); 