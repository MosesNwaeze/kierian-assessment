const jwt = require('jsonwebtoken');
const users = require('../models/users.js');
const otps = require('../models/otp.js');
const wallets = require('../models/wallet.js');
const usersAuthenticated = require('../models/user-authentication.js');
const auditTrail = require('../models/audit-trial.js');
const jwtToken = require('../middlewares/jwt-auth.js')
require('dotenv').config();

module.exports = async (req,res)=>{
   let {walletId, amount, pin, otp} = req.params;
   walletId = Number(walletId);
   amount = Number(amount);
   pin = Number(pin);
   otp = Number(otp)

    try{
       const token = await jwtToken(req);

       const verifiedToken = jwt.verify(token, process.env.JWT_SECRETE);
       const {userId} = verifiedToken;

       if(!userId){
        return res.status(401).json('Unauthorized');
       }

       if(typeof walletId !== 'number' || typeof amount !== 'number' || typeof pin !== 'number' || typeof otp !== 'number'){
         return res.status(403).json('Forbidden');
       }

      const senderWallet = wallets.find(wallet => wallet.userid === userId && wallet.userPin === pin);
      if(!senderWallet){
         return res.status(404).json('Wallet not found');
      }
      else if(senderWallet.currentAmount < amount){
         return res.status(403).json('Wallet balance is low');
      }


      const userOTP = otps.find(otp => otp.userId === userId && otp.expired === false);
      if(!userOTP){
         return res.status(404).json('OTP not found');
      }else if(userOTP.pin !== otp){
         return res.status(403).json('OTP not correct');
      }

      const receiverWallet = wallets.find(wallet => wallet.id === walletId);
      if(!receiverWallet){
         return res.status(404).json('Receiver wallet not found');
      }

      senderWallet.currentAmount = senderWallet.currentAmount - amount;
      const walletIndex = wallets.findIndex(wallet => wallet.userid === userId && wallet.userPin === pin);
      wallets.splice(walletIndex,1,senderWallet)



      receiverWallet.currentAmount = receiverWallet.currentAmount + amount;
      const receiverWalletIndex = wallets.findIndex(wallet => wallet.id === walletId);
      wallets.splice(receiverWalletIndex,1,receiverWallet)


      // audit trail here
      const activityLog = {
         userId: userId,
         activityType: 'CASH_TRANSFER',
         activityTime: new Date().toLocaleString(),
         destinationWalletId: walletId,
         sourceWalletId: senderWallet.id,
         transactionAmount: `#${amount}`,
         status: 'SUCCESSFUL'
      }
      auditTrail.push(activityLog);

      const loginUser = users.find(user => user.userId === userId);
      const receiverUser = users.find(user => user.userId === receiverWallet.userid)
      return res.status(200).json({
      status: 'SUCCESSFUL',
      message: `Hello ${loginUser.firstName} ${loginUser.lastName}, #${amount} has been deducted from your wallet and transferred to ${receiverUser.firstName} ${receiverUser.lastName} with walletId ${receiverWallet.id}`,
      balance: `#${senderWallet.currentAmount}`
      })

    }catch(e){
       console.log("error", e)
    }

}