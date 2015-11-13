using System.Collections.Generic;

namespace CardTest.Processors
{
    public interface IOperationResult
    {
        string ErrorMessage { get; set; }
        string FieldName { get; set; }
        string EntityType { get; set; }
        int EntityId { get; set; }
        bool Valid { get; set; }
        List<IOperationResult> OperationResults { get; set; }
    }
}
