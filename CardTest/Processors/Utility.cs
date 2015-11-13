using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace CardTest.Processors
{
    public static class Utility
    {
		// TODO: Look at these methods and separate them out to appropriate not-so-generic classes
	    public static object TranslateValue<T>(string fieldName, object fieldValue)
	    {
		    // Find out what the data type is for the supplied fieldName
		    var valueType = typeof (T);
		    var p = valueType.GetProperty(fieldName).PropertyType;

		    object newValue;

		    // Convert object fieldValue to object matching type of p
		    if (p.IsGenericType && p.GetGenericTypeDefinition() == typeof (Nullable<>))
		    {
			    if (String.IsNullOrEmpty(fieldValue.ToString()))
				    newValue = null;
			    else
				    newValue = Convert.ChangeType(fieldValue, p.GetGenericArguments()[0]);
		    }
		    else
		    {
			    newValue = Convert.ChangeType(fieldValue, p);
		    }
		    return newValue;
	    }

	    public static string[] GetChildClassNames<T>() where T : class
	    {
		    string nameSpace = Assembly.GetExecutingAssembly().FullName.Substring(0, 4);

		    var valueType = typeof (T);
		    var properties =
			    valueType.GetProperties()
			             .Where(p => p.PropertyType.IsClass && p.PropertyType.Namespace.Substring(0, 4) == nameSpace)
			             .ToArray();
		    var propertyNames = new string[properties.Count()];
		    int i = 0;
		    foreach (PropertyInfo property in properties)
		    {
			    propertyNames[i] = property.Name;
			    i++;
		    }
		    return propertyNames;
	    }

	    public static class PredicateBuilder
        {
            public static Expression<Func<T, bool>> True<T>() { return f => true; }
            public static Expression<Func<T, bool>> False<T>() { return f => false; }

		    public static Expression<Func<T, bool>> Or<T>(Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
		    {
			    var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
			    return Expression.Lambda<Func<T, bool>>
				    (Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
		    }

		    public static Expression<Func<T, bool>> And<T>(Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
		    {
			    var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
			    return Expression.Lambda<Func<T, bool>>
				    (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
		    }
        }

        public static DateTime? ValidValue(this DateTime? currentDateTime)
        {
            var minDateTime = new DateTime(1753, 1, 1);
            if (currentDateTime < minDateTime)
                return minDateTime;

            return currentDateTime;
        }

        public static DateTime ValidValue(this DateTime currentDateTime)
        {
            var minDateTime = new DateTime(1753, 1, 1);
            if (currentDateTime < minDateTime)
                return minDateTime;

            return currentDateTime;
        }        

        public static string ToCamelCase(this String stringToConvert)
        {
            var newString = "";            
            foreach (byte b in System.Text.Encoding.UTF8.GetBytes(stringToConvert.ToCharArray()))
            {
                if (b >= 65 && b <= 90)
                    newString += " ";
                newString += (char) b;                
            }

            newString = newString.Trim();

            string[] strings = newString.Split(' ');
            strings[0] = strings[0].Substring(0, 1).ToLower() + strings[0].Substring(1, strings[0].Length - 1);
            string result = strings[0];

            for (int i = 1; i < strings.Length; i++)
            {
                string current = strings[i];
                result += current.Substring(0, 1).ToUpper() + current.Substring(1, current.Length - 1);
            }
            return result;

        }

        public static string DePluralize(this String val)
        {
            var strL = val.Length;
            var ret = val;

            if (val.Substring(strL - 1) == "s")
                ret = val.Substring(0, strL - 1);

            // example 'Properties'
            if (val.Substring(strL - 3) == "ies")
                ret = val.Substring(0, strL - 3) + "y";

            // example 'Addresses' but not 'States'
            if (val.Substring(strL - 3) == "ses")
                ret = val.Substring(0, strL - 2);

            return ret;
        }


		/// <summary>
		/// Concatenates the error messages for an exception
		/// </summary>
		/// <param name="ex">The exception.</param>
		/// <returns>System.String.</returns>
		public static string ConcatenateErrorMessages(Exception ex)
		{
			var errorMessage = ex.Message;
			if (ex.InnerException != null)
			{
				errorMessage += " " + ConcatenateErrorMessages(ex.InnerException);
			}

			return errorMessage;
		}
    }
}