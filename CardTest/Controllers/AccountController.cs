using System;
using System.Dynamic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using CardTest.Models;
using CardTest.Processors;

namespace CardTest.Controllers
{
	public class AccountController : BaseController<BaseModel>
	{

		[HttpPost]
		public dynamic Login(UserAccount userAccount)
		{
			dynamic results = new ExpandoObject();
			var ctx = new CardTestContext();
			UserAccount account = ctx.UserAccounts.First(x => x.UserName == userAccount.UserName);

			if (account == null)
			{
				results.error = new ExpandoObject();
				results.error.login = "Account/password not found.";
				return results;
			}

			string activeIp = GetClientIp();

			IQueryable<ActiveUser> oldActiveAccounts = ctx.ActiveUsers.Where(x => x.UserAccountId == account.Id);

			foreach (ActiveUser au in oldActiveAccounts)
			{
				ctx.ActiveUsers.Remove(au);
			}

			ActiveUser activeAccount = new ActiveUser();

			activeAccount.Ip = activeIp;
			activeAccount.UserAccountId = account.Id;
			activeAccount.LastConnection = DateTime.Now;

			ctx.ActiveUsers.Add(activeAccount);
			ctx.SaveChanges();

			results.id = account.Id;
			results.name = account.UserName;
			return results;
		}


		[HttpPost]
		public dynamic AddNewUser(UserAccount userAccount)
		{
			dynamic results = new ExpandoObject();
			var ctx = new CardTestContext();

			UserAccount existing = ctx.UserAccounts.FirstOrDefault(x => x.UserName == userAccount.UserName);

			if (existing != null)
			{
				results.error = new ExpandoObject();
				results.error.userName = "An account with this name already exists.";
				return results;
			}

			ctx.UserAccounts.Add(userAccount);
			ctx.SaveChanges();

			results.id = userAccount.Id;
			results.name = userAccount.UserName;
			return results;
		}





	}
}

