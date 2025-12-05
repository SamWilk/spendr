/* eslint-env node */
/* global process */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  const { email, name } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          to_name: name || 'there',
          from_name: 'spendr Team',
          subject: 'Welcome to spendr! 🎉',
          message: `Hi${name ? ` ${name}` : ''},\n\nThank you for signing up! We're excited to help you track your spending and manage your budget.\n\nGet started by:\n- Setting your monthly budget\n- Adding your first expense\n- Tracking your remaining balance\n\nHappy budgeting!\nThe spendr Team`,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('EmailJS error:', errorData)
      return res.status(500).json({ 
        error: 'Failed to send email via EmailJS',
        details: errorData 
      })
    }

    console.log('📧 Email sent successfully via EmailJS to:', email)

    return res.status(200).json({ 
      message: 'Email sent successfully via EmailJS',
      email,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('EmailJS sending error:', err)
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: err.message 
    })
  }
}
