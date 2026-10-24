const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '..', 'node_modules', '@mantine', 'core', 'styles.css'),
  path.join(__dirname, '..', 'node_modules', '@mantine', 'core', 'styles.layer.css')
];

filesToPatch.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the nested calc inside var() fallback that causes CRA's postcss-calc to crash
    const before = 'calc(var(--app-shell-resize-handle-size, calc(0.375rem * var(--mantine-scale))) / -2)';
    const after = 'calc(-0.5 * var(--app-shell-resize-handle-size, 0.375rem * var(--mantine-scale)))';

    if (content.includes(before)) {
      content = content.split(before).join(after);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[fix-mantine] Successfully patched postcss-calc compatibility in ${path.basename(filePath)}`);
    } else {
      console.log(`[fix-mantine] ${path.basename(filePath)} is already compatible.`);
    }
  }
});
