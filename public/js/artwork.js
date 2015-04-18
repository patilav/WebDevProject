app.controller("ArtworkController", function ($scope, $routeParams, $http, $sce) {
    $scope.selectedIndex = null;
    $scope.selectedArtwork = null;
    $scope.write = true;
    $scope.commentText = null;
    $scope.liked = false;
    $scope.showcmt = false;

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
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: $scope.artworks, likes: [], comments: [] };
        } else {
            obj = { artworkname: $scope.artworkname, username: username, type: $scope.type, artwork: photo, likes: [], comments: [] };
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

    function selectartwork(index) {
        $scope.selectedIndex = null;
        $scope.selectedArtwork = null;
        $scope.selectedIndex = index
        $scope.selectedArtwork = $scope.artwork[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedArtwork" + $scope.selectedArtwork);
    }

    $scope.showComment = function (index) {
        selectartwork(index);
        $scope.showcmt = true;
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

    function getPreviousLikeIndex(likes, uname) {
        for (i = 0 ; i < likes.length ; i++) {
            if (likes[i].username == uname) {
                return i;
            }
        }
        return -1;
    }

    $scope.like = function (index) {
        selectartwork(index);
        if (typeof $scope.selectedArtwork.likes == "undefined") {
            $scope.selectedArtwork.likes = [];
        }
        var newLike = {
            count: 1,
            username: username
        }
        var oldIndex = getPreviousLikeIndex($scope.selectedArtwork.likes, username);
        console.log("oldIndex : " + oldIndex);
        if (oldIndex != -1) {
            $scope.error = true;
            $scope.errormsg = "Error in liking one of the artworks";
        } else {
            $scope.selectedArtwork.likes.push(newLike);
            $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
            .success(function (response) {
                $scope.artwork = response;
                $scope.likesucess = true;
                $scope.likesucessmsg = "Liked artwork!";
            });
        }
    }

    $scope.alreadyLiked = function (index) {
        if (typeof $scope.artwork[index].likes == "undefined") {
            return false;
        }
        var oldIndex = getPreviousLikeIndex($scope.artwork[index].likes, username);
        if (oldIndex == -1) {
            return false;
        } else {
            return true;
        }
    }

    $scope.unlike = function (index) {
        selectartwork(index);
        if (typeof $scope.selectedArtwork.likes == "undefined") {
            $scope.selectedArtwork.likes = [];
        }
        var newLike = {
            count: 1,
            username: username
        }
        var oldIndex = getPreviousLikeIndex($scope.selectedArtwork.likes, username);
        console.log("oldIndex : " + oldIndex);
        if (oldIndex != -1) {
            $scope.selectedArtwork.likes.splice(oldIndex,1);
            $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
            .success(function (response) {
                $scope.artwork = response;
                $scope.likesucess = true;
                $scope.likesucessmsg = "Unliked artwork!";
            });
        } else {
            $scope.error = true;
            $scope.errormsg = "Error in Unliking one of the artworks";
        }
    }

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

});
