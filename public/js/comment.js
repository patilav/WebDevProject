app.controller("CommentController", function ($scope, $routeParams, $http) {
    var username = $routeParams.username;

    $http.get("/usercomment")
    .success(function (response) {
        $scope.comments = response;
    });

    $scope.add = function (text) {
        var obj = { username: username, text: text };
        $scope.text = null;
        $http.post("/usercomment", obj)
        .success(function (response) {
            $scope.comments = response;
        });
    };
});
