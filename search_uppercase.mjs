import fs from 'fs';
import path from 'path';

function searchInFiles(dir, regex) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchInFiles(fullPath, regex);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (regex.test(content)) {
                console.log(`Found in: ${fullPath}`);
                const lines = content.split('\n');
                lines.forEach((line, i) => {
                    if (regex.test(line)) {
                        console.log(`  ${i + 1}: ${line}`);
                    }
                });
            }
        }
    }
}

searchInFiles('./src', /\.[A-Z]/);
