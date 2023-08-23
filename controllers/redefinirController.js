const nodemailer = require('nodemailer');
const crypto = require('crypto');
const RedefinirModel = require('../models/redefinirModel');
const shortUUID = require('short-uuid');


const providerConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
};


async function sendCodeByEmail(email, code, nome) {
  try {
    const transporter = nodemailer.createTransport(providerConfig);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Instruções para Redefinir sua Senha' ,
      text: `
    Prezado(a) ${nome},

    Esperamos que esta mensagem o encontre bem. Você solicitou a redefinição de senha para a sua conta em nosso sistema. Para completar o processo, siga as instruções abaixo:

    Passo 1: Acesse a página de redefinição de senha

    Clique no link a seguir para acessar a página de redefinição de senha: http://127.0.0.1:3300/redefinir/enter-code?email

    Passo 2: Insira o Código de Redefinição

    Na página de redefinição de senha, insira o seguinte código:
    ${code}

    Passo 3: Crie uma Nova Senha

    Após inserir o código de redefinição, você será direcionado(a) a criar uma nova senha segura para a sua conta. 
    Certifique-se de escolher uma senha que seja única e que contenha uma combinação de letras maiúsculas, minúsculas, números e caracteres especiais.

    Agradecemos a sua atenção e estamos à disposição para ajudar em caso de dúvidas ou problemas.

    Atenciosamente,
    SaborSelect.
  `,



    };

    await transporter.sendMail(mailOptions);
    console.log('Deu certo finalmente');
  } catch (error) {
    console.error('ACABA PELO AMOR DE DEUS', error);
  }
}




const showConfirmEmailPage = async (req, res) => {
  res.render('confirm-email');
};

function generateCode() {
  const translator = shortUUID();
  const code = translator.new();
  return code.substring(0, 6);
}

const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await RedefinirModel.findByEmail(email);

    if (user.length > 0) {
      const nome = user[0].nome;
      const code = generateCode();

      await RedefinirModel.updateUserCode(email, code);
      await sendCodeByEmail(email, code, nome); 

     
      req.session.redefinirEmail = email;

      res.redirect(`/redefinir/enter-code?email=${email}`);
    } else {
      console.log('Usuário não encontrado:', email);
      res.render('confirm-email', { error: 'E-mail não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.render('confirm-email', { error: 'Erro ao buscar usuário' });
  }
};

const showEnterCodePage = async (req, res) => {
  const { email, errorMessage } = req.query; // Adicione a variável errorMessage aqui
  res.render('enter-code', { email, errorMessage });
};

const verifyCode = async (req, res) => {
  const { email, code1, code2, code3, code4, code5, code6 } = req.body;
  const code = code1 + code2 + code3 + code4 + code5 + code6;

  try {
    const user = await RedefinirModel.findByEmail(email);

    if (user && user.length > 0 && user[0].codigo_confirmacao === code) {
      res.redirect(`/redefinir/reset-password?email=${email}`);
    } else {
      const errorMessage = 'Código incorreto. Tente novamente.';
      res.render('enter-code', { email, errorMessage }); // Passando a variável errorMessage para o template
    }
  } catch (error) {
    console.error(error);
    res.send('Erro ao verificar código');
  }
};





const showResetPasswordPage = async (req, res) => {
  const { email } = req.query;
  res.render('reset-password', { email });
};

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.render('reset-password', {
      email,
      error: 'As senhas não coincidem. Por favor, tente novamente.',
    });
  }

  try {
  
    await RedefinirModel.updateUserPassword(email, newPassword);
 
    console.log('senha atualizadaa ',email, newPassword);
    res.redirect('/login'); 
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.render('reset-password', {
      email,
      error: 'Erro ao redefinir senha. Por favor, tente novamente mais tarde.',
    });
  }
};
  
const resendCode = async (req, res) => {
  const { redefinirEmail } = req.session;

  if (!redefinirEmail) {
    return res.redirect('/');
  }

  try {
    const user = await RedefinirModel.findByEmail(redefinirEmail);

    if (user.length > 0) {
      const nome = user[0].nome;
      const code = generateCode();

      await RedefinirModel.updateUserCode(redefinirEmail, code);
      await sendCodeByEmail(redefinirEmail, code, nome);

      res.redirect(`/redefinir/enter-code?email=${redefinirEmail}`);
    } else {
      console.log('Usuário não encontrado:', redefinirEmail);
      res.render('confirm-email', { error: 'E-mail não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.render('confirm-email', { error: 'Erro ao buscar usuário' });
  }
};

module.exports = {
  showConfirmEmailPage,
  sendCode,
  showEnterCodePage,
  verifyCode,
  showResetPasswordPage,
  resetPassword,
  resendCode
};
