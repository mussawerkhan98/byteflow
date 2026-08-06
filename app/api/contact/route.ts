import { db } from '../../lib/db'

function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,(char)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[char]!)}
export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null
  const name=String(body?.name??'').trim(), email=String(body?.email??'').trim(), phone=String(body?.phone??'').trim(), message=String(body?.message??'').trim(), source=String(body?.sourcePage??'').trim()
  if(name.length<2||name.length>120||!validEmail(email)||phone.length>40||message.length<5||message.length>5000)return Response.json({error:'Please provide a valid name, email and message.'},{status:400})
  try{
    const enabled=await db.execute({sql:`SELECT enabled,success_message,error_message,recipient_email,reply_to_mode,email_subject FROM contact_form_settings f LEFT JOIN pages p ON p.id=f.page_id WHERE f.enabled=1 AND (f.page_id IS NULL OR p.slug=?) ORDER BY f.page_id DESC LIMIT 1`,args:[source.replace(/^\//,'')||'home']})
    if(enabled.rows.length===0)return Response.json({error:'This contact form is currently unavailable.'},{status:503})
    await db.execute({sql:'INSERT INTO contact_submissions (name,email,phone,message,source_page) VALUES (?,?,?,?,?)',args:[name,email,phone,message,source]})
    if(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM_EMAIL){
      const setting=enabled.rows[0]
      await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${process.env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[String(setting.recipient_email)],reply_to:String(setting.reply_to_mode)==='submitter'?email:undefined,subject:String(setting.email_subject),html:`<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Source:</strong> ${escapeHtml(source)}</p><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`})})
    }
    return Response.json({message:String(enabled.rows[0].success_message)})
  }catch{return Response.json({error:'Unable to send your message right now. Please call or WhatsApp us.'},{status:500})}
}
