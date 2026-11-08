import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','story.css','desk.css','identity.css','readability.css','responsive.css','scan.css','motion.css','project-browser.css','project-studio.css','project-atlas.css','live-projects.css','native-chat.css','native-chat.js','live-projects.js','project-atlas.js','project-studio.js','motion.js','script.js','project-widgets.js','overview.js','desk.js','profile-carousel.js','responsive.js','favicon.svg']) await copyFile(file,`dist/${file}`);
await mkdir('dist/assets',{recursive:true});
await copyFile('assets/agent-arena-preview.png','dist/assets/agent-arena-preview.png');
await copyFile('assets/gradio-client-2.7.2.js','dist/assets/gradio-client-2.7.2.js');
await copyFile('assets/gradio-client-LICENSE.txt','dist/assets/gradio-client-LICENSE.txt');
console.log('Static portfolio built in dist/');
