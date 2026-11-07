import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','story.css','desk.css','identity.css','readability.css','responsive.css','script.js','project-widgets.js','overview.js','desk.js','profile-carousel.js','responsive.js','favicon.svg']) await copyFile(file,`dist/${file}`);
console.log('Static portfolio built in dist/');
