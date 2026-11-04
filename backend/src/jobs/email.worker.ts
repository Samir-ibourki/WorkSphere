import { Worker } from "bullmq";
import { Resend } from "resend";
import { redisConnection } from "../config/queue.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, workspaceName, inviteLink } = job.data;
    console.log(`Processing background invitation email for: ${to}`);

    // Envoi via Resend (Production standard)
    const { data, error } = await resend.emails.send({
      from: "WorkSphere <onboarding@resend.dev>",
      to: [to],
      subject: `Invitation to join workspace: ${workspaceName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">
            You're invited to collaborate on WorkSphere
          </h2>
          <p style="font-size: 14px; line-height: 22px; color: #4b5563; margin-bottom: 24px;">
            You have been invited to join the <strong>${workspaceName}</strong> workspace. Work together on projects, track tasks in real-time, and manage your team workflow.
          </p>
          <div style="margin-bottom: 28px;">
            <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 8px;">
              Accept Invitation
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #f3f4f6; margin-bottom: 16px;" />
          <p style="font-size: 12px; color: #9ca3af;">
            If you did not expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`Resend API Error:`, error);
      throw new Error(error.message);
    }

    console.log(`Real email sent successfully to ${to} (ID: ${data?.id})`);
  },
  { connection: redisConnection }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});
