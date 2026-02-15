const { createCanvas, loadImage } = require("canvas");
const fetch = require("node-fetch");

module.exports = async (member, user, nextXP) => {
  const canvas = createCanvas(1200, 450); // الحجم الجديد الكبير
  const ctx = canvas.getContext("2d");

  // خلفية من رابط الإنترنت
  const bgUrl = "https://image2url.com/r2/default/images/1771122425455-5c6e9af3-acc3-45b3-8f44-90321a4727b9.jpg";
  const response = await fetch(bgUrl);
  const buffer = await response.buffer();
  const bg = await loadImage(buffer);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // صورة العضو دائرية أكبر
  const avatar = await loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(120, 120, 100, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, 20, 20, 200, 200);
  ctx.restore();

  // اسم العضو
  ctx.fillStyle = "#ffffff";
  ctx.font = "36px Arial";
  ctx.fillText(member.user.username, 260, 100);

  // المستوى
  ctx.font = "28px Arial";
  ctx.fillText(`LEVEL ${user.level || 1}`, 260, 150);

  // حساب XP للفل القادم إذا لم يمرر nextXP
  const effectiveNextXP = nextXP || (user.xp ? Math.ceil(user.xp * 1.2) : 100);

  // البار الكتابي
  const barW = 500, barH = 30;
  const textP = Math.min((user.textXP || 0) / effectiveNextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 300, barW, barH);
  ctx.fillStyle = `hsl(${textP * 120}, 100%, 50%)`;
  ctx.fillRect(350, 300, barW * textP, barH);
  ctx.font = "28px Arial";
  ctx.fillText("📖", 320, 325);

  // البار الصوتي
  const voiceP = Math.min((user.voiceXP || 0) / effectiveNextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 350, barW, barH);
  ctx.fillStyle = `hsl(${voiceP * 120}, 100%, 50%)`;
  ctx.fillRect(350, 350, barW * voiceP, barH);
  ctx.fillText("🎧", 320, 375);

  // XP المتبقي
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ffffff";
  const xpLeft = (effectiveNextXP - (user.xp || 0));
  ctx.fillText(`XP المتبقي: ${xpLeft > 0 ? xpLeft : 0}`, 350, 420);

  return canvas.toBuffer();
};
