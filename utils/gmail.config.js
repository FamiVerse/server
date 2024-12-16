import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
        service:"gmail",
        port:465,
        secure:true,
        logger:true,
        dubug:true,
        secureConnection:true,
        auth:{
            user:"techgilu@gmail.com",
            pass:"cljpsfwuqroxljlu",
        },
    
        tls:{
            rejectUnauthorized:false,
    
        }
    
    })


//mail options

export const mailOptions = (email, fullName,OTP) =>{
    const mailer = {
        from: process.env.mail_user,
        to: email,
        subject: "Signup Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4CAF50; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">FamiVerse</h1>
            </div>
            <div style="padding: 20px; text-align: center; background-color: #f9f9f9;">
              <p style="font-size: 20px; font-weight: bold;">Hello ${fullName} ☺️,</p>
              <p style="font-size: 18px; color: #333;">
                FamiVerse sent you a verification code for your account.
              </p>
              <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #555;">
                Please use the following OTP to login:
              </p>
              <p style="font-size: 32px; font-weight: bold; color: #4CAF50; background-color: #fff; padding: 10px 20px; border: 1px dashed #4CAF50; display: inline-block; border-radius: 5px;">
                ${OTP}
              </p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
              <p style="font-size: 14px; color: #888; margin: 0;">
                If you did not request this code, please ignore this email.
              </p>
            </div>
          </div>
        `
      };
      return mailer
}

// export default transporter