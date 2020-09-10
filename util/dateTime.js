const moment = require('moment-timezone');

const dateTime = {
  GMT: {}
};

dateTime.buildWeekIdForDate = (date) => {
  if(!date) {
    throw new TypeError('Invalid argument date');
  }
  const _moment = moment(date, 'YYYY-MM-DD', true);
  if (!_moment.isValid()) {
    throw new TypeError('Invalid date format. Expected YYYY-MM-DD');
  }
  const startOfWeek = _moment.startOf('week');
  let year = startOfWeek.year();
  let month = startOfWeek.format("MM");
  let week = startOfWeek.week();

  if(month === "12" && week === 1){
    year += 1;
  }
  return `${year}-${week}`;
};

module.exports = dateTime;
