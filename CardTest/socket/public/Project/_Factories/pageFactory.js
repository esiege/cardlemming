
app.factory('pageFactory', function () {

    var page = "";

        
    return {
        getPage: function () {
            return page;
        },
        setPage: function (p) {
            page = p;
        }
    };


});