const { createCanvas, loadImage } = require("canvas");

module.exports = async (member, user, nextXP) => {
  const canvas = createCanvas(900, 350);
  const ctx = canvas.getContext("2d");

  // خلفية
  const bg = await loadImage("./assets/background.png");
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // صورة العضو دائرية أعلى يسار
  const avatar = await loadImage(member.user.displayAvatarURL({ extension: "png", size: 256 }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(90, 90, 55, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, 35, 35, 110, 110);
  ctx.restore();

  // اسم العضو
  ctx.fillStyle = "#ffffff";
  ctx.font = "28px Arial";
  ctx.fillText(member.user.username, 170, 85);

  // المستوى
  ctx.font = "22px Arial";
  ctx.fillText(`LEVEL ${user.level || 1}`, 170, 120);

  // إذا ما تم تمرير nextXP، نحسبه تلقائياً
  const effectiveNextXP = nextXP || (user.xp ? Math.ceil(user.xp * 1.2) : 100);

  // البار الكتابي
  const barW = 420, barH = 20;
  const textP = Math.min((user.textXP || 0) / effectiveNextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 220, barW, barH);
  ctx.fillStyle = `hsl(${textP * 120}, 100%, 50%)`; // ديناميكي أخضر-أحمر
  ctx.fillRect(350, 220, barW * textP, barH);
  ctx.fillText("📖", 320, 235);

  // البار الصوتي
  const voiceP = Math.min((user.voiceXP || 0) / effectiveNextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 255, barW, barH);
  ctx.fillStyle = `hsl(${voiceP * 120}, 100%, 50%)`;
  ctx.fillRect(350, 255, barW * voiceP, barH);
  ctx.fillText("🎧", 320, 270);

  // XP المتبقي
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffffff";
  const xpLeft = (effectiveNextXP - (user.xp || 0));
  ctx.fillText(`XP المتبقي: ${xpLeft > 0 ? xpLeft : 0}`, 350, 305);

  return canvas.toBuffer();
};
