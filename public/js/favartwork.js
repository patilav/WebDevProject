app.controller("FavArtworkController", function ($scope, $routeParams, $http, $sce) {
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

    populateData();

    function populateData() {
        $http.get("/api/userartwork")
        .success(function (response) {
            $scope.artwork = response;
            getfavArtworks($scope.artwork);
        });
    }

    function getfavArtworks(artwork) {
        var j;
        for (j = 0 ; j < artwork.length; j++) {
            if (getLikesArt(artwork[j].likes) == -1 || typeof artwork[j].likes.length == 0) {
                $scope.artwork.splice(j, 1);
            }
        }

    }

    function getLikesArt (likes) {
        var i;
        for (i = 0; i < likes.length ; i++) {
            if (likes[i].username == username) {
                return i;
            } 
        }
        if (i == likes.length) { 
            return -1;
        }
    }


    $scope.getLikeableArtwork = function (likes) {
        var i;
        for (i = 0; i < likes.length ; i++) {
            if (likes[i].username == username) {
                return true;
            } else {
                return false;
            }
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


    function getUsername() {
        return username;
    }

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

    $scope.addComments = function (comment) {
        if (typeof $scope.selectedArtwork.comments == "undefined") {
            $scope.selectedArtwork.comments = [];
        }
        var newComment = {
            text: comment.text,
            username: username
        }
        $scope.selectedArtwork.comments.push(newComment);
        $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    function getPreviousLikeIndex(likes, uname) {
        for (i = 0 ; i < likes.length ; i++) {
            console.log("Likes " + likes[i].username+ " uname "+uname);
            if (likes[i].username == uname) {
                console.log("Return value vaule: " + i);
                return i;
            }
        }
        console.log("Return value vaule: " + -1);
        return -1;
    }

    $scope.alreadyLiked = function (index) {
        if (typeof $scope.artwork[index].likes == "undefined") {
            return false;
        }
        var oldIndex = getPreviousLikeIndex($scope.artwork[index].likes, username);

        console.log("alreadyLiked vaule: " + oldIndex);
        if (oldIndex == -1) {
            return false;
        } else {
            return true;
        }
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
                populateData();
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
            $scope.selectedArtwork.likes.splice(oldIndex, 1);
            $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
            .success(function (response) {
                $scope.artwork = response;
                populateData();
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
