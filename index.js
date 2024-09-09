import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

// Function to ask AI which department is the best fit
export async function askAiForDepartment(apiKey, subject, body) {
    const prompt = `Classify this email into one of the departments: support, sales, billing, marketing.
    Subject: ${subject}
    Body: ${body}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('AI Response:', JSON.stringify(data, null, 2));

        // Extract the department from the text
        let departmentText = data.candidates[0]?.content?.parts[0]?.text || '';

        // Log the raw department text for debugging
        console.log('Raw Department Text:', departmentText);

        // Clean up and extract department
        departmentText = departmentText
            .replace(/[\*\*\[\]\(\)]/g, '') // Remove markdown symbols
            .toLowerCase(); // Convert to lowercase

        // Match department from cleaned text
        const departmentMatch = departmentText.match(/billing|sales|support|marketing/);

        if (departmentMatch) {
            console.log('Extracted Department:', departmentMatch[0]);
            return departmentMatch[0]; // Return the department as is (lowercase if needed)
        } else {
            console.log('Defaulting to support');
            return 'support'; // Default to 'support' if no department is classified
        }

    } catch (error) {
        console.error('Error in askAiForDepartment:', error);
        return 'support'; // Default to 'support' in case of error
    }
}


// Function to route the email based on the AI or user-provided logic
export async function routeEmail(apiKey, subject, body, departmentEmails, customDepartmentMatch, customRoutingLogic) {
    const department = await askAiForDepartment(apiKey, subject, body, customDepartmentMatch);

    let recipientEmail;

    // Allow the user to pass custom routing logic
    if (customRoutingLogic) {
        recipientEmail = customRoutingLogic(department, departmentEmails);
    } else {
        switch (department) {
            case 'support':
                recipientEmail = departmentEmails.support;
                break;
            case 'sales':
                recipientEmail = departmentEmails.sales;
                break;
            case 'billing':
                recipientEmail = departmentEmails.billing;
                break;
            default:
                recipientEmail = departmentEmails.default;
        }
    }

    console.log(`Email routed to: ${recipientEmail}`);
    return recipientEmail;
}

// Function to send the email
export async function sendEmail(to, subject, body, userEmail, userPassword) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    const mailOptions = {
        from: userEmail,
        to,
        subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error in sendEmail:', error);
    }
}
