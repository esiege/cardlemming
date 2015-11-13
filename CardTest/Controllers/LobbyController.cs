using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web.Http;
using CardTest.Models;
using CardTest.Processors;

namespace CardTest.Controllers
{
	public class LobbyController : BaseController<BaseModel>
	{

		private static float sessionIdCounter = 0;
		public LobbyController()
		{
			var ctx = new CardTestContext();
			if (sessionIdCounter == 0)
			{
				IQueryable<float?> sessionIds = (from au in ctx.ActiveUsers orderby au.SessionId descending select au.SessionId);

				if (sessionIds.Any())
				{
					sessionIdCounter = Convert.ToInt32(sessionIds.First()) + 1;
				}
				else
				{
					sessionIdCounter = 1;
				}
			}
		}

		[HttpPost]
		public dynamic Match(UserAccount userAccount)
		{
			dynamic results = new ExpandoObject();
			var ctx = new CardTestContext();
			string clientIp = GetClientIp();
			ActiveUser activeAccount = ctx.ActiveUsers.FirstOrDefault(x => x.UserAccountId == userAccount.Id && x.Ip == clientIp);

			if (activeAccount == null)
			{
				results.error = new ExpandoObject();
				results.error.login = "Account/password not found.";
				return results;
			}

			if (activeAccount.Status == null) { activeAccount.Status = "Matching"; }

			ctx.SaveChanges();

			results.status = "Matching";
			return results;
		}




		[HttpPost]
		public dynamic AttemptPairing(UserAccount userAccount)
		{
			dynamic results = new ExpandoObject();
			var ctx = new CardTestContext();

			string clientIp = GetClientIp();
			ActiveUser activeAccount = ctx.ActiveUsers.FirstOrDefault(x => x.UserAccountId == userAccount.Id && x.Ip == clientIp);
			IQueryable<ActiveUser> otherUsersMatching = ctx.ActiveUsers.Where(x => x.Status == "Matching" && x.UserAccountId != userAccount.Id);
			ActiveUser selectedMatchUser = new ActiveUser();

			if (activeAccount.SessionId != null)
			{
				
			}
			else if (otherUsersMatching.Any())
			{
				//TODO determine matching priority
				selectedMatchUser = otherUsersMatching.FirstOrDefault();

				activeAccount.SessionId = sessionIdCounter;
				activeAccount.Status = "Match Found";
				activeAccount.LastConnection = DateTime.Now;

				selectedMatchUser.SessionId = sessionIdCounter;
				selectedMatchUser.Status = "Match Found";
				selectedMatchUser.LastConnection = DateTime.Now;

				sessionIdCounter++;
			}
			else
			{


				return results;
			}

			ctx.SaveChanges();


			results.SessionId = activeAccount.SessionId;

			return results;
		}



	}
}

