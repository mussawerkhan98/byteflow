import { db } from '../../lib/db'

function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,(char)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[char]!)}
export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null
  const name=String(body?.name??'').trim(), email=String(body?.email??'').trim(), phone=String(body?.phone??'').trim(), message=String(body?.message??'').trim(), source=String(body?.sourcePage??'').trim()
  const fieldErrors:Record<string,string>={}
  if(name.length<2)fieldErrors.name='Please enter your full name.'
  else if(name.length>120)fieldErrors.name='Name must be 120 characters or fewer.'
  if(!email)fieldErrors.email='Email address is required.'
  else if(!validEmail(email))fieldErrors.email='Please enter a valid email address.'
  if(phone.length>40)fieldErrors.phone='Phone number must be 40 characters or fewer.'
  if(message.length<5)fieldErrors.message='Please add a little more detail to your message.'
  else if(message.length>5000)fieldErrors.message='Message must be 5,000 characters or fewer.'
  if(Object.keys(fieldErrors).length)return Response.json({error:'Please complete the highlighted fields.',fieldErrors},{status:400})
  try{
    const enabled=await db.execute({sql:`SELECT enabled,success_message,error_message,recipient_email,reply_to_mode,email_subject FROM contact_form_settings f LEFT JOIN pages p ON p.id=f.page_id WHERE f.enabled=1 AND (f.page_id IS NULL OR p.slug=?) ORDER BY f.page_id DESC LIMIT 1`,args:[source.replace(/^\//,'')||'home']})
    if(enabled.rows.length===0)return Response.json({error:'This contact form is currently unavailable.'},{status:503})
    await db.execute({sql:'INSERT INTO contact_submissions (name,email,phone,message,source_page) VALUES (?,?,?,?,?)',args:[name,email,phone,message,source]})
    if(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM_EMAIL){
      const setting=enabled.rows[0]
      const recipients=Array.from(new Set([String(setting.recipient_email),'info@byteflow.ae'].filter(Boolean)))
      await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${process.env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:recipients,reply_to:String(setting.reply_to_mode)==='submitter'?email:undefined,subject:String(setting.email_subject),html:`<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Source:</strong> ${escapeHtml(source)}</p><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`})})
    }
    return Response.json({message:String(enabled.rows[0].success_message)})
  }catch{return Response.json({error:'Unable to send your message right now. Please call or WhatsApp us.'},{status:500})}
}
