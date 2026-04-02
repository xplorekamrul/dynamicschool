import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
   return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS,
      },
   });
};

interface EmailData {
   name: string;
   phoneNumber: string;
   email?: string;
   message?: string;
   instituteName: string;
   adminEmail: string;
}

export const sendContactEmails = async (data: EmailData): Promise<void> => {
   const transporter = createTransporter();

   // Email to admin
   const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: data.adminEmail,
      subject: `New Contact Form Submission - ${data.instituteName}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Contact Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 8px 0;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px 0;">${data.phoneNumber}</td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0;">${data.email}</td>
            </tr>
            ` : ''}
            ${data.message ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; line-height: 1.5;">${data.message.replace(/\n/g, '<br>')}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>Institute:</strong> ${data.instituteName}
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
            Submitted on: ${new Date().toLocaleString('en-US', {
         timeZone: 'Asia/Dhaka',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      })} (Bangladesh Time)
          </p>
        </div>
      </div>
    `,
   };

   // Send admin email
   await transporter.sendMail(adminMailOptions);

   // Send confirmation email to user if email is provided
   if (data.email) {
      const userMailOptions = {
         from: process.env.SMTP_USER,
         to: data.email,
         subject: `Thank you for contacting ${data.instituteName}`,
         html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            Thank You for Your Message
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Dear ${data.name},</p>
            
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Thank you for contacting <strong>${data.instituteName}</strong>. We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="margin: 0 0 10px 0; color: #2e7d32;">Your submitted information:</h4>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phoneNumber}</p>
              ${data.message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${data.message}</p>` : ''}
              ${data.message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${data.message}</p>` : ''}
            </div>
            
            <p style="margin: 15px 0 0 0; line-height: 1.6; color: #666;">
              If you have any urgent inquiries, please feel free to call us directly at our contact number.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px;">
              Best regards,<br>
              <strong>${data.instituteName}</strong>
            </p>
          </div>
        </div>
      `,
      };

      await transporter.sendMail(userMailOptions);
   }
};