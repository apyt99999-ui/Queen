const { createCanvas, loadImage } = require("canvas");

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

module.exports = async (member, user, config = {}) => {
  // ===== مقاس قريب جداً من بروبوت =====
  const WIDTH = 1100;
  const HEIGHT = 360;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // ===== الخلفية =====
  const bg = await loadImage(
    config.background ||
    "https://image2url.com/r2/default/images/1771122425455-5c6e9af3-acc3-45b3-8f44-90321a4727b9.jpg"
  );
  ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

  // ===== صورة العضو (دائرية يسار) =====
  const avatar = await loadImage(
    member.user.displayAvatarURL({ extension: "png", size: 256 })
  );
  ctx.save();
  ctx.beginPath();
  ctx.arc(150, 180, 115, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, 35, 65, 230, 230);
  ctx.restore();

  // ===== الاسم =====
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px Arial";
  ctx.fillText(member.user.username, 320, 85);

  // ===== إعدادات البارات =====
  const BAR_X = 460;
  const BAR_W = 520;
  const BAR_H = 28;
  const RADIUS = 14;

  const textXP = user.textXP || 0;
  const voiceXP = user.voiceXP || 0;
  const nextXP = user.nextXP || 174;

  // ===== البار الكتابي =====
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial";
  ctx.fillText("LVL", 320, 160);
  ctx.font = "bold 34px Arial";
  ctx.fillText(user.textLevel || user.level || 0, 320, 195);

  ctx.font = "28px Arial";
  ctx.fillText("💬", 370, 192);

  ctx.font = "22px Arial";
  ctx.fillText(`Rank: #${user.textRank || 1}`, BAR_X, 150);
  ctx.fillText(`Total: ${textXP}`, BAR_X + 360, 150);

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(ctx, BAR_X, 170, BAR_W, BAR_H, RADIUS);
  ctx.fill();

  ctx.fillStyle = "#d8ccff";
  roundRect(
    ctx,
    BAR_X,
    170,
    BAR_W * Math.min(textXP / nextXP, 1),
    BAR_H,
    RADIUS
  );
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText(`${textXP} / ${nextXP}`, BAR_X + 210, 191);

  // ===== البار الصوتي =====
  ctx.font = "bold 22px Arial";
  ctx.fillText("LVL", 320, 245);
  ctx.font = "bold 34px Arial";
  ctx.fillText(user.voiceLevel || 0, 320, 280);

  ctx.font = "28px Arial";
  ctx.fillText("🎤", 370, 278);

  ctx.font = "22px Arial";
  ctx.fillText(`Rank: #${user.voiceRank || 1}`, BAR_X, 235);
  ctx.fillText(`Total: ${voiceXP}`, BAR_X + 360, 235);

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(ctx, BAR_X, 255, BAR_W, BAR_H, RADIUS);
  ctx.fill();

  ctx.fillStyle = "#bfcbff";
  roundRect(
    ctx,
    BAR_X,
    255,
    BAR_W * Math.min(voiceXP / nextXP, 1),
    BAR_H,
    RADIUS
  );
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText(`${voiceXP} / Max`, BAR_X + 215, 276);

  return canvas.toBuffer();
};
