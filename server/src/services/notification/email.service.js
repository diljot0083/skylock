export async function sendEmail({ to, subject, text }) {
    console.log(`[email:mock] to=${to} subject="${subject}"\n${text}`);
}