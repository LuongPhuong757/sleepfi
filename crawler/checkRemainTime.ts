import { remaintingTime } from "./services/checkRemaintingTime";

const CronJob = require('cron').CronJob;
export default class CheckRemainTime {
  public run = new CronJob(
    '0 */4 * * *',
    async () => {
      await new remaintingTime().checkRemaintingTime();
    },
    null,
    true
  );
}
