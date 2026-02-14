module.exports = (xp) => {
  const xpTable = require("./xpNeeded");
  const levels = Object.keys(xpTable).map(Number).sort((a,b)=>a-b);
  let level = 0;
  for (let l of levels) {
    if (xp >= xpTable[l]) level = l;
    else break;
  }
  return level;
};
