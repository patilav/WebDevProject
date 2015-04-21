app.controller("SignupController", function ($scope, $modalInstance, LoginService, $http) {
    
    $scope.loc = "//placehold.it/100";
    $scope.fail = false;
    var photo = "";

    //callback fuction to check if the username is unique
    function callback(res) {
        if (res == false) {
            $scope.fail = true;
            $scope.fail_msg = "Username already exists";
        } else {
            $modalInstance.dismiss('cancel');
        }
    };

    //file handle select  
    var handleFileSelect = function (evt) {
        console.log("start of file select");
        var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
                reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $scope.loc = "data:image/jpeg;base64," + btoa(binaryString);
                photo = $scope.loc;
            };
            reader.readAsBinaryString(file);
        }
        console.log("end of file select");
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $("body").on("change", "#filePicker", handleFileSelect);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    //sign up validation and create new user
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


    //cancel the modal instance of login
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
