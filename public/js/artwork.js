app.controller("ArtworkController", function ($scope, $routeParams, $http, $sce) {
    $scope.selectedIndex = null;
    $scope.selectedArtwork = null;
    $scope.write = true;
    $scope.commentText = null;

    var username = $routeParams.username;

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

    populateData();

    function populateData() {
        $http.get("/api/myuserartwork/" + username)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    $scope.addArtwork = function () {
        var obj = null;
        if ($scope.type != 'Image') {
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: $scope.artworks, upvotes: 0, comments: [] };
        } else {
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: photo, upvotes: 0, comments: [] };
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

    $scope.showComment = function (index) {
        $scope.selectedIndex = null;
        $scope.selectedArtwork = null;
        $scope.selectedIndex = index
        $scope.selectedArtwork = $scope.artwork[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedArtwork" + $scope.selectedArtwork);
    }

    $scope.remove = function (id) {
        $http.delete("/api/userartwork/"+ id + "/" + username)
        .success(function (response) {
                   $scope.artwork = response;
        });
    }

    $scope.addComments = function (comment) {
        if (typeof $scope.selectedArtwork.comments == "undefined") {
            $scope.selectedArtwork.comments = [];
        }
        var newComment = {
            text: comment.text,
            username : username
        }
        $scope.selectedArtwork.comments.push(newComment);
        $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    $scope.upvote = function () {
        if (typeof $scope.selectedArtwork.likes == "undefined") {
            $scope.selectedArtwork.likes = [];
        }
        var newLike = {
            count: 1,
            username: username
        }
        $scope.selectedArtwork.likes.push(newLike);
        $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

});
