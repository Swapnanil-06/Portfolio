import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','story.css','script.js','project-widgets.js','story.js','favicon.svg']) await copyFile(file,`dist/${file}`);
console.log('Static portfolio built in dist/');
