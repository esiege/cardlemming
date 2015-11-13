using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CardTest.Processors
{
	public abstract class BaseController<T> : ApiController where T : class
	{
		protected BaseController() { }
		protected readonly IBaseProcessor<T> _baseProcessor;

		public string GetClientIp(HttpRequestMessage request = null)
		{
			request = request ?? Request;

			if (request.Properties.ContainsKey("MS_HttpContext"))
			{
				return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
			}
			else if (HttpContext.Current != null)
			{
				return HttpContext.Current.Request.UserHostAddress;
			}
			else
			{
				return null;
			}
		}

		protected IOperationResult Add([FromBody]T entity)
		{
			var opResult = new OperationResultBase(true);

			try
			{
				if (ModelState.IsValid)
					opResult.EntityId = _baseProcessor.Add(entity, User.Identity.Name);
				else
					opResult.Valid = false;
			}
			catch (Exception ex)
			{
				opResult.Valid = false;
				opResult.ErrorMessage = Utility.ConcatenateErrorMessages(ex);
			}
			return opResult;
		}

		[HttpPost]
		public virtual IOperationResult Update([FromBody]T entity)
		{
			var opResult = new OperationResultBase(true);
			if (ModelState.IsValid)
			{
				opResult.EntityId = _baseProcessor.Update(entity, User.Identity.Name);
				opResult.Valid = true;
			}
			return opResult;
		}

		[HttpPost]
		public virtual IOperationResult Delete(int id)
		{
			var opResult = new OperationResultBase(true);
			_baseProcessor.Delete<T>(id);
			return opResult;
		}

		[HttpPost]
		public virtual IOperationResult Remove([FromBody]T entity)
		{
			var opResult = new OperationResultBase(true);
			if (ModelState.IsValid)
			{
				opResult.EntityId = _baseProcessor.Remove(entity, User.Identity.Name);
				opResult.Valid = true;
			}
			return opResult;
		}

		#region Search

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAll()
		{
			List<T> rv;
			rv = _baseProcessor.GetAll<T>();
			return rv;
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllBy(string fieldName, [FromUri] object fieldValue)
		{
			return _baseProcessor.GetAllBy<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
		}

		[System.Web.Http.HttpPost]
		public virtual List<T> SearchAllBy([FromBody]T entity, string fields)
		{
			return _baseProcessor.SearchAllBy<T>(entity, fields.Split(','));
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllLike(string fieldName, [FromUri] object fieldValue)
		{
			List<T> rv;
			rv = _baseProcessor.GetAllLike<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
			return rv;
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllStartsWith(string fieldName, [FromUri] object fieldValue)
		{
			List<T> rv;
			rv = _baseProcessor.GetAllStartsWith<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
			return rv;
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllIncluding([FromUri]string includeProperties)
		{
			List<T> rv;
			rv = _baseProcessor.GetAllIncluding<T>(includeProperties.Split(','));
			return rv;
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllByIncluding(string fieldName, [FromUri] object fieldValue, [FromUri] string includeProperties)
		{
			return _baseProcessor.GetAllByIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllLikeIncluding(string fieldName, [FromUri] object fieldValue, [FromUri]string includeProperties)
		{
			List<T> rv;
			rv = _baseProcessor.GetAllLikeIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
			return rv;
		}

		[System.Web.Http.HttpGet]
		public virtual List<T> GetAllStartsWithIncluding(string fieldName, [FromUri] object fieldValue, [FromUri]string includeProperties)
		{
			List<T> rv;
			rv = _baseProcessor.GetAllStartsWithIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
			return rv;

		}
		[System.Web.Http.HttpGet]
		public virtual T GetSingle(string fieldName, [FromUri] object fieldValue)
		{
			object rv;
			rv = _baseProcessor.GetSingle<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
			return (T)rv;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetSingleBy(string fieldName, [FromUri] object fieldValue)
		{
			T test = _baseProcessor.GetSingleBy<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
			return test;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetSingleLike(string fieldName, [FromUri] object fieldValue)
		{
			object rv;
			rv = _baseProcessor.GetSingleLike<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue));
			return (T)rv;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetSingleIncluding(string fieldName, [FromUri] object fieldValue, [FromUri]string includeProperties)
		{
			object rv;
			rv = _baseProcessor.GetSingleIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
			return (T)rv;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetSingleByIncluding(string fieldName, [FromUri] object fieldValue, [FromUri]string includeProperties)
		{
			object rv;
			rv = _baseProcessor.GetSingleByIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
			return (T)rv;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetSingleLikeIncluding(string fieldName, [FromUri] object fieldValue, [FromUri]string includeProperties)
		{
			object rv;
			rv = _baseProcessor.GetSingleLikeIncluding<T>(fieldName, Utility.TranslateValue<T>(fieldName, fieldValue), includeProperties.Split(','));
			return (T)rv;
		}

		[System.Web.Http.HttpGet]
		public virtual T GetEmpty([FromUri] object fieldValue)
		{
			dynamic rv;
			rv = Activator.CreateInstance<T>();
			return (T)rv;
		}

		#endregion Search

	}
}
