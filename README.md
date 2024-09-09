# ai-email-router

`ai-email-router` is an npm package that leverages AI to classify and route emails to appropriate departments and then sends the emails using Nodemailer. This package is designed to help automate email handling and routing based on content classification.

## Features

- **AI-based Email Classification:** Automatically classify emails into predefined departments using AI.
- **Custom Routing:** Route emails to specific departments based on classification results.
- **Email Sending:** Send routed emails using Nodemailer.

## Installation

To install `ai-email-router`, use npm:

```bash
npm install ai-email-router
```

## Usage

Here’s how you can use `ai-email-router` in your project:

### Example Usage

1. **Create a file `test.mjs or test.js`**:

```javascript
import { routeEmail, sendEmail } from 'ai-email-router';

const departmentEmails = {
    support: 'support@example.com',
    sales: 'sales@example.com',
    billing: 'billing@example.com',
    marketing: 'marketing@example.com',  // Example additional department
    default: 'default@gmail.com'
};

const apiKey = 'YOUR_API_KEY';  // Replace with your Gemini API key
const subject = 'Billing Issue';
const body = 'Hi, I have a question about my recent bill. Can you help?';

async function main() {
    try {
        // Custom department matching logic (optional)
        const customDepartmentMatch = (text) => {
            // For instance, always classify 'question' in the body as support
            if (text.includes('question')) return 'support';
            const match = text.match(/billing|sales|support|marketing/i);
            return match ? match[0].toLowerCase() : 'support';
        };

        // Custom routing logic (optional)
        const customRoutingLogic = (department, emails) => {
            if (department === 'billing') {
                return emails.billing;
            } else if (department === 'sales') {
                return emails.sales;
            } else if (department === 'marketing'){
                return emails.marketing;
            }
            return emails.support; // Default to support
        };

        const recipientEmail = await routeEmail(apiKey, subject, body, departmentEmails, customDepartmentMatch, customRoutingLogic);

        const userEmail = 'your-email@example.com'; // Replace with your email
        const userPassword = 'your-email-password'; // Replace with your email password
        await sendEmail(recipientEmail, subject, body, userEmail, userPassword);

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
```

2. **Run the script**:

```bash
node test.mjs
```

### API Functions

#### `askAiForDepartment(apiKey, subject, body)`

Classifies the email content into one of the predefined departments using AI.

- **Parameters:**
  - `apiKey` (string): Your API key for the AI service.
  - `subject` (string): The subject of the email.
  - `body` (string): The body of the email.

- **Returns:** `Promise<string>` - The classified department (`support`, `sales`, `billing`, `marketing`).

#### `routeEmail(apiKey, subject, body, departmentEmails, customDepartmentMatch, customRoutingLogic)`

Routes the email to the appropriate department based on AI classification and custom logic.

- **Parameters:**
  - `apiKey` (string): Your API key for the AI service.
  - `subject` (string): The subject of the email.
  - `body` (string): The body of the email.
  - `departmentEmails` (object): An object mapping departments to email addresses.
  - `customDepartmentMatch` (function): Optional. A custom function to match departments.
  - `customRoutingLogic` (function): Optional. A custom function to determine the recipient email.

- **Returns:** `Promise<string>` - The recipient email address.

#### `sendEmail(to, subject, body, userEmail, userPassword)`

Sends an email to the specified recipient using Nodemailer.

- **Parameters:**
  - `to` (string): Recipient's email address.
  - `subject` (string): Subject of the email.
  - `body` (string): Body of the email.
  - `userEmail` (string): Your email address for sending the email.
  - `userPassword` (string): Your email account password.

- **Returns:** `Promise<void>`

## Configuration

- **Google API Key:** You need a valid API key from Google to use the AI classification service.
- **Email Credentials:** Use your email account credentials for sending emails via Nodemailer.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
