export function statusUpdateSubject(status: string): string {
  return `Your application status has been updated to ${status}`;
}

export function statusUpdateText(name: string, status: string): string {
  return `Hi ${name},\n\nYour application status has been updated to ${status}.\n\nIf you have any questions, please reply to this email.\n\nBest regards,\nPlacement Cell`;
}

export function statusUpdateHtml(name: string, status: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif; color: #0f172a;">
    <h2 style="margin: 0 0 16px; font-weight: 600;">Application Status Updated</h2>
    <p style="margin: 0 0 12px;">Hi <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin: 0 0 12px;">Your application status has been updated to <strong>${escapeHtml(status)}</strong>.</p>
    <p style="margin: 0 0 12px;">If you have any questions, please reply to this email.</p>
    <p style="margin-top: 24px; color: #475569;">Best regards,<br/>Placement Cell</p>
  </div>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
} 