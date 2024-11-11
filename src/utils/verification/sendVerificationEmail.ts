// utils/sendEmail.ts

import { BookingExtra, Vehicle } from '@prisma/client';
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
}: {
  email: string;
  startDate: Date;
  endDate: Date;
  vehicle: Vehicle;
  extras: BookingExtra[];
  totalPayment: number;
  bookingId: string;
}) {
  // Generate extras list HTML
  const extrasHtml = extras.length
    ? extras
        .map(
          (extra) => `<li>${extra.extra_name} (x${extra.quantity})</li>`
        )
        .join('')
    : 'No extras added';

  // Construct the logo URL dynamically
  const logoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/transparent_southern_logo_3.png`;

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

            <p style="margin-top: 20px;">We look forward to serving you!</p>
            <a href="${process.env.API_BASE_URL}/book/${bookingId}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #24364D; border-radius: 5px; text-decoration: none; margin-top: 20px;">View Booking Confirmation</a>
          </div>
        </div>
      </div>
    `,
  };

  console.log("SENDING EMAIL");
  await sgMail.send(msg);
}