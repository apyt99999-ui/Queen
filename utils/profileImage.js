const { createCanvas, loadImage } = require("canvas");

module.exports = async (member, user, nextXP) => {
  const canvas = createCanvas(900, 350);
  const ctx = canvas.getContext("2d");

  // خلفية من الرابط مباشرة
  const bg = await loadImage("https://image2url.com/r2/default/images/1771107303883-ba908961-6dee-453a-a229-fca88127a391.jpg");
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
  ctx.fillText(`LEVEL ${user.level}`, 170, 120);

  // البار الكتابي
  const barW = 420, barH = 18;
  const textP = Math.min(user.textXP / nextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 220, barW, barH);
  ctx.fillStyle = `hsl(${textP*120}, 100%, 50%)`;
  ctx.fillRect(350, 220, barW * textP, barH);
  ctx.fillText("📖", 320, 235);

  // البار الصوتي
  const voiceP = Math.min(user.voiceXP / nextXP, 1);
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(350, 255, barW, barH);
  ctx.fillStyle = `hsl(${voiceP*120}, 100%, 50%)`;
  ctx.fillRect(350, 255, barW * voiceP, barH);
  ctx.fillText("🎧", 320, 270);

  // XP المتبقي
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`XP المتبقي: ${nextXP - user.xp}`, 350, 305);

  return canvas.toBuffer();
};
