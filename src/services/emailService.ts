export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailNotification {
  id: string
  to: string
  subject: string
  html: string
  sentAt: string
  caseId: string
  status: "sent" | "pending" | "failed"
}

class EmailService {
  private notifications: EmailNotification[] = []

  // Email templates for different case stages
  private templates = {
    caseCreated: (caseId: string, studentName: string, caseType: string, investigator: string): EmailTemplate => ({
      subject: `New Case Created: ${caseId} - ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .case-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .status-badge { display: inline-block; padding: 6px 12px; background: #fef3c7; color: #92400e; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Case Alert</h1>
              <p>A new exam malpractice case has been created and requires your attention</p>
            </div>
            <div class="content">
              <div class="case-details">
                <h2>Case Details</h2>
                <p><strong>Case ID:</strong> ${caseId}</p>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Case Type:</strong> ${caseType}</p>
                <p><strong>Assigned Investigator:</strong> ${investigator}</p>
                <p><strong>Status:</strong> <span class="status-badge">ACTIVE</span></p>
                <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>This case has been automatically assigned and is now active in the system. Please log in to the dashboard to begin your investigation.</p>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review case details and evidence</li>
                <li>Contact the student if necessary</li>
                <li>Update case status as investigation progresses</li>
              </ul>
            </div>
            <div class="footer">
              <p>Exam Malpractice Management System | Academic Integrity Office</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Case Created: ${caseId}\n\nStudent: ${studentName}\nCase Type: ${caseType}\nAssigned Investigator: ${investigator}\nStatus: ACTIVE\nCreated: ${new Date().toLocaleString()}\n\nPlease log in to the dashboard to begin your investigation.`,
    }),

    statusUpdated: (
      caseId: string,
      studentName: string,
      oldStatus: string,
      newStatus: string,
      action: string,
    ): EmailTemplate => ({
      subject: `Case Status Update: ${caseId} - ${newStatus.toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin: 0 5px; }
            .old-status { background: #fee2e2; color: #991b1b; }
            .new-status { background: #dcfce7; color: #166534; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Case Status Update</h1>
              <p>Case ${caseId} has been updated</p>
            </div>
            <div class="content">
              <div class="status-update">
                <h2>Status Change</h2>
                <p><strong>Case ID:</strong> ${caseId}</p>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Action:</strong> ${action}</p>
                <p><strong>Status Change:</strong> 
                  <span class="status-badge old-status">${oldStatus.toUpperCase()}</span>
                  →
                  <span class="status-badge new-status">${newStatus.toUpperCase()}</span>
                </p>
                <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>The case status has been updated. All relevant parties have been notified of this change.</p>
            </div>
            <div class="footer">
              <p>Exam Malpractice Management System | Academic Integrity Office</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Case Status Update: ${caseId}\n\nStudent: ${studentName}\nAction: ${action}\nStatus: ${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}\nUpdated: ${new Date().toLocaleString()}`,
    }),

    caseResolved: (caseId: string, studentName: string, resolution: string): EmailTemplate => ({
      subject: `Case Resolved: ${caseId} - ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .resolution { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
            .resolved-badge { display: inline-block; padding: 8px 16px; background: #dcfce7; color: #166534; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Case Resolved</h1>
              <p>Case ${caseId} has been successfully resolved</p>
            </div>
            <div class="content">
              <div class="resolution">
                <h2>Resolution Details</h2>
                <p><strong>Case ID:</strong> ${caseId}</p>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Status:</strong> <span class="resolved-badge">RESOLVED</span></p>
                <p><strong>Resolution:</strong> ${resolution}</p>
                <p><strong>Resolved:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>This case has been successfully resolved and closed. All documentation has been archived and relevant parties have been notified.</p>
              <p><strong>Final Actions Completed:</strong></p>
              <ul>
                <li>Investigation completed</li>
                <li>Resolution documented</li>
                <li>Student notified of outcome</li>
                <li>Case archived in system</li>
              </ul>
            </div>
            <div class="footer">
              <p>Exam Malpractice Management System | Academic Integrity Office</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Case Resolved: ${caseId}\n\nStudent: ${studentName}\nResolution: ${resolution}\nResolved: ${new Date().toLocaleString()}\n\nThis case has been successfully resolved and closed.`,
    }),
  }

  async sendEmail(to: string, template: EmailTemplate, caseId: string): Promise<EmailNotification> {
    // Simulate email sending (in real app, this would call an email service like SendGrid, AWS SES, etc.)
    const notification: EmailNotification = {
      id: Date.now().toString(),
      to,
      subject: template.subject,
      html: template.html,
      sentAt: new Date().toISOString(),
      caseId,
      status: "sent",
    }

    this.notifications.push(notification)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`[v0] Email sent to ${to}: ${template.subject}`)
    return notification
  }

  async notifyCaseCreated(
    caseId: string,
    studentName: string,
    caseType: string,
    investigator = "System Admin",
  ): Promise<void> {
    const template = this.templates.caseCreated(caseId, studentName, caseType, investigator)

    // Send to multiple recipients
    const recipients = ["investigator@university.edu", "admin@university.edu", "academic.integrity@university.edu"]

    for (const recipient of recipients) {
      await this.sendEmail(recipient, template, caseId)
    }
  }

  async notifyStatusUpdate(
    caseId: string,
    studentName: string,
    oldStatus: string,
    newStatus: string,
    action: string,
  ): Promise<void> {
    const template = this.templates.statusUpdated(caseId, studentName, oldStatus, newStatus, action)

    const recipients = ["investigator@university.edu", "admin@university.edu"]

    for (const recipient of recipients) {
      await this.sendEmail(recipient, template, caseId)
    }
  }

  async notifyCaseResolved(caseId: string, studentName: string, resolution: string): Promise<void> {
    const template = this.templates.caseResolved(caseId, studentName, resolution)

    const recipients = [
      "investigator@university.edu",
      "admin@university.edu",
      "academic.integrity@university.edu",
      "registrar@university.edu",
    ]

    for (const recipient of recipients) {
      await this.sendEmail(recipient, template, caseId)
    }
  }

  getNotifications(): EmailNotification[] {
    return this.notifications.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }

  getNotificationsByCaseId(caseId: string): EmailNotification[] {
    return this.notifications.filter((n) => n.caseId === caseId)
  }
}

export const emailService = new EmailService()
