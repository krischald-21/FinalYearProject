﻿namespace FYP_Backend.Models.DTOs
{
	public class UserLogin
	{
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
    }
	public class UserLoggedIn
	{
		public string UserEmail { get; set; }
		public string UserFullName { get; set; }
	}
}