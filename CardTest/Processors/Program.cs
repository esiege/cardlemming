using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace CardTest.Processors
{
	class Program
	{
		static void Main(string[] args)
		{
			var context = new CardTestContext();

			var actionList = new List<UserAction>
            {
                new UserAction { Name = "Fire" },
                new UserAction { Name = "Fire2" },
                new UserAction { Name = "Fire3" },
            };
			actionList.ForEach(s => context.UserActions.Add(s));
			context.SaveChanges();

		}
	}

	public class ActiveUser
	{
		public int Id { get; set; }
		public int UserAccountId { get; set; }
		public string Ip { get; set; }
		public float? SessionId { get; set; }
		public DateTime LastConnection { get; set; }
		public string Status { get; set; }
	}

	public class UserAccount
	{
		public int Id { get; set; }
		public string UserName { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }
	}

	public class UserAction_x_User
	{
		public int Id { get; set; }
		public string PlayerId { get; set; }
		public string Slot { get; set; }
		public string ActionId { get; set; }
	}

	public class UserAction
	{
		public int Id { get; set; }
		public string Name { get; set; }

	}




	public class CardTestContext : DbContext
	{
		protected override void OnModelCreating(DbModelBuilder DbmodelBuilder)
		{
			base.OnModelCreating(DbmodelBuilder);
			DbmodelBuilder.Conventions.Remove<PluralizingEntitySetNameConvention>();
		}

		public DbSet<ActiveUser> ActiveUsers { get; set; }
		public DbSet<UserAccount> UserAccounts { get; set; }
		public DbSet<UserAction_x_User> UserActions_x_Users { get; set; }
		public DbSet<UserAction> UserActions { get; set; }

	}



}
