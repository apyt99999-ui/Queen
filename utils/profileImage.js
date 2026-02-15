const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

// سجل أي خطوط خاصة لو تحب
// registerFont(path.join(__dirname, "fonts", "YourFont.ttf"), { family: "CustomFont" });

// الدالة للرسم المستدير للبار
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// دالة رئيسية لصناعة الصورة
module.exports = async (member, userData) => {
  // قياسات الصورة، نفس بروبوت
  const width = 934;
  const height = 282;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ====== خلفية الصورة ======
  const background = await loadImage("https://image2url.com/r2/default/images/1771122425455-5c6e9af3-acc3-45b3-8f44-90321a4727b9.jpg");
  ctx.drawImage(background, 0, 0, width, height);

  // ====== معلومات المستخدم ======
  ctx.font = 'bold 36px Sans'; // أو استخدم خطك المسجل
  ctx.fillStyle = "#ffffff";
  ctx.fillText(member.user.username, 260, 80); // الاسم

  ctx.font = '28px Sans';
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Level: ${userData.level}`, 260, 120);
  ctx.fillText(`XP: ${userData.xp}`, 260, 160);

  // ====== البارات ======
  const barWidth = 550;
  const barHeight = 25;
  const barX = 260;
  let barY = 190;

  // helper function لرسم بار
  const drawBar = (current, max, y, color) => {
    const pct = Math.min(current / max, 1);
    // خلفية البار
    ctx.fillStyle = "#444"; 
    roundRect(ctx, barX, y, barWidth, barHeight, 12);
    ctx.fill();

    // البار الفعلي
    ctx.fillStyle = color;
    roundRect(ctx, barX, y, barWidth * pct, barHeight, 12);
    ctx.fill();
  };

  // توب الكتابي
  drawBar(userData.textXP, userData.textXPNeeded || 100, barY, "#ff7f50");
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Sans";
  ctx.fillText("Text XP", barX, barY - 5);

  // توب الصوتي
  barY += 50;
  drawBar(userData.voiceXP, userData.voiceXPNeeded || 100, barY, "#1e90ff");
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Sans";
  ctx.fillText("Voice XP", barX, barY - 5);

  // ====== صورة البروفايل ======
  const avatar = await loadImage(member.user.displayAvatarURL({ extension: "png" }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(130, height / 2, 110, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 20, height / 2 - 110, 220, 220);
  ctx.restore();

  return canvas.toBuffer();
};
