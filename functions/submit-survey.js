// functions/submit-survey.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const { part, name, q1, q2 } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = `
    <h2>새 설문 응답</h2>
    <p><b>파트</b>: ${part}</p>
    <p><b>이름</b>: ${name}</p>
    <p><b>질문1</b>: ${q1}</p>
    <p><b>질문2</b>: ${q2}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"설문 웹앱" <no-reply@example.com>`,
      to: "kyd9792@gmail.com",
      subject: `설문 응답 - ${name}(${part})`,
      html
    });
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() };
  }
};
