import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { to, subject, text, html, orderDetails } = await req.json();

    // Create a test account if you don't have one
    let testAccount = await nodemailer.createTestAccount();

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Format order details for email
    const orderDetailsText = Object.entries(orderDetails)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SmartRemote Store" <store@smartremote.com>',
      to: to,
      subject: subject || 'Your Order Confirmation',
      text: text || `Thank you for your order!\n\nOrder Details:\n${orderDetailsText}`,
      html: html || `
        <h1>Thank you for your order!</h1>
        <h2>Order Details:</h2>
        <ul>
          ${Object.entries(orderDetails)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('')}
        </ul>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        previewUrl: nodemailer.getTestMessageUrl(info)
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send email',
        details: error.message 
      }), 
      { status: 500 }
    );
  }
}
