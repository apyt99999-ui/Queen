const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("0 0 * * *", async () => { await User.updateMany({}, { dailyXP: 0 }); });
cron.schedule("0 0 * * 0", async () => { await User.updateMany({}, { weeklyXP: 0 }); });
cron.schedule("0 0 1 * *", async () => { await User.updateMany({}, { monthlyXP: 0 }); });
