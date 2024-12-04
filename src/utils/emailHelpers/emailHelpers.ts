import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SEND_GRID_API_KEY!);

export async function sendVerificationEmail(email: string, code: string) {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!,
    subject: 'Email Verification - Complete Your Registration',
    html: `
      <p>Thank you for registering! Please verify your email by entering the following code:</p>
      <h2>${code}</h2>
      <p>This code will expire in 15 minutes.</p>
    `,
  };
  
  await sgMail.send(msg);
}

export async function sendBookingConfirmationEmail({
  email,
  startDate,
  endDate,
  vehicle,
  extras,
  totalPayment,
  bookingId,
  delivery_required,
  delivery_type,
  delivery_address,
}: {
  email: string;
  startDate: Date;
  endDate: Date;
  vehicle: any;
  extras: any[];
  totalPayment: number;
  bookingId: string;
  delivery_required: boolean;
  delivery_type: string | null;
  delivery_address?: string | null;
}) {
  const extrasHtml = extras.length
    ? extras.map(extra => `<li>${extra.extra_name} (x${extra.quantity})</li>`).join('')
    : 'No extras added';

  const deliveryInfo = delivery_required
    ? delivery_type === 'local'
      ? `<p><strong>Delivery Type:</strong> Local Delivery (within 10 miles)</p>
         <p><strong>Delivery Address:</strong> ${delivery_address}</p>`
      : `<p><strong>Delivery Type:</strong> Delivery to IAH Airport</p>
         <p><strong>Delivery Address:</strong> George Bush Intercontinental Airport, 2800 N Terminal Rd, Houston, TX 77032</p>`
    : `<p>Pickup Location: 16753 Donwick Dr Suite A12, The Woodlands, TX 77385</p>`;

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!,
    subject: 'Booking Confirmation - Southern Rental Cars',
    html: `
      <div style="background-color: #24364D; color: #ffffff; padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <div style="background-color: #ffffff; color: #333333; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
          <h2 style="color: #24364D;">Thank you for booking with Southern Rental Cars!</h2>
          <p>Here are your booking details:</p>
          <div style="text-align: left;">
            <h3>Vehicle:</h3>
            <p><strong>${vehicle.year} ${vehicle.make} ${vehicle.model}</strong> (${vehicle.type})</p>
            <img src="${vehicle.thumbnail}" alt="${vehicle.make} ${vehicle.model}" style="display: block; margin: 10px auto; max-width: 100%; height: auto; border-radius: 8px;" />

            <h3>Rental Dates:</h3>
            <p><strong>Start:</strong> ${new Date(startDate).toLocaleString()}</p>
            <p><strong>End:</strong> ${new Date(endDate).toLocaleString()}</p>

            <h3>Extras:</h3>
            <ul>${extrasHtml}</ul>

            <h3>Total Payment:</h3>
            <p><strong>$${totalPayment}</strong></p>

            ${deliveryInfo}

            <p style="margin-top: 20px;">We look forward to serving you!</p>
            <a href="${process.env.API_BASE_URL}/book/${bookingId}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #24364D; border-radius: 5px; text-decoration: none; margin-top: 20px;">View Booking Confirmation</a>
          </div>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!,
    subject: 'Password Reset Request',
    html: `
      <div style="background-color: #24364D; color: #ffffff; padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <div style="background-color: #ffffff; color: #333333; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
          <h2 style="color: #24364D;">Password Reset Request</h2>
          <p>If you requested to reset your password, click the link below:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #24364D; border-radius: 5px; text-decoration: none; margin-top: 20px;">Reset Password</a>
          <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
}



