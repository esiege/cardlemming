var bindToScope = function (body, scopeName, rootScope) {
    rootScope.$watch(scopeName, function (newValue, oldValue) {

        for (var k in rootScope[scopeName]) {
            if (body.details[k])
                body.details[k] = rootScope[scopeName][k];
        }

        console.log(body);
    }, true);

}