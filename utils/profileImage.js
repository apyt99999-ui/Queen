const { createCanvas, loadImage } = require("canvas");
const fetch = require("node-fetch");

module.exports = async (member, user, nextXP) => {
  const canvas = createCanvas(1200, 450);
  const ctx = canvas.getContext("2d");

  // تحميل الخلفية
  const bgUrl = "https://image2url.com/r2/default/images/1771122425455-5c6e9af3-acc3-45b3-8f44-90321a4727b9.jpg";
  const response = await fetch(bgUrl);
  const buffer = await response.buffer();
  const bg = await loadImage(buffer);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // صورة العضو دائرية
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
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 4;
  ctx.fillText(member.user.username, 260, 100);

  // المستوى
  ctx.font = "28px Arial";
  ctx.fillText(`LEVEL ${user.level || 1}`, 260, 150);

  // حساب XP للفل القادم
  const effectiveNextXP = nextXP || (user.xp ? Math.ceil(user.xp * 1.2) : 100);

  // دالة لرسم البارات المدورة مع Gradient
  const drawBar = (x, y, w, h, progress, emoji) => {
    // خلفية البار
    ctx.fillStyle = "#2c2f33";
    ctx.roundRect(x, y, w, h, 15);
    ctx.fill();

    // Gradient للبار
    const grd = ctx.createLinearGradient(x, y, x + w, y);
    grd.addColorStop(0, "#00ffcc");
    grd.addColorStop(1, "#0099ff");

    ctx.fillStyle = grd;
    ctx.roundRect(x, y, w * progress, h, 15);
    ctx.fill();

    // رسم الإيموجي
    ctx.font = `${h}px Arial`;
    ctx.fillText(emoji, x - h - 10, y + h - 4);
  };

  // البار الكتابي
  const textP = Math.min((user.textXP || 0) / effectiveNextXP, 1);
  drawBar(350, 300, 500, 35, textP, "📖");

  // البار الصوتي
  const voiceP = Math.min((user.voiceXP || 0) / effectiveNextXP, 1);
  drawBar(350, 370, 500, 35, voiceP, "🎧");

  // XP المتبقي
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`XP المتبقي: ${Math.max(0, effectiveNextXP - (user.xp || 0))}`, 350, 440);

  return canvas.toBuffer();
};

// Canvas extension لرسم مستطيل مدور
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
};
