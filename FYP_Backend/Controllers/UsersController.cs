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
            await _repository.RegisterUser(userModel);
            return CreatedAtAction("GetUsers", new {id =  userModel.UserId}, userModel);
        }

        //GET: api/Login
        [HttpGet]
        [Route("~/api/Login")]
        public async Task<ActionResult> UserLogin()
        {
            const string email = "userEmail";
            const string password = "userPassword";

            Request.Headers.TryGetValue(email, out var userEmail);
            Request.Headers.TryGetValue(password, out var userPassword);

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

            return Ok(new {message = "LOGIN_SUCCESS", loggedIn = true, userId = userDetail.UserId});
        }

    }
}
