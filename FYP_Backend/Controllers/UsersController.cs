using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FYP_Backend.Data;
using FYP_Backend.Models;
using FYP_Backend.Interface;
using FYP_Backend.Models.DTOs;
using System.Text;
using System.Security.Cryptography;

namespace FYP_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FYP_BackendContext _context;
        private readonly IRepository _repository;

        public UsersController(FYP_BackendContext context, IRepository repository)
        {
            _context = context;
            _repository = repository;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
          return await _repository.SelectAll<Users>();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var user = await _repository.SelectById<Users>(id);
            if(user == null)
            {
                return NotFound();
            }
            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers(int id, Users users)
        {
            if (id != users.UserId)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers(Users users)
        {
          await _repository.CreateAsync<Users>(users);
            return CreatedAtAction("GetUsers", new { id = users.UserId }, users);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsers(int id)
        {
            var user = await _repository.SelectById<Users>(id);
            if(user == null)
            {
                return NotFound();
            }
            await _repository.DeleteAsync<Users>(id);
            return NoContent();
        }

        private bool UsersExists(int id)
        {
            return (_context.Users?.Any(e => e.UserId == id)).GetValueOrDefault();
        }

        //POST: api/Register
        [HttpPost]
        [Route("~/api/Register")]
        public async Task<ActionResult<Users>> UserRegistration(UserModel userModel)
        {
			var getUser = await _context.Users.Where(x => x.UserEmail == userModel.UserEmail).FirstOrDefaultAsync();

			if (getUser != null)
			{
				return NotFound();
			}
			//Generating a random salt
			byte[] salt = new byte[16];
			new RNGCryptoServiceProvider().GetBytes(salt);

			//Hashing the password with the salt using PBKDF2
			byte[] hashedPassword = new Rfc2898DeriveBytes(userModel.UserPassword, salt, 10000).GetBytes(20);

			//Converting the salt and the hashed password to base64 strings for storing in the database
			string saltString = Convert.ToBase64String(salt);
			string hashedPasswordString = Convert.ToBase64String(hashedPassword);

			//Creating a new User object with hashed password and salt
			Users user = new()
			{
				UserFullName = userModel.UserFullName,
				UserEmail = userModel.UserEmail,
				UserPassword = hashedPasswordString,
				UserTypeId = userModel.UserTypeId,
				Salt = saltString
			};

			this._context.Add(user);
			_ = await this._context.SaveChangesAsync();
			return CreatedAtAction("GetUsers", new {id =  userModel.UserId}, userModel);
        }

        //POST: api/Login
        [HttpPost]
        [Route("~/api/Login")]
        public async Task<ActionResult<UserLoggedIn>> UserLogin(UserLogin userLogin)
        {
            string userEmail = userLogin.UserEmail;
            string userPassword = userLogin.UserPassword;

            string userEmailAddress = userEmail.ToString();

            var userDetail = await _context.Users.FirstOrDefaultAsync(x => x.UserEmail == userEmailAddress);

            if(userDetail == null)
            {
                return Unauthorized(new { message = "INVALID_USER", loggedIn = false });
            }

			//Hashing the provided password using same salt and hashing algorithm
			byte[] saltBytes = Convert.FromBase64String(userDetail.Salt);
            byte[] hashedBytes = new Rfc2898DeriveBytes(userPassword, saltBytes, 10000).GetBytes(20); 
            string hashedPassword = Convert.ToBase64String(hashedBytes);

            if(hashedPassword != userDetail.UserPassword)
            {
                return Unauthorized(new { message = "INVALID_PASSWORD", loggedIn = false });
            }



            return Ok(new UserLoggedIn
            {
                UserId = userDetail.UserId,
                UserTypeId = userDetail.UserTypeId,
                UserEmail = userEmail,
                UserFullName = userDetail.UserFullName
            });
        }

        //POST: api/ChangePassword/5
        [HttpPost]
        [Route("~/api/ChangePassword/{userId}")]
        public async Task<ActionResult<Users>> ChangeUserPassword(int userId, UserChangePassword userChangePassword)
        {
            string userOldPassword = userChangePassword.OldPassword;
            string userNewPassword = userChangePassword.NewPassword;

            var getUser = await _repository.SelectById<Users>(userId);
            if (getUser == null)
            {
                return NotFound();
            }

            byte[] saltBytes = Convert.FromBase64String(getUser.Salt);
            byte[] hashedBytes = new Rfc2898DeriveBytes(userOldPassword, saltBytes, 10000).GetBytes(20);
            string hashedPassword = Convert.ToBase64String(hashedBytes);

            if(hashedPassword != getUser.UserPassword)
            {
                return Unauthorized(new { message = "INVALID_PASSWORD" });
            }

            //Generating a random salt
            byte[] newSalt = new byte[16];
            new RNGCryptoServiceProvider().GetBytes(newSalt);

            //Hashing the password with the salt using PBKDF2
            byte[] newHashedPassword = new Rfc2898DeriveBytes(userNewPassword, newSalt, 10000).GetBytes(20);

            //Converting the salt and the hashed password to base64 strings for storing in the database
            string saltString = Convert.ToBase64String(newSalt);
            string hashedPasswordString = Convert.ToBase64String(newHashedPassword);

            getUser.UserPassword = hashedPasswordString;
            getUser.Salt = saltString;
            _context.SaveChanges();

            return await _repository.SelectById<Users>(userId);
        }

        // GET: api/UserSubscriptions/5
        [HttpGet]
        [Route("~/api/UserSubscriptions/{userId}")]
        public async Task<ActionResult<IEnumerable<UserSubscription>>> GetUserSubscription(int userId)
        {
            var query = from u in _context.Users
                              join pd in _context.PriceDrop on u.UserId equals pd.UserId
                              join p in _context.Products on pd.ProductId equals p.ProductId
                        where u.UserId == userId
                              select new UserSubscription
                              {
                                  UserId = u.UserId,
                                  UserFullName = u.UserFullName,
                                  ProductId = p.ProductId,
                                  ProductName = p.ProductName
                              };

            return await query.ToListAsync();
        }

    }
}
