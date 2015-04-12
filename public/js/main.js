var app = angular.module("ArtisticCollab", ["ngRoute", "ui.bootstrap"]);

app.controller("NavController", function ($scope, LoginService, $location, $modal) {
    $scope.currentUser = null;
    $scope.color = "btn btn-success";
    $scope.signUp = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/signup.html',
            controller: 'SignupController'
        });
    }

    $scope.login = function () {
        LoginService.login($scope.user, callback);
    }

    function callback() {
        $scope.currentUser = LoginService.getCurrentUser();

        if ($scope.currentUser)
            $scope.color = "btn btn-success";
        else
            $scope.color = "btn btn-danger";
    }

    $scope.logout = function () {
        $scope.user.username = null;
        $scope.user.password = null;
        var res = LoginService.logout();
        $scope.currentUser = null;
        $location.path('partials/home.html');
    }
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        }).
        when('/profile/:username', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileController'
        }).
        when('/comment/:username', {
            templateUrl: 'partials/comment.html',
            controller: 'CommentController'
        }).
        when('/artwork/:username', {
            templateUrl: 'partials/artwork.html',
            controller: 'ArtworkController'
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
      otherwise({
          redirectTo: 'partials/home.html'
      });
}]);

app.factory("LoginService", function ($http) {
    var currentUser = null;

    var signUp = function (username, password, email, firstName, lastName, photo, callback) {
        var user = {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            photo: photo
        };
        $http.post("/api/signup", user)
        .success(function (response) {
            if (response.response == 'false')
                callback(false);
            else
                callback(true);
        });
    }

    var login = function (user, callback) {
        $http.post("/api/login", user)
        .success(function (response) {
            currentUser = response[0];
            callback();
        });
    }

    var logout = function () {
        currentUser = null;
    }

    var updateCurrentUserPhoto = function (photo) {
        currentUser.photo = photo;
    }

    var updateCurrentUser = function (password, email, firstName, lastName) {
        currentUser.password = password;
        currentUser.email = email;
        currentUser.firstName = firstName;
        currentUser.lastName = lastName;

        $http.post("/api/updateprofile", currentUser)
        .success(function (response) {
            currentUser = response;
        });
    }

    var getCurrentUser = function () {
        return currentUser;
    }

    return {
        login: login,
        getCurrentUser: getCurrentUser,
        logout: logout,
        updateCurrentUser: updateCurrentUser,
        updateCurrentUserPhoto: updateCurrentUserPhoto,
        signUp: signUp
    }
});