using System.Collections.Generic;

namespace CardTest.Processors
{
	public class OperationResultBase : IOperationResult
	{
		#region Constructors

		public OperationResultBase() { }
		public OperationResultBase(bool valid) { Valid = valid; }

		#endregion

		#region Private Methods

		private List<IOperationResult> _operationResults;

		#endregion

		#region Properties

		public string ErrorMessage { get; set; }
		public string FieldName { get; set; }
		public string EntityType { get; set; }
		public int EntityId { get; set; }
		public bool Valid { get; set; }
		public string Value { get; set; }

		public virtual List<IOperationResult> OperationResults
		{
			get
			{
				if (_operationResults == null)
					_operationResults = new List<IOperationResult>();

				return _operationResults;
			}

			set { _operationResults = value; }
		}
		#endregion
	}
}
