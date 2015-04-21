app.controller("AllProfilesController", function ($scope, $routeParams, $http, $sce) {

    //get the username from routeParams
    var username = $routeParams.username;
    $scope.username = username;
    $scope.fail = false;
    $scope.save = false;

    //get all the user profiles
    $http.get("/api/user")
    .success(function (response) {
        $scope.users = response;
    });

    //function to check if the user is not current user 
    $scope.notCurrentUser = function (listuser) {
        if (username == listuser) {
            return false;
        } else {
            return true;
        }
    }

    //function to delete the user 
    $scope.remove = function (id) {
        $http.delete("/api/user/" + id)
        .success(function (response) {
            $scope.user = response;
        });
    }

    //function to follow the other users

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
    //function to unfollow the other users

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

    //function to follow the other users

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