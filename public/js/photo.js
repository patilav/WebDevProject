var app = angular.module("MyApp", ["ngRoute", "ui.bootstrap"]);

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
          templateUrl: 'partials/home.html'
      }).
        when('/profile/:username', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileController'
        }).
        when('/comment/:username', {
            templateUrl: 'partials/comment.html',
            controller: 'CommentController'
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
        $http.post("/mongodb/002-signup", user)
        .success(function (response) {
            if (response.response == 'false')
                callback(false);
            else
                callback(true);
        });
    }

    var login = function (user, callback) {
        $http.post("/mongodb/000-login", user)
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

        $http.post("/mongodb/000-update", currentUser)
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

app.controller("ProfileController", function ($scope, LoginService, $routeParams) {

    var username = $routeParams.username;
    $scope.username = username;
    var currentUser = LoginService.getCurrentUser();

    $scope.firstname_edit = currentUser.firstName;
    $scope.lastname_edit = currentUser.lastName;
    $scope.email_edit = currentUser.email;
    $scope.password_edit = currentUser.password;
    $scope.repassword_edit = currentUser.password;

    if (currentUser.photo == "")
        $scope.loc = "//placehold.it/100";
    else
        $scope.loc = currentUser.photo;
    $scope.match = false;
    $scope.save = false;

    var handleFileSelect = function (evt) {
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $scope.loc = "data:image/jpeg;base64," + btoa(binaryString);
                LoginService.updateCurrentUserPhoto($scope.loc);
            };

            reader.readAsBinaryString(file);
        }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    $scope.saveChanges = function () {
        var password = $scope.password_edit;
        var repassword = $scope.repassword_edit;
        var email = $scope.email_edit;
        var firstName = $scope.firstname_edit;
        var lastName = $scope.lastname_edit;

        if (password != repassword) {
            $scope.match = true;
            $scope.save = false;
        } else {
            $scope.match = false;
            $scope.save = true;
            LoginService.updateCurrentUser(password, email, firstName, lastName);
        }
    }
});

app.controller("CommentController", function ($scope, $routeParams, $http) {
    var username = $routeParams.username;

    $http.get("/mongodb/000-comment")
    .success(function (response) {
        $scope.comments = response;
    });

    $scope.add = function (text) {
        var obj = { username: username, text: text };
        $scope.text = null;
        $http.post("/mongodb/000-comment", obj)
        .success(function (response) {
            $scope.comments = response;
        });
    };
});

app.controller("SignupController", function ($scope, $modalInstance, LoginService, $http) {
    $scope.loc = "//placehold.it/100";
    $scope.fail = false;
    var photo = "";

    function callback(res) {
        if (res == false) {
            $scope.fail = true;
            $scope.fail_msg = "Username already exists";
        } else {
            $modalInstance.dismiss('cancel');
        }

    };

    var handleFileSelect = function (evt) {
        console.log("asd");
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $scope.loc = "data:image/jpeg;base64," + btoa(binaryString);
                $scope.$apply();
                photo = $scope.loc;
            };

            reader.readAsBinaryString(file);
        }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $('#filePicker').change(handleFileSelect);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    $scope.ok = function () {

        var username = $scope.username_edit;
        var password = $scope.password_edit;
        var repassword = $scope.repassword_edit;
        var email = $scope.email_edit;
        var firstName = $scope.firstname_edit;
        var lastName = $scope.lastname_edit;

        var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
        var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;

        if (firstName == null || firstName == "") {
            $scope.fail = true;
            $scope.fail_msg = "Enter First Name";
        } else if (lastName == null || lastName == "") {
            $scope.fail = true;
            $scope.fail_msg = "Enter Last Name";
        } else if (email == null || email == "" || !emailFilter.test(email) || email.match(illegalChars)) {
            $scope.fail = true;
            $scope.fail_msg = "Provide a valid email address";
        } else if (username == null || username == "") {
            $scope.fail = true;
            $scope.fail_msg = "Enter UserName";
        } else if (password != repassword) {
            $scope.fail = true;
            $scope.fail_msg = "Passwords must match";
        } else if (password == "" || repassword == "" || password.length < 6 || !password.match(/[a-zA-Z]/) || !password.match(/[0-9]/)) {
            $scope.fail = true;
            $scope.fail_msg = "Password must be atleast 6 characters long with a number in it";
        } else {
            LoginService.signUp(username, password, email, firstName, lastName, photo, callback);
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});