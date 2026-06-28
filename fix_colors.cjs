const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/from-indigo-500 1-purple-500 1-emerald-600/g, "from-indigo-500 via-emerald-500 to-emerald-600");
  content = content.replace(/from-indigo-950\/60 1-purple-950\/40 1-emerald-950\/60/g, "from-indigo-950/60 via-emerald-950/40 to-emerald-950/60");
  content = content.replace(/from-indigo-500\/10 1-purple-500\/10/g, "from-indigo-500/10 to-emerald-500/10");
  
  content = content.replace(/border 1-purple/g, "border border-emerald");
  content = content.replace(/border 1-emerald/g, "border border-emerald");

  content = content.replace(/shadow-md 1-purple/g, "shadow-md shadow-emerald");
  content = content.replace(/shadow-lg 1-purple/g, "shadow-lg shadow-emerald");
  content = content.replace(/shadow-md 1-emerald/g, "shadow-md shadow-emerald");
  content = content.replace(/shadow-lg 1-emerald/g, "shadow-lg shadow-emerald");

  content = content.replace(/hover:1-purple-500\/20/g, "hover:bg-emerald-500/20");
  content = content.replace(/hover:1-purple-500/g, "hover:bg-emerald-500");
  content = content.replace(/hover:1-purple-400/g, "hover:text-emerald-400");
  content = content.replace(/hover:1-emerald-500\/20/g, "hover:bg-emerald-500/20");
  content = content.replace(/hover:1-emerald-500/g, "hover:bg-emerald-500");
  content = content.replace(/hover:1-emerald-400/g, "hover:text-emerald-400");

  content = content.replace(/1-purple-(\d{2,3})\/(\d{2})/g, "bg-emerald-$1/$2");
  content = content.replace(/1-emerald-(\d{2,3})\/(\d{2})/g, "bg-emerald-$1/$2");

  content = content.replace(/1-purple-(\d{2,3}) text-white/g, "bg-emerald-$1 text-white");
  content = content.replace(/1-emerald-(\d{2,3}) text-white/g, "bg-emerald-$1 text-white");

  content = content.replace(/(w-\d+ h-\d+.*?)1-purple-(\d{2,3})/g, "$1text-emerald-$2");
  content = content.replace(/(w-\d+ h-\d+.*?)1-emerald-(\d{2,3})/g, "$1text-emerald-$2");

  content = content.replace(/1-purple-/g, "text-emerald-");
  content = content.replace(/1-emerald-/g, "text-emerald-");
  
  fs.writeFileSync(file, content);
});
console.log("Fixed classes");
