app.controller("HomeController", function ($scope, $routeParams, $http, $sce) {

    //Getting the username from the main function's routeParams
    var username = $routeParams.username;


    // Slides for the carousal 

    $scope.myInterval = 5000;
    var slides = $scope.slides = [
        {
            image: '../images/music.jpg',
            text: 'Music'
        },
        {
            image: '../images/images.jpg',
            text: 'Posters'
        },
        {
            image: '../images/photos.jpg',
            text: 'Photos'
        },
        {
            image: '../images/video.jpg',
            text: 'Video'
        }
        ];

    // Load all the requied artworks on the home page 

    $http.get("/api/userartwork")
    .success(function (response) {
        $scope.artwork = response;
    });

    //Used to display the video links securely

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

   
    //Function used to search the given search string
    $scope.search = function () {
        if ($scope.searchTypeString != null) {
            $http.get("/api/userartwork/searchByType/" + $scope.searchTypeString)
            .success(function (response) {
                $scope.artwork = response;
                $scope.searchTypeString = null;
            });
        } else
            if ($scope.searchNameString != null) {
                $http.get("/api/userartwork/searchByName/" + $scope.searchNameString)
                .success(function (response) {
                    $scope.artwork = response;
                    $scope.searchNameString = null;
            });
        }
    };

    //Function to select the given index
    function selectartwork(index) {
        $scope.selectedIndex = null;
        $scope.selectedArtwork = null;
        $scope.selectedIndex = index
        $scope.selectedArtwork = $scope.artwork[index];
        //console.log("$scope.selectedIndex" + $scope.selectedIndex);
        //console.log("$scope.selectedArtwork" + $scope.selectedArtwork);
    }

    //Function to show the comments for the given index
    $scope.showComment = function (index) {
        selectartwork(index);
        $scope.showcmt = true;
    }

    //Function to show the comments for the given index
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

    //Function to give the index of liked artwork
    function getPreviousLikeIndex(likes, uname) {
        for (i = 0 ; i < likes.length ; i++) {
            if (likes[i].username == uname) {
                return i;
            }
        }
        return -1;
    }

    //Function to remove artwork of perticular index
    $scope.remove = function (id) {
        $http.delete("/api/userartwork/" + id)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    // Function to check if the element has been already liked
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

    // Function to like
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
        //console.log("oldIndex : " + oldIndex);
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

    // Function to check if it is already liked
    $scope.alreadyLiked = function (index) {
        //console.log(username);
        if (username == "undefined") {
            return false;
        }

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

    // Function to unlike
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
        //console.log("oldIndex : " + oldIndex);
        if (oldIndex != -1) {
            $scope.selectedArtwork.likes.splice(oldIndex, 1);
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

});
