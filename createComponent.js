import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const [, , relativePath, componentName] = process.argv;

if (!relativePath || !componentName) {
  console.error(
    '❌ Укажите путь и имя компонента! Например: npm run сс pages/Home Button',
  );
  process.exit(1);
}

const componentDir = join(__dirname, 'src', relativePath, componentName);

if (existsSync(componentDir)) {
  console.error('❌ Компонент уже существует!');
  process.exit(1);
}

mkdirSync(componentDir, { recursive: true });

const files = {
  [`${componentName}.tsx`]: `import React from 'react';
import './${componentName}.scss';

interface Props {
  // опиши пропсы, если нужно
}

export const ${componentName}: React.FC<Props> = (props) => {
  return <div className="${componentName}"></div>;
};
`,
  [`${componentName}.scss`]: `// @use '../../styles/base/Vars.scss' as *;
// @use '../../styles/base/Mixins.scss' as *;

.${componentName} {
  // стили компонента
}
`,
  'index.ts': `export * from './${componentName}';`,
};

for (const [filename, content] of Object.entries(files)) {
  writeFileSync(join(componentDir, filename), content);
}
