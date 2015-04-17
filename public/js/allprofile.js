app.controller("AllProfilesController", function ($scope, $routeParams, $http, $sce) {
    var username = $routeParams.username;
    $scope.username = username;
    $http.get("/api/user")
    .success(function (response) {
        $scope.users = response;
    });

    $scope.followUser = function (index) {
        $scope.selectedIndex = null;
        $scope.selectedUser = null;
        $scope.selectedIndex = index
        $scope.selectedUser = $scope.users[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedUser" + $scope.selectedUser);
        if (typeof $scope.selectedUser.followers == "undefined") {
            $scope.selectedUser.followers = [];
        }
        var newFollwer = username;
        if ($scope.selectedUser.followers.indexOf(newFollwer) == -1) {
            $scope.selectedUser.followers.push(newFollwer);
            $http.put("/api/user/" + $scope.selectedUser._id, $scope.selectedUser)
            .success(function (response) {
                $scope.users = response;
            });
        }
    }
});