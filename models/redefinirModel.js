const nodemailer = require("nodemailer");
const RedefinirModel = require("../models/redefinirModel");
const shortUUID = require("short-uuid");

const providerConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(providerConfig);

async function sendCodeByEmail(email, code, nome, sobrenome) {
  try {
    const encodedEmail = encodeURIComponent(email);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Instruções para Redefinir sua Senha",
      html: `
      <html style=" height: auto; min-height:40rem ;">
      
      <head>
      </head>
      <body style="border: solid 1px #969696; background-color: #ffffff; height: auto;">
        <div style="width: auto; min-height: 120px; background: url('https://img.freepik.com/free-photo/top-view-table-full-delicious-food-assortment_23-2149141342.jpg?w=1060&t=st=1693611790~exp=1693612390~hmac=3a55fbb758a760f85fed691aa11eddf64f96ddbf65201ec6ec677c252d0c36bc'); background-size: cover;"></div>
        <br>
        <h1 style="text-align: center; color: #d8582e;">Redefinição de senha:</h1>
        <p style="text-align: center;">Prezado(a) ${nome} ${sobrenome},</p>
      <div style="margin: 1rem 3rem; ">
      <p >Esperamos que esta mensagem o encontre bem. Você solicitou a redefinição de senha para a sua conta em nosso sistema. Para completar o processo, siga as instruções abaixo:</p>
      
        <p><span style="color: #d54312;">Passo 1:</span> Acesse a página de redefinição de senha</p>
      
        <p>Clique no link a seguir para acessar a página de redefinição de senha: <a style="color: #d54312;" href="https://saborselect.onrender.com/redefinir/enter-code?email=${encodedEmail}">Clique para Redefinir Senha</a></p>
      
        <p><span style="color: #d54312;">Passo 2:</span> Insira o Código de Redefinição</p>
      
        <p>Na página de redefinição de senha, insira o seguinte código: 
          <br><br><br><br>
          <div style="width: 100%; height: 50px; display: flex; align-items: center; justify-content: center;">
          <div style="border: solid 2px #ffffff; box-shadow: 0px 4px 15px 0px rgba(255, 34, 0, 0.74); display: flex; align-items: center; justify-content: center; text-align: center; background-color: #ff4000fb; width: 100%; height: 4rem; border-radius: 10px; font-size: 28px; color: #ffffff;">
            <div style="margin:1% 45%;">${code}</div>
          </div>
        </div>
        <br><br>
         </p>
      
        <p><span style="color: #d54312;">Passo 3:</span> Crie uma Nova Senha</p>
      
        <p>Após inserir o código de redefinição, você será direcionado(a) a criar uma nova senha segura para a sua conta. Certifique-se de escolher uma senha que seja única e que contenha uma combinação de letras maiúsculas, minúsculas, números e caracteres especiais.</p>
      
        <p>Agradecemos a sua atenção e estamos à disposição para ajudar em caso de dúvidas ou problemas.</p>
        <br>
        <p>Atenciosamente, <span style="color: #d54312; font-weight: 600; font-size: 18px;">SaborSelect</span>.</span></p></div>
      <div style="background-color: #e17e5d; height: 40px;"></div>
      </body>
      </html> 
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar o email:", error);
  }
}

const showConfirmEmailPage = async (req, res) => {
  res.render("confirm-email");
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
      const sobrenome = user[0].sobrenome;
      const code = generateCode();
      await RedefinirModel.updateUserCode(email, code);
      await sendCodeByEmail(email, code, nome, sobrenome);
      req.session.redefinirEmail = email;
      res.redirect(`/redefinir/enter-code?email=${email}`);
    } else {
      console.log("Usuário não encontrado:", email);
      res.render("confirm-email", { error: "E-mail não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.render("confirm-email", { error: "Erro ao buscar usuário" });
  }
};

const showEnterCodePage = async (req, res) => {
  const { email, errorMessage } = req.query;
  res.render("enter-code", { email, errorMessage });
};
const verifyCode = async (req, res) => {
  const { email, code1, code2, code3, code4, code5, code6 } = req.body;
  const code = code1 + code2 + code3 + code4 + code5 + code6;
  try {
    const user = await RedefinirModel.findByEmail(email);

    if (user && user.length > 0 && user[0].codigo_confirmacao === code) {
      res.redirect(`/redefinir/reset-password?email=${email}`);
    } else {
      const errorMessage = "Código incorreto. Tente novamente.";
      res.render("enter-code", { email, errorMessage });
    }
  } catch (error) {
    console.error(error);
    res.send("Erro ao verificar código");
  }
};

const showResetPasswordPage = async (req, res) => {
  const { email } = req.query;
  res.render("reset-password", { email });
};

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.render("reset-password", {
      email,
      error: "As senhas não coincidem. Por favor, tente novamente.",
    });
  }
  try {
    await RedefinirModel.updateUserPassword(email, newPassword);

    console.log("senha atualizadaa ", email, newPassword);
    res.redirect("/login");
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.render("reset-password", {
      email,
      error: "Erro ao redefinir senha. Por favor, tente novamente mais tarde.",
    });
  }
};

const resendCode = async (req, res) => {
  const { redefinirEmail } = req.session;
  if (!redefinirEmail) {
    return res.redirect("/");
  }
  try {
    const user = await RedefinirModel.findByEmail(redefinirEmail);

    if (user.length > 0) {
      const nome = user[0].nome;
      const sobrenome = user[0].sobrenome;
      const code = generateCode();
      await RedefinirModel.updateUserCode(redefinirEmail, code);
      await sendCodeByEmail(redefinirEmail, code, nome, sobrenome);
      res.redirect(`/redefinir/enter-code?email=${redefinirEmail}`);
    } else {
      console.log("Usuário não encontrado:", redefinirEmail);
      res.render("confirm-email", { error: "E-mail não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.render("confirm-email", { error: "Erro ao buscar usuário" });
  }
};

module.exports = {
  showConfirmEmailPage,
  sendCode,
  showEnterCodePage,
  verifyCode,
  showResetPasswordPage,
  resetPassword,
  resendCode,
};