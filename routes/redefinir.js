const express = require('express');
const router = express.Router();
const redefinirController = require('../controllers/redefinirController');

router.get('/confirm-email', redefinirController.showConfirmEmailPage);
router.post('/send-code', redefinirController.sendCode);
router.get('/enter-code', redefinirController.showEnterCodePage);
router.post('/verify-code', redefinirController.verifyCode);
router.get('/reset-password', redefinirController.showResetPasswordPage);
router.post('/reset-password', redefinirController.resetPassword); 
router.post('/reenviar-codigo', redefinirController.resendCode);
module.exports = router;