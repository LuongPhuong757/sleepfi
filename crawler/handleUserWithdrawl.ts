import { connectDB } from "./database";
import AdminService from "./services/AdminService";
import NftService from "./services/NftService";
import WithdrawService from "./services/WithdrawService";
require('dotenv').config()

async function handleRequestWithdraw() {
  console.log('----- Start handle withdraw -----');
  try {
    await WithdrawService.getInstance().handleWithdraw();
  } catch (e) {
    console.log(`handle withdraw error`, e);
  }
  console.log(`----- Handle withdraw END -----`);
  setTimeout(handleRequestWithdraw, 10000);
}

async function handlUpdateWithdraw() {
  console.log('----- Start handle update balance -----');
  try {
    await WithdrawService.getInstance().handlUpdateWithdraw();
  } catch (e) {
    console.log(`handle update balance error`, e);
  }
  console.log(`----- Handle update balanceEND -----`);
  setTimeout(handlUpdateWithdraw, 12000);
}

async function updateNftOnChain() {
  console.log('----- Start update nft on chain -----');
  try {
    await NftService.getInstance().mintNft();
  } catch (e) {
    console.log(`Update nft on chain error`, e);
  }
  console.log(`----- Update nft on chain END -----`);
  setTimeout(updateNftOnChain, 60000);
}

async function sendAvaxToNewUser() {
  console.log('----- Start update nft on chain -----');
  try {
    await WithdrawService.getInstance().sendAvax();
  } catch (e) {
    console.log(`Update nft on chain error`, e);
  }
  console.log(`----- Send Avax user END -----`);
  setTimeout(sendAvaxToNewUser, 6000);
}

async function handleWithdrawForAdmin() {
  console.log('----- Start handle withdraw for Admin-----');
  try {
    await AdminService.getInstance().handleAdminWithdraw();
  } catch (e) {
    console.log(`handle withdraw error`, e);
  }
  console.log(`----- Handle withdraw END for Admin-----`);
  setTimeout(handleWithdrawForAdmin, 43200000);
}

const mainLoop = async function () {
//   await WithdrawService.getInstance().handleApprove();
  handleRequestWithdraw();
  handlUpdateWithdraw();
  updateNftOnChain();
  sendAvaxToNewUser();
  handleWithdrawForAdmin();
};

(async () => {
    await connectDB();
    await mainLoop();
})();
