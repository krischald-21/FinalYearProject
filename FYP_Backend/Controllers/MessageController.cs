using FYP_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace FYP_Backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MessageController : ControllerBase
	{
		[HttpPost]
		public IActionResult SendEmail(Message msg)
		{
			try
			{
				MailMessage message = new MailMessage();
				message.From = new MailAddress(GlobalVariables.EmailAddress);
				message.To.Add(GlobalVariables.EmailAddress);
				message.Subject = "New Message on KunSasto";
				message.Body = $"Message sent by: {msg.Fullname}\nMessage Subject: {msg.MessageSubject}\nSender's Email: {msg.EmailAddress}\nMessage:\n{msg.MessageBody}";
				SmtpClient client = new()
				{
					Host = "smtp.gmail.com",
					Port = 587,
					UseDefaultCredentials = false,
					EnableSsl = true,
					Credentials = new NetworkCredential(GlobalVariables.EmailAddress, GlobalVariables.MessagePass),
					DeliveryMethod = SmtpDeliveryMethod.Network,
					TargetName = "STARTTLS/smtp.gmail.com"
				};
				client.Send(message);
				return Ok("Email sent successfully!");
			}
			catch(System.Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}
