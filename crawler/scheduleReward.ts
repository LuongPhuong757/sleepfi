import { ScheduleRewardService } from './services/ScheduleReward';
const CronJob = require('cron').CronJob;
export default class ScheduleReward {
  public run = new CronJob(
    '0 */4 * * *',
    async () => {
      await new ScheduleRewardService().stackEveryDay();
    },
    null,
    true
  );
}
