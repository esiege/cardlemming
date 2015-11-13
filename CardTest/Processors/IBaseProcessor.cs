using System.Collections.Generic;

namespace CardTest.Processors
{
	public interface IBaseProcessor<T> where T : class
	{
		#region CRUD
		IOperationResult InsertOrUpdate<T>(T entity, string userName);
		int Add(T entity, string userName);
		int Update(T entity, string userName);
		int Delete<T>(int id) where T : class;
		int Remove(T entity, string userName);

		#endregion CRUD

		#region SEARCH

		List<T> GetAll<T>() where T : class;
		List<T> GetAllBy<T>(string fieldName, object fieldValue) where T : class;
		List<T> SearchAllBy<T>(T entity, string[] searchFields) where T : class;
		List<T> GetAllLike<T>(string fieldName, object fieldValue) where T : class;
		List<T> GetAllStartsWith<T>(string fieldName, object fieldValue) where T : class;

		List<T> GetAllIncluding<T>(string[] includeProperties) where T : class;
		List<T> GetAllByIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;
		List<T> GetAllLikeIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;
		List<T> GetAllStartsWithIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;

		T GetSingle<T>(string fieldName, object fieldValue) where T : class;
		T GetSingleBy<T>(string fieldName, object fieldValue) where T : class;
		T GetSingleLike<T>(string fieldName, object fieldValue) where T : class;

		T GetSingleIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;
		T GetSingleByIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;
		T GetSingleLikeIncluding<T>(string fieldName, object fieldValue, string[] includeProperties) where T : class;

		#endregion SEARCH

		void Dispose();
	}
}
