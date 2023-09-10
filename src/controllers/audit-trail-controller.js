const auditTrail = require('../models/audit-trial.js');
module.exports = (req, res) => {
   res.status(200).json({
     status: 'SUCCESS',
     data: auditTrail
   })
}