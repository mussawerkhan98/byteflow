import { db } from '../../lib/db'

function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,(char)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[char]!)}

// Every enquiry lands here regardless of what the CMS has configured.
const ALWAYS_NOTIFY = 'info@byteflow.ae'

// CONTACT_FROM_EMAIL may be either "a@b.com" or "Name <a@b.com>"; Brevo's API
// wants the two parts separately.
function parseSender(value: string): { email: string; name?: string } {
  const match = value.match(/^\s*(.*?)\s*<\s*([^>]+?)\s*>\s*$/)
  if (match) return { email: match[2], name: match[1] || undefined }
  return { email: value.trim() }
}

/**
 * Sends through Brevo's transactional API rather than its SMTP relay: the
 * relay is gated by an account-level IP allowlist, and Vercel's egress IPs are
 * dynamic, so SMTP cannot be allowlisted there.
 */
async function sendContactEmail(to: string[], replyTo: string | undefined, subject: string, html: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY as string,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: parseSender(String(process.env.CONTACT_FROM_EMAIL)),
      to: to.map((email) => ({ email })),
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  })
  if (!response.ok) {
    // Surface Brevo's own message — it names the cause (unverified sender,
    // daily quota, malformed payload) far better than a bare status code.
    const detail = await response.text().catch(() => '')
    throw new Error(`Brevo API ${response.status}: ${detail.slice(0, 500)}`)
  }
}

const ACK_SUBJECT = 'We have received your enquiry - Byteflow'
const SITE_URL = 'https://www.byteflow.ae'
const SUPPORT_PHONE = '+971 54 328 2042'

/**
 * Auto-reply sent to whoever submitted the form. Built with tables and inline
 * styles because email clients strip <style> blocks and do not lay out flex or
 * grid. Replies come back to info@byteflow.ae.
 */
function acknowledgementHtml(name: string, message: string) {
  const safeName = escapeHtml(name.split(' ')[0] || name)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="height:4px;background:#2CCDDE;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <p style="margin:0 0 6px 0;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:#2CCDDE;">Byteflow Information Technology</p>
                <h1 style="margin:0 0 16px 0;font-size:24px;line-height:1.3;color:#0b1220;">Thanks, ${safeName} - we have your enquiry</h1>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#475569;">
                  Our team has received your message and will get back to you within 2 hours on business days.
                  If it is urgent, call us on <a href="tel:${SUPPORT_PHONE.replace(/[^+\d]/g, '')}" style="color:#2CCDDE;text-decoration:none;font-weight:bold;">${SUPPORT_PHONE}</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 8px 0;font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:#64748b;">What you sent us</p>
                      <p style="margin:0;font-size:14px;line-height:1.65;color:#334155;">${safeMessage}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px 32px;">
                <a href="${SITE_URL}" style="display:inline-block;background:#2CCDDE;color:#000000;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 26px;border-radius:999px;">Visit our website</a>
                <p style="margin:22px 0 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">
                  You are receiving this because you submitted the contact form on byteflow.ae.
                  Reply to this email to reach us directly.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background:#0b1220;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                  Byteflow Information Technology &middot; Dubai, United Arab Emirates<br>
                  <a href="mailto:${ALWAYS_NOTIFY}" style="color:#2CCDDE;text-decoration:none;">${ALWAYS_NOTIFY}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const RECAPTCHA_SCORE_THRESHOLD=0.5
async function verifyRecaptcha(token:string,remoteip?:string):Promise<boolean>{
  if(!process.env.RECAPTCHA_SECRET_KEY)return true
  if(!token)return false
  try{
    const params=new URLSearchParams({secret:process.env.RECAPTCHA_SECRET_KEY,response:token})
    if(remoteip)params.set('remoteip',remoteip)
    const res=await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:params})
    const data=await res.json().catch(()=>null) as {success?:boolean;score?:number}|null
    return Boolean(data?.success)&&(typeof data?.score!=='number'||data.score>=RECAPTCHA_SCORE_THRESHOLD)
  }catch{return false}
}

export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null
  const name=String(body?.name??'').trim(), email=String(body?.email??'').trim(), phone=String(body?.phone??'').trim(), message=String(body?.message??'').trim(), source=String(body?.sourcePage??'').trim(), recaptchaToken=String(body?.recaptchaToken??'').trim()
  const fieldErrors:Record<string,string>={}
  if(name.length<2)fieldErrors.name='Please enter your full name.'
  else if(name.length>120)fieldErrors.name='Name must be 120 characters or fewer.'
  if(!email)fieldErrors.email='Email address is required.'
  else if(!validEmail(email))fieldErrors.email='Please enter a valid email address.'
  if(phone.length>40)fieldErrors.phone='Phone number must be 40 characters or fewer.'
  if(message.length<5)fieldErrors.message='Please add a little more detail to your message.'
  else if(message.length>5000)fieldErrors.message='Message must be 5,000 characters or fewer.'
  if(Object.keys(fieldErrors).length)return Response.json({error:'Please complete the highlighted fields.',fieldErrors},{status:400})
  const recaptchaOk=await verifyRecaptcha(recaptchaToken,request.headers.get('x-forwarded-for')?.split(',')[0]?.trim())
  if(!recaptchaOk)return Response.json({error:'We could not verify you are not a robot. Please refresh and try again.'},{status:400})
  try{
    const enabled=await db.execute({sql:`SELECT enabled,success_message,error_message,recipient_email,reply_to_mode,email_subject FROM contact_form_settings f LEFT JOIN pages p ON p.id=f.page_id WHERE f.enabled=1 AND (f.page_id IS NULL OR p.slug=?) ORDER BY f.page_id DESC LIMIT 1`,args:[source.replace(/^\//,'')||'home']})
    if(enabled.rows.length===0)return Response.json({error:'This contact form is currently unavailable.'},{status:503})
    await db.execute({sql:'INSERT INTO contact_submissions (name,email,phone,message,source_page) VALUES (?,?,?,?,?)',args:[name,email,phone,message,source]})
    if(process.env.BREVO_API_KEY&&process.env.CONTACT_FROM_EMAIL){
      const setting=enabled.rows[0]
      const configuredRecipient=setting.recipient_email?String(setting.recipient_email).trim():''
      const recipients=Array.from(new Set([configuredRecipient,ALWAYS_NOTIFY].filter(Boolean)))
      try{
        await sendContactEmail(recipients,String(setting.reply_to_mode)==='submitter'?email:undefined,String(setting.email_subject),`<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Source:</strong> ${escapeHtml(source)}</p><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`)
      }catch(err){
        console.error('Brevo contact email failed',err instanceof Error?err.message:err)
      }
      // Confirmation to the person who filled in the form. Sent separately so a
      // failed team notification above does not cost the customer their receipt,
      // and vice versa.
      try{
        await sendContactEmail([email],ALWAYS_NOTIFY,ACK_SUBJECT,acknowledgementHtml(name,message))
      }catch(err){
        console.error('Brevo acknowledgement email failed',err instanceof Error?err.message:err)
      }
    }else{
      console.error('Contact email skipped: BREVO_API_KEY or CONTACT_FROM_EMAIL is not set')
    }
    return Response.json({message:String(enabled.rows[0].success_message)})
  }catch{return Response.json({error:'Unable to send your message right now. Please call or WhatsApp us.'},{status:500})}
}
