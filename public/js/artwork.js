app.controller("ArtworkController", function ($scope, $routeParams, $http, $sce) {
    
    var username = $routeParams.username;
    $scope.write = true;

    $scope.changetype = function () {
        if ($scope.type == "Image") {
            $scope.write = false;
        } else {
            $scope.write = true;
        }
    }

    $scope.loc = "//placehold.it/100";
    $scope.fail = false;
    var photo = "";

    var handleFileSelect = function (evt) {
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
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $('#filePicker').on('change', handleFileSelect);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    $http.get("/api/myuserartwork/" + username)
    .success(function (response) {
        $scope.artwork = response;
    });

    $scope.add = function () {
        var obj = null;
        if ($scope.type != 'Image') {
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: $scope.artworks, upvotes: 0, comments: [{ username: username, text : "I like this art" } ] };
        } else {
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: photo, upvotes: 0, comments: [{ username: username, text: "I like this art" }] };
        }
        console.log(obj);
        $scope.type = null;
        $scope.artworks = null;
        $http.post("/api/userartwork", obj)
        .success(function (response) {
            console.log(response, "mine");
            $scope.artwork = response;
            var objprofile = {
                username: username,
                artworkid: $scope.artwork[response.length - 1]._id,
            };

            $http.post("/api/updateprofilewithmyartwork", objprofile)
            .success(function (response) {
                console.log(response);
                //toast notification
            });
        });
    };


    $scope.remove = function (id) {
        $http.delete("/api/userartwork/" + id)
        .success(function (response) {
            $scope.artwork = response;
        })
    }

    $scope.upvote = function (id) {
        $http.post("/api/userartworklike/" + id)
        .success(function (response) {
            $scope.artwork = response;
        })
    }

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }


    $scope.showcomments = function (id) {
        $http.delete("/api/userartwork/" + id + "/comments")
        .success(function (response) {
            $scope.artwork = response;
        })
    }

});
