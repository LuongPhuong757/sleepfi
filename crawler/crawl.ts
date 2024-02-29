import BaseCrawler from './BaseCrawler';
import BedMintCrawler from './BedMintCrawler';
import CheckRemainTime from './checkRemainTime';
import { connectDB } from './database';
import JewelMintCrawler from './JewelMintCrawler';
import ScheduleReward from './scheduleReward';

(async () => {
  await connectDB();
  const stacking = new ScheduleReward().run.start();
  const crawler = new BaseCrawler().scan();
  const checkTxProcessing = new BaseCrawler().checkTxProcessing();
  const remainTime = await new CheckRemainTime().run.start();
  const bedCrawler = new BedMintCrawler().scan();
  const jewelCrawler = new JewelMintCrawler().scan();
  await Promise.all([
    crawler,
    remainTime,
    checkTxProcessing,
    stacking,
    // bedCrawler,
    // jewelCrawler,
  ]);
})();
