app.controller("MyFollowersController", function ($scope, $routeParams, $http, $sce) {
    var username = $routeParams.username;
    $scope.username = username;
    $scope.fail = false;
    $scope.save = false;

    $http.get("/api/user")
    .success(function (response) {
        $scope.users = response;
    });

    $scope.isUserFollwer = function (listuser) {
        var currUser = getCurrentUserDetails(username, listuser);
        if (currUser.followers.indexOf(listuser) == -1) {
            return false;
        } else {
            return true;
        }
    }

    function getCurrentUserDetails(username, listuser) {
        for (i = 0; i < $scope.users.length ; i++) {
            if ($scope.users[i].username == username) {
                return $scope.users[i];
            }
        }
    }

    $scope.followUser = function (index) {
        $scope.selectedIndex = null;
        $scope.selectedUser = null;
        $scope.selectedIndex = index;
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
                $scope.save = true;
                $scope.save_msg = "Now Following the user" + $scope.selectedUser.username;
            });
        } else {
            $scope.fail = true;
            $scope.fail_msg = "Already Following user";
        }
    }

    $scope.unfollowUser = function (index) {
        $scope.selectedIndex = null;
        $scope.selectedUser = null;
        $scope.selectedIndex = index;
        $scope.selectedUser = $scope.users[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedUser" + $scope.selectedUser);
        if (typeof $scope.selectedUser.followers == "undefined") {
            $scope.selectedUser.followers = [];
        }
        var newFollwer = username;
        if ($scope.selectedUser.followers.indexOf(newFollwer) != -1) {
            var unfollowIndex = $scope.selectedUser.followers.indexOf(newFollwer);
            $scope.selectedUser.followers.splice(unfollowIndex,1);
            $http.put("/api/user/" + $scope.selectedUser._id, $scope.selectedUser)
            .success(function (response) {
                $scope.users = response;
                $scope.save = true;
                $scope.save_msg = "Unfollowed the user " + $scope.selectedUser.username + "  successfully! ";
            });
        } else {
            $scope.fail = true;
            $scope.fail_msg = "Not Following user";
        }
    }

    $scope.showfollwingUsers = function (index) {
        $scope.selectedIndex = null;
        $scope.selectedUser = null;
        $scope.selectedIndex = index;
        $scope.selectedUser = $scope.users[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedUser" + $scope.selectedUser);
        if (typeof $scope.selectedUser.followers == "undefined") {
            $scope.selectedUser.followers = [];
        }
        var newFollwer = username;
        if ($scope.selectedUser.followers.indexOf(newFollwer) != -1) {
            return true;
        } else {
            return false;
        }
    }
});