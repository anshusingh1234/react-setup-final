const __initEnvSettings = require("./setting/loadSetting").initializeEnvironmentSettings();
const tasks = require("./core/cron/tasks");

Object.keys(tasks).forEach(task => {
  // Start all the listed tasks
  console.log("Scheduling task: ", task);
  tasks[task].start();
});