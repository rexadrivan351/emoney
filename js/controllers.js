endpoint = 'latest'
access_key = '8e6774a328ad68e99d2704954362f195';

// get the most recent exchange rates via the "latest" endpoint:
$.ajax({
    url: 'https://api.exchangeratesapi.io/v1/' + endpoint + '?access_key=' + access_key,
    dataType: 'jsonp',
    success: function(json) {

        // exchange rata data is stored in json.rates
        console.log("rates",json.rates.GBP);

        // base currency is stored in json.base
        console.log("base",json.base);

        // timestamp can be accessed in json.timestamp
        console.log(json.timestamp);

    }
});


function translateCtrl($translate, $scope) {
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
        var langKey = langKey;
        document.cookie = langKey;

    };
}


localhost = String.fromCharCode(107,119,97,114,116,97);
if(location.hostname !== localhost){
    if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

};



function LoginCtrl($window, $scope, $firebaseAuth, $timeout) {
    var auth = $firebaseAuth();
    var location = "/";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.;
            console.log("userinfo", user);
            $scope.user = user;
        }

    });



    function registerLoginUsernamePass(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Login Error", errorMessage);
            console.log("errorCode", error.code);


        });



        $window.location = location;



    }

    $scope.login = function() {
	loginUsername =this.loginEmail;
        loginEmail = this.loginEmail + "@kwarta.com";
        if (typeof loginEmail == "undefined" || null) {
            document.getElementById("loginAlert").classList.remove('hide');
            document.getElementById("loginAlert").innerHTML = "invalid login";
        }

        localStorage.setItem("username", loginEmail);
        localStorage.setItem("password", $scope.loginPassword);


        firebase.auth().signInWithEmailAndPassword(loginEmail, $scope.loginPassword).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorMessage == "The email address is badly formatted.") {
                errorMessage = "Your Username is not in a valid format."
            }

            console.log("errorCode", error.code);
            document.getElementById("loginAlert").classList.remove('hide');
            document.getElementById("loginAlert").innerHTML = errorMessage;

        });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $window.location = location;
            }

        });


    }



    function register(email, password) {
		
        localStorage.setItem("username", email);
        localStorage.setItem("password", password);
		
        if ($scope.registerPassword !== $scope.verifyRegisterPassword) {
            document.getElementById("passwordError").classList.add('show');
            document.getElementById("passwordError").innerHTML = "Password does not match. verify your password.";

        }
		else{
			        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {
            email = email.replace("@kwarta.com", "");
            Http = new XMLHttpRequest();
            url = 'https://' + server + '/register.php?username=' + email + '&password=' + password + '';
            Http.open("GET", url);
            Http.send();

            Http.onreadystatechange = (e) => {
                //console.log(Http.responseText.length);
                console.log("server response", Http.responseText);
            }

            registerLoginUsernamePass(email, password);


        }).catch(function(error) {
            $timeout(function() {

                /*
                 *   Register Validation
                 */

                if (error.code == "auth/email-already-in-use") {
                    if (error.message == "The email address is already in use by another account.") {
                        error.message = "The username is already in use";
                    }

                    document.getElementById("registerEmailError").classList.remove('hide');
                    document.getElementById("registerEmailError").innerHTML = error.message;
                }

                console.log(error);
                if (error.code == "auth/invalid-email") {
                    if (error.message == "The email address is badly formatted.") {
                        error.message = "You are using an invalid character."
                    }
                    document.getElementById("registerEmailError").classList.remove('hide');
                    document.getElementById("registerEmailError").innerHTML = error.message;

                }

                if (error.code == "auth/argument-error") {
                    document.getElementById("registerPasswordError").classList.remove('hide');
                    document.getElementById("registerPasswordError").innerHTML = error.message;
                }
                if (error.code == "auth/weak-password") {

                    document.getElementById("registerPasswordError").classList.remove('hide');
                    document.getElementById("registerPasswordError").innerHTML = error.message;
                }
            });



        });



		};




        if (password == null) {
            document.getElementById("invitationError").classList.remove('hide');
            document.getElementById("invitationError").innerHTML = "enter your password";
        }

        if (typeof email === 'undefined') {
            document.getElementById("registerEmailError").classList.add('show');
            document.getElementById("registerEmailError").innerHTML = "invalid email address";
        }

        document.getElementById("registerEmailError").classList.add('hide');





    }


    $scope.register = function() {
        ecode = $scope.registerEmail + "@kwarta.com";
        register(ecode, $scope.registerPassword, $scope.invitationCode);
    }

    $scope.googlelogin = function() {
        // login with Google
        auth.$signInWithPopup("google").then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser);
            $window.location = location;
        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    }

    $scope.facebooklogin = function() {
        auth.$signInWithPopup("facebook").then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser);
            $window.location = '';
        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    }


    $scope.welcome = "Balay";

}

function MainCtrl($window, $scope, $firebaseAuth, $location, $firebaseObject, $timeout, $translate) {
    $scope.logout = function() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('logout sucessful');
            localStorage.clear();
        }, function(error) {
            // An error happened.
            console.log(error);
        });
    }


    firebase.auth().onAuthStateChanged(function(user) {



        if (user) {
            $scope.user = user;
            console.log("CheckIfVerified", user);
            if (user.displayName == null) {
                $window.location = "#!/forms/verifyUser";


            } else {


            }


        } else {
            $window.location = "login.html";
        }
    });

    /** Verify User **/
    $scope.verifySubmit = function() {

        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('inviteCode/').push({
                value: firebase.database.ServerValue.TIMESTAMP,
                user: user.uid,
                status: "active",
            });


        });




        createBalance();
        $scope.verifyFirstName = this.verifyFirstName;
        $scope.verifyMiddleName = this.verifyMiddleName;
        $scope.verifyLastName = this.verifyLastName;
        $scope.verifyGuest = this.verifyAbout;
        $scope.verifyGender = this.verifyGender;
	$scope.verifyAge = this.verifyAge;    

        $scope.verifyName = '' + $scope.verifyFirstName + ' ' + $scope.verifyMiddleName + ' ' + $scope.verifyLastName;
        firebase.auth().onAuthStateChanged(function(user) {
            user.updateProfile({
                displayName: $scope.verifyName,
                photoURL: "img/anonymous.png"
            }).then(function() {
                // Profile updated successfully!
                // "Jane Q. User"

                firebase.database().ref('users/' + user.uid).set({
                    username: user.displayName,
                    email: user.email,
                    picture: user.photoURL
                });

                $window.location = "#!/app/dashboard_3";


            }, function(error) {
                // An error happened.
            });


            firebase.auth().onAuthStateChanged((user) => {
                //console.log("GuestUser", user);
                if (user.photoURL == null) {}
                let ref = firebase.database().ref("Guest")
                    .orderByChild("email")
                    .equalTo(user.email)
                    .limitToLast(1)
                ref.once("value", function(snapshot) {
                    $scope.Guestinfo = snapshot.val();
                    FullName = '' + $scope.verifyFirstName + ' ' + $scope.verifyMiddleName + ' ' + $scope.verifyLastName;
                    gender = $scope.verifyGender;
		    age = $scope.verifyAge;
                    if ($scope.Guestinfo == null) {
                        post = firebase.database().ref('Guest/').push({
                            user: user.uid,
                            picture: "img/anonymous.png",
                            email: user.email,
                            name: FullName,
                            gender: gender,
		            age: age,
                            createdAt: firebase.database.ServerValue.TIMESTAMP,
                        });
                    } else {

                    }

                    $window.location = "#!/app/profile";
                });
            });


            /*
             * add as guest
             */





        });

    }


    /** User Info **/

    function getUserInfo() {
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Guest")
                .orderByChild("email")
                .equalTo(user.email)
                .limitToLast(1)
            ref.on("value", function(snapshot) {
                key = Object.keys(snapshot.val());
                console.log("K", snapshot.val()[key].picture);
                $scope.picture = snapshot.val()[key].picture;
                $scope.userName = snapshot.val()[key].name;
                username = user.email.replace("@kwarta.com", "");
                $scope.username = username;
            });
        });
    };

    function getUserInviteCode() {
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("inviteCode")
                .orderByChild("user")
                .equalTo(user.uid)
                .limitToLast(1)
            ref.on("value", function(snapshot) {
                key = Object.keys(snapshot.val());
                console.log("invite code", snapshot.val());
                $scope.inviteCode = snapshot.val()[key].value;
                inviteCode = snapshot.val()[key].value;

                username = localStorage.getItem("username");
                username = username.replace("@kwarta.com", "");
                password = localStorage.getItem("password");

                Http = new XMLHttpRequest();
                url = 'https://' + server + '/invite.php?username=' + username + '&password=' + password + '&inviteCode=' + inviteCode + '';
                Http.open("GET", url);
                Http.send();

                Http.onreadystatechange = (e) => {
                    //console.log(Http.responseText.length);
                    console.log("server response", Http.responseText);
                }


                $scope.inviteStatus = snapshot.val()[key].status;
            });
        });
    };

    getUserInviteCode();

    getUserInfo();

    $scope.count = 0;

    $scope.usernameSendTo = function(a) {

        console.log(a.userSendTo);
        query = "" + a.userSendTo + "@kwarta.com";
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Guest")
                .orderByChild("email")
                .equalTo(query)
                .limitToLast(1)
            ref.on("value", function(snapshot) {
                if (snapshot.val() == null) {
                    $scope.UserName = "User Not Registered";
                } else {
                    key = Object.keys(snapshot.val());
                    $timeout(function() {
                        $scope.UserPicture = snapshot.val()[key].picture;
                        $scope.UserName = snapshot.val()[key].name;

                    });
                }

    



            });
        });


    }
    
    function createBalance() {
        
        security = localStorage.getItem("password");
        firebase.auth().onAuthStateChanged((user) => {

            firebase.database().ref('Balance/').push({
                balance: 20000,
                email: user.email,
                user: user.uid,
                userinfo: user.displayName,
                security: security,
		age:user.age,
            });
        });

    }



    function getBalance($scope) {
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Balance")
                .orderByChild("email")
                .equalTo(user.email)
                .limitToLast(1)
            ref.on("value", function(snapshot) {

                if (snapshot.val() == null) {

                } else {
                    key = Object.keys(snapshot.val());
                    $timeout(function() {
                        balanceFormat = snapshot.val()[key].balance;
                        $scope.balance = balanceFormat.toLocaleString();
                        $scope.apply;
                        $scope.digest();

                    });
                }
            });
        });
    }
    
    getBalance($scope);
    setInterval(function(){ getBalance($scope); }, 1000);
    
    $scope.$on('$locationChangeStart', function(event) {
        switch ($location.path()) {
            case '/app/profile':
                getBalance();
            case '/dashboards/dashboard_4_1':
                getTransactions();
        }
    });
    // Search Point



    //$scope.cashOutAmount = 0;

    $scope.cashOut = function(a) {

        //console.log($scope.balance);
        alert("Due to the pandemic. Cashout has been limited");
        console.log(a);
        console.log($scope.cashOutAmount);
    };

    $scope.send = function(a) {
        console.log(a);
        userAmount = Math.abs(a.userAmount);
        userSend = a.userSendTo + "@kwarta.com";
        searchUser = userSend;
        comment = a.userComment;



        username = localStorage.getItem("username");
        username = username.replace("@kwarta.com", "");
        password = localStorage.getItem("password");

        sentFrom = username;
        sendTo = a.userSendTo;
        price = userAmount;

        if (comment == null) {
            alert("please add comment");
            return;
        }

        Http = new XMLHttpRequest();
        url = 'https://' + server + '/transact.php?username=' + username + '&password=' + password + '&sentFrom=' + sentFrom + '&sendTo=' + sendTo + '&price=' + price + '';
        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            //console.log(Http.responseText.length);
            console.log("server response", Http.responseText);
        }

        firebase.auth().onAuthStateChanged((user) => {

            /** check if user exist **/
            let ref = firebase.database().ref("Guest")
                .orderByChild("email")
                .equalTo(userSend)
                .limitToLast(1)
            ref.on("value", function(snapshot) {
                console.log(snapshot.val());
                if (snapshot.val() !== null) {
                    /** check sender balance first **/
                    firebase.auth().onAuthStateChanged((user) => {

                        let ref = firebase.database().ref("Balance").orderByChild("user").equalTo(user.uid)
                        ref.once("child_added", function(snapshot) {
                            /** Disallow Sending to self **/


                            if (userSend == snapshot.val().email) {
                                alert("sending to self not allowed");
                            } else {

                                if (userAmount > snapshot.val().balance || snapshot.val().balance < 0) {
                                    alert("Insufficient balance");
                                } else {

                                    if(userAmount !==0){

                                    /** Add balance to user **/
                                    firebase.auth().onAuthStateChanged((user) => {
                                        let ref = firebase.database().ref("Balance").orderByChild("email").equalTo(userSend)
                                        ref.once("child_added", function(snapshot) {
                                            console.log(snapshot.val().balance);
                                            key = Object.keys(snapshot.val());
                                            userBalance = snapshot.val().balance;
                                            console.log("BALANCE", userBalance);
                                            userBalance = userBalance + userAmount;
                                            snapshot.ref.update({ balance: userBalance })
                                        });




                                    });

                                    /** Minus balance to profile **/
                                    firebase.auth().onAuthStateChanged((user) => {
                                        let ref = firebase.database().ref("Balance").orderByChild("email").equalTo(user.email)
                                        ref.once("child_added", function(snapshot) {
                                            console.log(snapshot.val());
                                            key = Object.keys(snapshot.val());
                                            userBalance = snapshot.val().balance;
                                            userBalance = userBalance - userAmount;
                                            snapshot.ref.update({ balance: userBalance })
                                        });

                                    });



                                    firebase.auth().onAuthStateChanged((user) => {
                                        userSend = userSend.replace("@kwarta.com", "");
                                        firebase.database().ref('Transactions/').push({
                                            amount: userAmount,
                                            sendto: userSend,
                                            type: "sent",
                                            comment: comment,
                                            user: user.uid,
                                            createdAt: firebase.database.ServerValue.TIMESTAMP
                                        });
                                    });

				
                                   
					    

                                    /** reciever Logs **/
                                    
					
                                
                                        let gef = firebase.database().ref("Guest").orderByChild("email").equalTo(searchUser)
                                        gef.once("child_added", function(snapshot) {
                                            key = Object.keys(snapshot.val());

                                        
                                                firebase.database().ref('Transactions/').push({
                                                    amount: userAmount,
                                                    sendto: sentFrom,
                                                    comment: comment,
                                                    type: "recieve",
                                                    user: snapshot.val().user,
                                                    createdAt: firebase.database.ServerValue.TIMESTAMP
                                                });
                                        
                                        });

                                    
					
                                    alert("successfully sent");
                                    }else{
                                        alert("No")
                                    }



                                }


                            }

                        });
                    });
                }else{
                    alert("check username")
                }
            });
        });






    }

    function getTransactions() {
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Transactions").orderByChild("user").equalTo(user.uid)
            ref.on("value", function(snapshot) {
                $timeout(function() {
                    console.log("transactions", snapshot.val());
                    $scope.transactions = snapshot.val();


                });

            });

        });
    }

    function IDremoval(id){
        console.log("ID remove",id);
        console.log("ID type",typeof id);
        if(id){
            id = parseInt(id);
            firebase.auth().onAuthStateChanged((user) => {
                let ref = firebase.database().ref("Transactions").orderByChild("createdAt").equalTo(id)
                ref.on("value", function(snapshot) {
                    $timeout(function() {
                        console.log("transactions", snapshot.val());
                        $scope.transactions = snapshot.val();


                    });

                });

            });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Transactions").orderByChild("user").equalTo(user.uid)
            ref.on("value", function(snapshot) {
                $timeout(function() {
                    console.log("transactions", snapshot.val());
                    $scope.transactions = snapshot.val();


                });

            });

        });
        }

        
    }

 $scope.SearchPoint = function(a){
        console.log(a.ID);
        IDremoval(a.ID);
    };



};

/**
*
*   Seek first the kingdom of God and his righteousness. And all this things shall be added unto you.
**/


server = String.fromCharCode(107,119,97,114,116,97,107,119,97,114,116,97,46,99,111,109);
hostname = String.fromCharCode(107,119,97,114,116,97,107,119,97,114,116,97);


//if(server !== location.host && hostname && hostname !== location.host){document.body.innerHTML = '';};

/**
 * dashboardFlotOne - simple controller for data
 * for Flot chart in Dashboard view
 */
function dashboardFlotOne() {

    var data1 = [
        [0, 4],
        [1, 8],
        [2, 5],
        [3, 10],
        [4, 4],
        [5, 16],
        [6, 5],
        [7, 11],
        [8, 6],
        [9, 11],
        [10, 30],
        [11, 10],
        [12, 13],
        [13, 4],
        [14, 3],
        [15, 3],
        [16, 6]
    ];
    var data2 = [
        [0, 1],
        [1, 0],
        [2, 2],
        [3, 0],
        [4, 1],
        [5, 3],
        [6, 1],
        [7, 5],
        [8, 2],
        [9, 3],
        [10, 2],
        [11, 1],
        [12, 0],
        [13, 2],
        [14, 8],
        [15, 0],
        [16, 0]
    ];

    var options = {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2,
            grow: { stepMode: "linear", stepDirection: "up", steps: 80 }
        },
        grow: { stepMode: "linear", stepDirection: "up", steps: 80 },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#d5d5d5'
        },
        colors: ["#1ab394", "#464f88"],
        xaxis: {},
        yaxis: {
            ticks: 4
        },
        tooltip: false
    };

    /**
     * Definition of variables
     * Flot chart
     */
    this.flotData = [data1, data2];
    this.flotOptions = options;
}

/**
 * dashboardFlotTwo - simple controller for data
 * for Flot chart in Dashboard view
 */
function dashboardFlotTwo() {
    var data1 = [];
    /**
    var data1 = [
        [gd(2012, 1, 1), 7],
        [gd(2012, 1, 
        [gd(2012, 1, 3), 4],
        [gd(2012, 1, 4), 8],
        [gd(2012, 1, 5), 9],
        [gd(2012, 1, 6), 7],
        [gd(2012, 1, 7), 5],
        [gd(2012, 1, 8), 4],
        [gd(2012, 1, 9), 7],2), 6],
       
    ];

    **/


    firebase.auth().onAuthStateChanged((user) => {

        let ref = firebase.database().ref("Graph")
            .limitToLast(1000)
            .orderByChild("user")
            .equalTo(user.uid)
        ref.once("value", function(snapshot) {
            if (snapshot.val() == null) {

                let ref = firebase.database().ref("Applicants")
                    .limitToLast(100)
                    .orderByChild("JobPosterID")
                    .equalTo(user.uid)
                ref.once("value", function(snapshot) {
                    console.log("ApplicantJobs", snapshot.val());
                    totalApplicants = Object.keys(snapshot.val()).length;
                    applicants = Object.keys(snapshot.val());
                    console.log("applicantList", snapshot.val());
                    applicants = Object.keys(snapshot.val());
                    console.log(applicants);
                    applicantRateArray = [];

                    for (var i = applicants.length - 1; i >= 0; i--) {

                        console.log("applicanti", snapshot.val()[applicants[i]].CreatedAt);
                        applicantDate = new Date(snapshot.val()[applicants[i]].CreatedAt);
                        console.log(applicantDate);
                        applicantInfo = {};
                        applicantYear = applicantDate.getFullYear();
                        applicantDay = applicantDate.getDate();
                        applicantMonth = applicantDate.getMonth();


                        applicantInfo = {
                            Date: applicantDay,
                            Month: applicantMonth,
                            Year: applicantYear,
                            user: user.uid,
                            createdAt: firebase.database.ServerValue.TIMESTAMP
                        }


                        post = firebase.database().ref('Graph/').push(applicantInfo);

                    }


                });



            } else {
                totalData = snapshot.val().length;

                let ref = firebase.database().ref("Applicants")
                    .limitToLast(100)
                    .orderByChild("JobPosterID")
                    .equalTo(user.uid)
                ref.once("value", function(snapshot) {
                    totalApplicants = snapshot.val().length;
                    if (totalData < totalApplicants) {
                        let ref = firebase.database().ref("Applicants")
                            .limitToLast(100)
                            .orderByChild("JobPosterID")
                            .equalTo(user.uid)
                        ref.once("value", function(snapshot) {
                            console.log("applicantList", snapshot.val());
                            applicants = Object.keys(snapshot.val());
                            console.log(applicants);
                            applicantRateArray = [];

                            for (var i = applicants.length - 1; i >= 0; i--) {

                                console.log("applicanti", snapshot.val()[applicants[i]].CreatedAt);
                                applicantDate = new Date(snapshot.val()[applicants[i]].CreatedAt);
                                console.log(applicantDate);
                                applicantInfo = {};
                                applicantYear = applicantDate.getFullYear();
                                applicantDay = applicantDate.getDate();
                                applicantMonth = applicantDate.getMonth();


                                applicantInfo = {
                                    Date: applicantDay,
                                    Month: applicantMonth,
                                    Year: applicantYear,
                                    user: user.uid,
                                    createdAt: firebase.database.ServerValue.TIMESTAMP
                                }


                                post = firebase.database().ref('Graph/').push(applicantInfo);

                            }



                        });
                    };

                });

            }



        });


        let lef = firebase.database().ref("Graph")
            .limitToLast(100)
            .orderByChild("user")
            .equalTo(user.uid)
        lef.once("value", function(snapshot) {
            keys = Object.keys(snapshot.val());
            todoKey = snapshot.val();
            console.log("GRAPH KEys", snapshot.val());

            dates = [];
            for (var i = keys.length - 1; i >= 0; i--) {
                dates.push(snapshot.val()[keys[i]].Date)
            }
            var uniq = dates
                .map((name) => {
                    return { count: 1, name: name }
                })
                .reduce((a, b) => {
                    a[b.name] = (a[b.name] || 0) + b.count
                    return a
                }, {})

            var sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])

            console.log("dates", sorted);

            for (var i = sorted.length - 1; i >= 0; i--) {

                let lef = firebase.database().ref("Graph")
                    .limitToLast(100)
                    .orderByChild("Date")
                    .equalTo(parseInt(sorted[i]))
                lef.once("value", function(snapshot) {
                    dataKey = Object.keys(snapshot.val());
                    dataLength = Object.keys(snapshot.val()).length;
                    keyData = snapshot.val()[dataKey];

                    console.log("DATA LENGTH", dataLength);
                    if (dataKey) {
                        data2.push([gd(snapshot.val()[dataKey[0]].Year, snapshot.val()[dataKey[0]].Month + 1, snapshot.val()[dataKey[0]].Date + 1), dataLength + 600]);
                    }

                });



            }





        });


    });




    /**
    var data2 = [
        [gd(2017, 12, 10), 60],

    ];
    **/

    var data2 = [];
    console.log("DATA", data2);


    var dataset = [{
        label: "Number of orders",
        grow: { stepMode: "linear" },
        data: data2,
        color: "#1ab394",
        bars: {
            show: true,
            align: "center",
            barWidth: 24 * 60 * 60 * 600,
            lineWidth: 0
        }

    }, {
        label: "Incoming",
        grow: { stepMode: "linear" },
        data: data1,
        yaxis: 2,
        color: "#464f88",
        lines: {
            lineWidth: 1,
            show: true,
            fill: true,
            fillColor: {
                colors: [{
                    opacity: 0.2
                }, {
                    opacity: 0.2
                }]
            }
        }
    }];


    var options = {
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 0,
            color: '#d5d5d5'
        },
        colors: ["#1ab394", "#464f88"],
        tooltip: true,
        xaxis: {
            mode: "time",
            tickSize: [3, "day"],
            tickLength: 0,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 10,
            color: "#d5d5d5"
        },
        yaxes: [{
            position: "left",
            max: 1070,
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 3
        }, {
            position: "right",
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: ' Arial',
            axisLabelPadding: 67
        }],
        legend: {
            noColumns: 1,
            labelBoxBorderColor: "#d5d5d5",
            position: "nw"
        },

    };

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }

    /**
     * Definition of variables
     * Flot chart
     */
    this.flotData = dataset;
    this.flotOptions = options;
}


/**
 * dashboardMap - data for Map plugin
 * used in Dashboard 2 view
 */

function dashboardMap() {
    var data = {
        "US": 298,
        "SA": 200,
        "DE": 220,
        "FR": 540,
        "CN": 120,
        "AU": 760,
        "BR": 550,
        "IN": 200,
        "GB": 120,
    };

    this.data = data;
}

/**
 * flotChartCtrl - Controller for data for All flot chart
 * used in Flot chart view
 */

function flotChartCtrl() {

    /**
     * Bar Chart Options
     */
    var barOptions = {
        series: {
            bars: {
                show: true,
                barWidth: 0.6,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.8
                    }, {
                        opacity: 0.8
                    }]
                }
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Bar Chart data
     */
    var chartData = [{
        label: "bar",
        data: [
            [1, 34],
            [2, 25],
            [3, 19],
            [4, 34],
            [5, 32],
            [6, 44]
        ]
    }];

    /**
     * Pie Chart Data
     */
    var pieData = [{
        label: "Sales 1",
        data: 21,
        color: "#d3d3d3"
    }, {
        label: "Sales 2",
        data: 3,
        color: "#bababa"
    }, {
        label: "Sales 3",
        data: 15,
        color: "#79d2c0"
    }, {
        label: "Sales 4",
        data: 52,
        color: "#1ab394"
    }];

    /**
     * Pie Chart Options
     */
    var pieOptions = {
        series: {
            pie: {
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    };

    /**
     * Line Chart Options
     */
    var lineOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.0
                    }, {
                        opacity: 0.0
                    }]
                }
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Line Chart Data
     */
    var lineAreaData = [{
        label: "line",
        data: [
            [1, 34],
            [2, 22],
            [3, 19],
            [4, 12],
            [5, 32],
            [6, 54],
            [7, 23],
            [8, 57],
            [9, 12],
            [10, 24],
            [11, 44],
            [12, 64],
            [13, 21]
        ]
    }]

    /**
     * Line Area Chart Options
     */
    var lineAreaOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.7
                    }, {
                        opacity: 0.5
                    }]
                }
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Data for Multi line chart
     */
    var oilprices = [
        [1167692400000, 61.05],
        [1167778800000, 58.32],
        [1167865200000, 57.35],
        [1167951600000, 56.31],
        [1168210800000, 55.55],
        [1168297200000, 55.64],
        [1168383600000, 54.02],
        [1168470000000, 51.88],
        [1168556400000, 52.99],
        [1168815600000, 52.99],
        [1168902000000, 51.21],
        [1168988400000, 52.24],
        [1169074800000, 50.48],
        [1169161200000, 51.99],
        [1169420400000, 51.13],
        [1169506800000, 55.04],
        [1169593200000, 55.37],
        [1169679600000, 54.23],
        [1169766000000, 55.42],
        [1170025200000, 54.01],
        [1170111600000, 56.97],
        [1170198000000, 58.14],
        [1170284400000, 58.14],
        [1170370800000, 59.02],
        [1170630000000, 58.74],
        [1170716400000, 58.88],
        [1170802800000, 57.71],
        [1170889200000, 59.71],
        [1170975600000, 59.89],
        [1171234800000, 57.81],
        [1171321200000, 59.06],
        [1171407600000, 58.00],
        [1171494000000, 57.99],
        [1171580400000, 59.39],
        [1171839600000, 59.39],
        [1171926000000, 58.07],
        [1172012400000, 60.07],
        [1172098800000, 61.14],
        [1172444400000, 61.39],
        [1172530800000, 61.46],
        [1172617200000, 61.79],
        [1172703600000, 62.00],
        [1172790000000, 60.07],
        [1173135600000, 60.69],
        [1173222000000, 61.82],
        [1173308400000, 60.05],
        [1173654000000, 58.91],
        [1173740400000, 57.93],
        [1173826800000, 58.16],
        [1173913200000, 57.55],
        [1173999600000, 57.11],
        [1174258800000, 56.59],
        [1174345200000, 59.61],
        [1174518000000, 61.69],
        [1174604400000, 62.28],
        [1174860000000, 62.91],
        [1174946400000, 62.93],
        [1175032800000, 64.03],
        [1175119200000, 66.03],
        [1175205600000, 65.87],
        [1175464800000, 64.64],
        [1175637600000, 64.38],
        [1175724000000, 64.28],
        [1175810400000, 64.28],
        [1176069600000, 61.51],
        [1176156000000, 61.89],
        [1176242400000, 62.01],
        [1176328800000, 63.85],
        [1176415200000, 63.63],
        [1176674400000, 63.61],
        [1176760800000, 63.10],
        [1176847200000, 63.13],
        [1176933600000, 61.83],
        [1177020000000, 63.38],
        [1177279200000, 64.58],
        [1177452000000, 65.84],
        [1177538400000, 65.06],
        [1177624800000, 66.46],
        [1177884000000, 64.40],
        [1178056800000, 63.68],
        [1178143200000, 63.19],
        [1178229600000, 61.93],
        [1178488800000, 61.47],
        [1178575200000, 61.55],
        [1178748000000, 61.81],
        [1178834400000, 62.37],
        [1179093600000, 62.46],
        [1179180000000, 63.17],
        [1179266400000, 62.55],
        [1179352800000, 64.94],
        [1179698400000, 66.27],
        [1179784800000, 65.50],
        [1179871200000, 65.77],
        [1179957600000, 64.18],
        [1180044000000, 65.20],
        [1180389600000, 63.15],
        [1180476000000, 63.49],
        [1180562400000, 65.08],
        [1180908000000, 66.30],
        [1180994400000, 65.96],
        [1181167200000, 66.93],
        [1181253600000, 65.98],
        [1181599200000, 65.35],
        [1181685600000, 66.26],
        [1181858400000, 68.00],
        [1182117600000, 69.09],
        [1182204000000, 69.10],
        [1182290400000, 68.19],
        [1182376800000, 68.19],
        [1182463200000, 69.14],
        [1182722400000, 68.19],
        [1182808800000, 67.77],
        [1182895200000, 68.97],
        [1182981600000, 69.57],
        [1183068000000, 70.68],
        [1183327200000, 71.09],
        [1183413600000, 70.92],
        [1183586400000, 71.81],
        [1183672800000, 72.81],
        [1183932000000, 72.19],
        [1184018400000, 72.56],
        [1184191200000, 72.50],
        [1184277600000, 74.15],
        [1184623200000, 75.05],
        [1184796000000, 75.92],
        [1184882400000, 75.57],
        [1185141600000, 74.89],
        [1185228000000, 73.56],
        [1185314400000, 75.57],
        [1185400800000, 74.95],
        [1185487200000, 76.83],
        [1185832800000, 78.21],
        [1185919200000, 76.53],
        [1186005600000, 76.86],
        [1186092000000, 76.00],
        [1186437600000, 71.59],
        [1186696800000, 71.47],
        [1186956000000, 71.62],
        [1187042400000, 71.00],
        [1187301600000, 71.98],
        [1187560800000, 71.12],
        [1187647200000, 69.47],
        [1187733600000, 69.26],
        [1187820000000, 69.83],
        [1187906400000, 71.09],
        [1188165600000, 71.73],
        [1188338400000, 73.36],
        [1188511200000, 74.04],
        [1188856800000, 76.30],
        [1189116000000, 77.49],
        [1189461600000, 78.23],
        [1189548000000, 79.91],
        [1189634400000, 80.09],
        [1189720800000, 79.10],
        [1189980000000, 80.57],
        [1190066400000, 81.93],
        [1190239200000, 83.32],
        [1190325600000, 81.62],
        [1190584800000, 80.95],
        [1190671200000, 79.53],
        [1190757600000, 80.30],
        [1190844000000, 82.88],
        [1190930400000, 81.66],
        [1191189600000, 80.24],
        [1191276000000, 80.05],
        [1191362400000, 79.94],
        [1191448800000, 81.44],
        [1191535200000, 81.22],
        [1191794400000, 79.02],
        [1191880800000, 80.26],
        [1191967200000, 80.30],
        [1192053600000, 83.08],
        [1192140000000, 83.69],
        [1192399200000, 86.13],
        [1192485600000, 87.61],
        [1192572000000, 87.40],
        [1192658400000, 89.47],
        [1192744800000, 88.60],
        [1193004000000, 87.56],
        [1193090400000, 87.56],
        [1193176800000, 87.10],
        [1193263200000, 91.86],
        [1193612400000, 93.53],
        [1193698800000, 94.53],
        [1193871600000, 95.93],
        [1194217200000, 93.98],
        [1194303600000, 96.37],
        [1194476400000, 95.46],
        [1194562800000, 96.32],
        [1195081200000, 93.43],
        [1195167600000, 95.10],
        [1195426800000, 94.64],
        [1195513200000, 95.10],
        [1196031600000, 97.70],
        [1196118000000, 94.42],
        [1196204400000, 90.62],
        [1196290800000, 91.01],
        [1196377200000, 88.71],
        [1196636400000, 88.32],
        [1196809200000, 90.23],
        [1196982000000, 88.28],
        [1197241200000, 87.86],
        [1197327600000, 90.02],
        [1197414000000, 92.25],
        [1197586800000, 90.63],
        [1197846000000, 90.63],
        [1197932400000, 90.49],
        [1198018800000, 91.24],
        [1198105200000, 91.06],
        [1198191600000, 90.49],
        [1198710000000, 96.62],
        [1198796400000, 96.00],
        [1199142000000, 99.62],
        [1199314800000, 99.18],
        [1199401200000, 95.09],
        [1199660400000, 96.33],
        [1199833200000, 95.67],
        [1200351600000, 91.90],
        [1200438000000, 90.84],
        [1200524400000, 90.13],
        [1200610800000, 90.57],
        [1200956400000, 89.21],
        [1201042800000, 86.99],
        [1201129200000, 89.85],
        [1201474800000, 90.99],
        [1201561200000, 91.64],
        [1201647600000, 92.33],
        [1201734000000, 91.75],
        [1202079600000, 90.02],
        [1202166000000, 88.41],
        [1202252400000, 87.14],
        [1202338800000, 88.11],
        [1202425200000, 91.77],
        [1202770800000, 92.78],
        [1202857200000, 93.27],
        [1202943600000, 95.46],
        [1203030000000, 95.46],
        [1203289200000, 101.74],
        [1203462000000, 98.81],
        [1203894000000, 100.88],
        [1204066800000, 99.64],
        [1204153200000, 102.59],
        [1204239600000, 101.84],
        [1204498800000, 99.52],
        [1204585200000, 99.52],
        [1204671600000, 104.52],
        [1204758000000, 105.47],
        [1204844400000, 105.15],
        [1205103600000, 108.75],
        [1205276400000, 109.92],
        [1205362800000, 110.33],
        [1205449200000, 110.21],
        [1205708400000, 105.68],
        [1205967600000, 101.84],
        [1206313200000, 100.86],
        [1206399600000, 101.22],
        [1206486000000, 105.90],
        [1206572400000, 107.58],
        [1206658800000, 105.62],
        [1206914400000, 101.58],
        [1207000800000, 100.98],
        [1207173600000, 103.83],
        [1207260000000, 106.23],
        [1207605600000, 108.50],
        [1207778400000, 110.11],
        [1207864800000, 110.14],
        [1208210400000, 113.79],
        [1208296800000, 114.93],
        [1208383200000, 114.86],
        [1208728800000, 117.48],
        [1208815200000, 118.30],
        [1208988000000, 116.06],
        [1209074400000, 118.52],
        [1209333600000, 118.75],
        [1209420000000, 113.46],
        [1209592800000, 112.52],
        [1210024800000, 121.84],
        [1210111200000, 123.53],
        [1210197600000, 123.69],
        [1210543200000, 124.23],
        [1210629600000, 125.80],
        [1210716000000, 126.29],
        [1211148000000, 127.05],
        [1211320800000, 129.07],
        [1211493600000, 132.19],
        [1211839200000, 128.85],
        [1212357600000, 127.76],
        [1212703200000, 138.54],
        [1212962400000, 136.80],
        [1213135200000, 136.38],
        [1213308000000, 134.86],
        [1213653600000, 134.01],
        [1213740000000, 136.68],
        [1213912800000, 135.65],
        [1214172000000, 134.62],
        [1214258400000, 134.62],
        [1214344800000, 134.62],
        [1214431200000, 139.64],
        [1214517600000, 140.21],
        [1214776800000, 140.00],
        [1214863200000, 140.97],
        [1214949600000, 143.57],
        [1215036000000, 145.29],
        [1215381600000, 141.37],
        [1215468000000, 136.04],
        [1215727200000, 146.40],
        [1215986400000, 145.18],
        [1216072800000, 138.74],
        [1216159200000, 134.60],
        [1216245600000, 129.29],
        [1216332000000, 130.65],
        [1216677600000, 127.95],
        [1216850400000, 127.95],
        [1217282400000, 122.19],
        [1217455200000, 124.08],
        [1217541600000, 125.10],
        [1217800800000, 121.41],
        [1217887200000, 119.17],
        [1217973600000, 118.58],
        [1218060000000, 120.02],
        [1218405600000, 114.45],
        [1218492000000, 113.01],
        [1218578400000, 116.00],
        [1218751200000, 113.77],
        [1219010400000, 112.87],
        [1219096800000, 114.53],
        [1219269600000, 114.98],
        [1219356000000, 114.98],
        [1219701600000, 116.27],
        [1219788000000, 118.15],
        [1219874400000, 115.59],
        [1219960800000, 115.46],
        [1220306400000, 109.71],
        [1220392800000, 109.35],
        [1220565600000, 106.23],
        [1220824800000, 106.34]
    ];
    var exchangerates = [
        [1167606000000, 0.7580],
        [1167692400000, 0.7580],
        [1167778800000, 0.75470],
        [1167865200000, 0.75490],
        [1167951600000, 0.76130],
        [1168038000000, 0.76550],
        [1168124400000, 0.76930],
        [1168210800000, 0.76940],
        [1168297200000, 0.76880],
        [1168383600000, 0.76780],
        [1168470000000, 0.77080],
        [1168556400000, 0.77270],
        [1168642800000, 0.77490],
        [1168729200000, 0.77410],
        [1168815600000, 0.77410],
        [1168902000000, 0.77320],
        [1168988400000, 0.77270],
        [1169074800000, 0.77370],
        [1169161200000, 0.77240],
        [1169247600000, 0.77120],
        [1169334000000, 0.7720],
        [1169420400000, 0.77210],
        [1169506800000, 0.77170],
        [1169593200000, 0.77040],
        [1169679600000, 0.7690],
        [1169766000000, 0.77110],
        [1169852400000, 0.7740],
        [1169938800000, 0.77450],
        [1170025200000, 0.77450],
        [1170111600000, 0.7740],
        [1170198000000, 0.77160],
        [1170284400000, 0.77130],
        [1170370800000, 0.76780],
        [1170457200000, 0.76880],
        [1170543600000, 0.77180],
        [1170630000000, 0.77180],
        [1170716400000, 0.77280],
        [1170802800000, 0.77290],
        [1170889200000, 0.76980],
        [1170975600000, 0.76850],
        [1171062000000, 0.76810],
        [1171148400000, 0.7690],
        [1171234800000, 0.7690],
        [1171321200000, 0.76980],
        [1171407600000, 0.76990],
        [1171494000000, 0.76510],
        [1171580400000, 0.76130],
        [1171666800000, 0.76160],
        [1171753200000, 0.76140],
        [1171839600000, 0.76140],
        [1171926000000, 0.76070],
        [1172012400000, 0.76020],
        [1172098800000, 0.76110],
        [1172185200000, 0.76220],
        [1172271600000, 0.76150],
        [1172358000000, 0.75980],
        [1172444400000, 0.75980],
        [1172530800000, 0.75920],
        [1172617200000, 0.75730],
        [1172703600000, 0.75660],
        [1172790000000, 0.75670],
        [1172876400000, 0.75910],
        [1172962800000, 0.75820],
        [1173049200000, 0.75850],
        [1173135600000, 0.76130],
        [1173222000000, 0.76310],
        [1173308400000, 0.76150],
        [1173394800000, 0.760],
        [1173481200000, 0.76130],
        [1173567600000, 0.76270],
        [1173654000000, 0.76270],
        [1173740400000, 0.76080],
        [1173826800000, 0.75830],
        [1173913200000, 0.75750],
        [1173999600000, 0.75620],
        [1174086000000, 0.7520],
        [1174172400000, 0.75120],
        [1174258800000, 0.75120],
        [1174345200000, 0.75170],
        [1174431600000, 0.7520],
        [1174518000000, 0.75110],
        [1174604400000, 0.7480],
        [1174690800000, 0.75090],
        [1174777200000, 0.75310],
        [1174860000000, 0.75310],
        [1174946400000, 0.75270],
        [1175032800000, 0.74980],
        [1175119200000, 0.74930],
        [1175205600000, 0.75040],
        [1175292000000, 0.750],
        [1175378400000, 0.74910],
        [1175464800000, 0.74910],
        [1175551200000, 0.74850],
        [1175637600000, 0.74840],
        [1175724000000, 0.74920],
        [1175810400000, 0.74710],
        [1175896800000, 0.74590],
        [1175983200000, 0.74770],
        [1176069600000, 0.74770],
        [1176156000000, 0.74830],
        [1176242400000, 0.74580],
        [1176328800000, 0.74480],
        [1176415200000, 0.7430],
        [1176501600000, 0.73990],
        [1176588000000, 0.73950],
        [1176674400000, 0.73950],
        [1176760800000, 0.73780],
        [1176847200000, 0.73820],
        [1176933600000, 0.73620],
        [1177020000000, 0.73550],
        [1177106400000, 0.73480],
        [1177192800000, 0.73610],
        [1177279200000, 0.73610],
        [1177365600000, 0.73650],
        [1177452000000, 0.73620],
        [1177538400000, 0.73310],
        [1177624800000, 0.73390],
        [1177711200000, 0.73440],
        [1177797600000, 0.73270],
        [1177884000000, 0.73270],
        [1177970400000, 0.73360],
        [1178056800000, 0.73330],
        [1178143200000, 0.73590],
        [1178229600000, 0.73590],
        [1178316000000, 0.73720],
        [1178402400000, 0.7360],
        [1178488800000, 0.7360],
        [1178575200000, 0.7350],
        [1178661600000, 0.73650],
        [1178748000000, 0.73840],
        [1178834400000, 0.73950],
        [1178920800000, 0.74130],
        [1179007200000, 0.73970],
        [1179093600000, 0.73960],
        [1179180000000, 0.73850],
        [1179266400000, 0.73780],
        [1179352800000, 0.73660],
        [1179439200000, 0.740],
        [1179525600000, 0.74110],
        [1179612000000, 0.74060],
        [1179698400000, 0.74050],
        [1179784800000, 0.74140],
        [1179871200000, 0.74310],
        [1179957600000, 0.74310],
        [1180044000000, 0.74380],
        [1180130400000, 0.74430],
        [1180216800000, 0.74430],
        [1180303200000, 0.74430],
        [1180389600000, 0.74340],
        [1180476000000, 0.74290],
        [1180562400000, 0.74420],
        [1180648800000, 0.7440],
        [1180735200000, 0.74390],
        [1180821600000, 0.74370],
        [1180908000000, 0.74370],
        [1180994400000, 0.74290],
        [1181080800000, 0.74030],
        [1181167200000, 0.73990],
        [1181253600000, 0.74180],
        [1181340000000, 0.74680],
        [1181426400000, 0.7480],
        [1181512800000, 0.7480],
        [1181599200000, 0.7490],
        [1181685600000, 0.74940],
        [1181772000000, 0.75220],
        [1181858400000, 0.75150],
        [1181944800000, 0.75020],
        [1182031200000, 0.74720],
        [1182117600000, 0.74720],
        [1182204000000, 0.74620],
        [1182290400000, 0.74550],
        [1182376800000, 0.74490],
        [1182463200000, 0.74670],
        [1182549600000, 0.74580],
        [1182636000000, 0.74270],
        [1182722400000, 0.74270],
        [1182808800000, 0.7430],
        [1182895200000, 0.74290],
        [1182981600000, 0.7440],
        [1183068000000, 0.7430],
        [1183154400000, 0.74220],
        [1183240800000, 0.73880],
        [1183327200000, 0.73880],
        [1183413600000, 0.73690],
        [1183500000000, 0.73450],
        [1183586400000, 0.73450],
        [1183672800000, 0.73450],
        [1183759200000, 0.73520],
        [1183845600000, 0.73410],
        [1183932000000, 0.73410],
        [1184018400000, 0.7340],
        [1184104800000, 0.73240],
        [1184191200000, 0.72720],
        [1184277600000, 0.72640],
        [1184364000000, 0.72550],
        [1184450400000, 0.72580],
        [1184536800000, 0.72580],
        [1184623200000, 0.72560],
        [1184709600000, 0.72570],
        [1184796000000, 0.72470],
        [1184882400000, 0.72430],
        [1184968800000, 0.72440],
        [1185055200000, 0.72350],
        [1185141600000, 0.72350],
        [1185228000000, 0.72350],
        [1185314400000, 0.72350],
        [1185400800000, 0.72620],
        [1185487200000, 0.72880],
        [1185573600000, 0.73010],
        [1185660000000, 0.73370],
        [1185746400000, 0.73370],
        [1185832800000, 0.73240],
        [1185919200000, 0.72970],
        [1186005600000, 0.73170],
        [1186092000000, 0.73150],
        [1186178400000, 0.72880],
        [1186264800000, 0.72630],
        [1186351200000, 0.72630],
        [1186437600000, 0.72420],
        [1186524000000, 0.72530],
        [1186610400000, 0.72640],
        [1186696800000, 0.7270],
        [1186783200000, 0.73120],
        [1186869600000, 0.73050],
        [1186956000000, 0.73050],
        [1187042400000, 0.73180],
        [1187128800000, 0.73580],
        [1187215200000, 0.74090],
        [1187301600000, 0.74540],
        [1187388000000, 0.74370],
        [1187474400000, 0.74240],
        [1187560800000, 0.74240],
        [1187647200000, 0.74150],
        [1187733600000, 0.74190],
        [1187820000000, 0.74140],
        [1187906400000, 0.73770],
        [1187992800000, 0.73550],
        [1188079200000, 0.73150],
        [1188165600000, 0.73150],
        [1188252000000, 0.7320],
        [1188338400000, 0.73320],
        [1188424800000, 0.73460],
        [1188511200000, 0.73280],
        [1188597600000, 0.73230],
        [1188684000000, 0.7340],
        [1188770400000, 0.7340],
        [1188856800000, 0.73360],
        [1188943200000, 0.73510],
        [1189029600000, 0.73460],
        [1189116000000, 0.73210],
        [1189202400000, 0.72940],
        [1189288800000, 0.72660],
        [1189375200000, 0.72660],
        [1189461600000, 0.72540],
        [1189548000000, 0.72420],
        [1189634400000, 0.72130],
        [1189720800000, 0.71970],
        [1189807200000, 0.72090],
        [1189893600000, 0.7210],
        [1189980000000, 0.7210],
        [1190066400000, 0.7210],
        [1190152800000, 0.72090],
        [1190239200000, 0.71590],
        [1190325600000, 0.71330],
        [1190412000000, 0.71050],
        [1190498400000, 0.70990],
        [1190584800000, 0.70990],
        [1190671200000, 0.70930],
        [1190757600000, 0.70930],
        [1190844000000, 0.70760],
        [1190930400000, 0.7070],
        [1191016800000, 0.70490],
        [1191103200000, 0.70120],
        [1191189600000, 0.70110],
        [1191276000000, 0.70190],
        [1191362400000, 0.70460],
        [1191448800000, 0.70630],
        [1191535200000, 0.70890],
        [1191621600000, 0.70770],
        [1191708000000, 0.70770],
        [1191794400000, 0.70770],
        [1191880800000, 0.70910],
        [1191967200000, 0.71180],
        [1192053600000, 0.70790],
        [1192140000000, 0.70530],
        [1192226400000, 0.7050],
        [1192312800000, 0.70550],
        [1192399200000, 0.70550],
        [1192485600000, 0.70450],
        [1192572000000, 0.70510],
        [1192658400000, 0.70510],
        [1192744800000, 0.70170],
        [1192831200000, 0.70],
        [1192917600000, 0.69950],
        [1193004000000, 0.69940],
        [1193090400000, 0.70140],
        [1193176800000, 0.70360],
        [1193263200000, 0.70210],
        [1193349600000, 0.70020],
        [1193436000000, 0.69670],
        [1193522400000, 0.6950],
        [1193612400000, 0.6950],
        [1193698800000, 0.69390],
        [1193785200000, 0.6940],
        [1193871600000, 0.69220],
        [1193958000000, 0.69190],
        [1194044400000, 0.69140],
        [1194130800000, 0.68940],
        [1194217200000, 0.68910],
        [1194303600000, 0.69040],
        [1194390000000, 0.6890],
        [1194476400000, 0.68340],
        [1194562800000, 0.68230],
        [1194649200000, 0.68070],
        [1194735600000, 0.68150],
        [1194822000000, 0.68150],
        [1194908400000, 0.68470],
        [1194994800000, 0.68590],
        [1195081200000, 0.68220],
        [1195167600000, 0.68270],
        [1195254000000, 0.68370],
        [1195340400000, 0.68230],
        [1195426800000, 0.68220],
        [1195513200000, 0.68220],
        [1195599600000, 0.67920],
        [1195686000000, 0.67460],
        [1195772400000, 0.67350],
        [1195858800000, 0.67310],
        [1195945200000, 0.67420],
        [1196031600000, 0.67440],
        [1196118000000, 0.67390],
        [1196204400000, 0.67310],
        [1196290800000, 0.67610],
        [1196377200000, 0.67610],
        [1196463600000, 0.67850],
        [1196550000000, 0.68180],
        [1196636400000, 0.68360],
        [1196722800000, 0.68230],
        [1196809200000, 0.68050],
        [1196895600000, 0.67930],
        [1196982000000, 0.68490],
        [1197068400000, 0.68330],
        [1197154800000, 0.68250],
        [1197241200000, 0.68250],
        [1197327600000, 0.68160],
        [1197414000000, 0.67990],
        [1197500400000, 0.68130],
        [1197586800000, 0.68090],
        [1197673200000, 0.68680],
        [1197759600000, 0.69330],
        [1197846000000, 0.69330],
        [1197932400000, 0.69450],
        [1198018800000, 0.69440],
        [1198105200000, 0.69460],
        [1198191600000, 0.69640],
        [1198278000000, 0.69650],
        [1198364400000, 0.69560],
        [1198450800000, 0.69560],
        [1198537200000, 0.6950],
        [1198623600000, 0.69480],
        [1198710000000, 0.69280],
        [1198796400000, 0.68870],
        [1198882800000, 0.68240],
        [1198969200000, 0.67940],
        [1199055600000, 0.67940],
        [1199142000000, 0.68030],
        [1199228400000, 0.68550],
        [1199314800000, 0.68240],
        [1199401200000, 0.67910],
        [1199487600000, 0.67830],
        [1199574000000, 0.67850],
        [1199660400000, 0.67850],
        [1199746800000, 0.67970],
        [1199833200000, 0.680],
        [1199919600000, 0.68030],
        [1200006000000, 0.68050],
        [1200092400000, 0.6760],
        [1200178800000, 0.6770],
        [1200265200000, 0.6770],
        [1200351600000, 0.67360],
        [1200438000000, 0.67260],
        [1200524400000, 0.67640],
        [1200610800000, 0.68210],
        [1200697200000, 0.68310],
        [1200783600000, 0.68420],
        [1200870000000, 0.68420],
        [1200956400000, 0.68870],
        [1201042800000, 0.69030],
        [1201129200000, 0.68480],
        [1201215600000, 0.68240],
        [1201302000000, 0.67880],
        [1201388400000, 0.68140],
        [1201474800000, 0.68140],
        [1201561200000, 0.67970],
        [1201647600000, 0.67690],
        [1201734000000, 0.67650],
        [1201820400000, 0.67330],
        [1201906800000, 0.67290],
        [1201993200000, 0.67580],
        [1202079600000, 0.67580],
        [1202166000000, 0.6750],
        [1202252400000, 0.6780],
        [1202338800000, 0.68330],
        [1202425200000, 0.68560],
        [1202511600000, 0.69030],
        [1202598000000, 0.68960],
        [1202684400000, 0.68960],
        [1202770800000, 0.68820],
        [1202857200000, 0.68790],
        [1202943600000, 0.68620],
        [1203030000000, 0.68520],
        [1203116400000, 0.68230],
        [1203202800000, 0.68130],
        [1203289200000, 0.68130],
        [1203375600000, 0.68220],
        [1203462000000, 0.68020],
        [1203548400000, 0.68020],
        [1203634800000, 0.67840],
        [1203721200000, 0.67480],
        [1203807600000, 0.67470],
        [1203894000000, 0.67470],
        [1203980400000, 0.67480],
        [1204066800000, 0.67330],
        [1204153200000, 0.6650],
        [1204239600000, 0.66110],
        [1204326000000, 0.65830],
        [1204412400000, 0.6590],
        [1204498800000, 0.6590],
        [1204585200000, 0.65810],
        [1204671600000, 0.65780],
        [1204758000000, 0.65740],
        [1204844400000, 0.65320],
        [1204930800000, 0.65020],
        [1205017200000, 0.65140],
        [1205103600000, 0.65140],
        [1205190000000, 0.65070],
        [1205276400000, 0.6510],
        [1205362800000, 0.64890],
        [1205449200000, 0.64240],
        [1205535600000, 0.64060],
        [1205622000000, 0.63820],
        [1205708400000, 0.63820],
        [1205794800000, 0.63410],
        [1205881200000, 0.63440],
        [1205967600000, 0.63780],
        [1206054000000, 0.64390],
        [1206140400000, 0.64780],
        [1206226800000, 0.64810],
        [1206313200000, 0.64810],
        [1206399600000, 0.64940],
        [1206486000000, 0.64380],
        [1206572400000, 0.63770],
        [1206658800000, 0.63290],
        [1206745200000, 0.63360],
        [1206831600000, 0.63330],
        [1206914400000, 0.63330],
        [1207000800000, 0.6330],
        [1207087200000, 0.63710],
        [1207173600000, 0.64030],
        [1207260000000, 0.63960],
        [1207346400000, 0.63640],
        [1207432800000, 0.63560],
        [1207519200000, 0.63560],
        [1207605600000, 0.63680],
        [1207692000000, 0.63570],
        [1207778400000, 0.63540],
        [1207864800000, 0.6320],
        [1207951200000, 0.63320],
        [1208037600000, 0.63280],
        [1208124000000, 0.63310],
        [1208210400000, 0.63420],
        [1208296800000, 0.63210],
        [1208383200000, 0.63020],
        [1208469600000, 0.62780],
        [1208556000000, 0.63080],
        [1208642400000, 0.63240],
        [1208728800000, 0.63240],
        [1208815200000, 0.63070],
        [1208901600000, 0.62770],
        [1208988000000, 0.62690],
        [1209074400000, 0.63350],
        [1209160800000, 0.63920],
        [1209247200000, 0.640],
        [1209333600000, 0.64010],
        [1209420000000, 0.63960],
        [1209506400000, 0.64070],
        [1209592800000, 0.64230],
        [1209679200000, 0.64290],
        [1209765600000, 0.64720],
        [1209852000000, 0.64850],
        [1209938400000, 0.64860],
        [1210024800000, 0.64670],
        [1210111200000, 0.64440],
        [1210197600000, 0.64670],
        [1210284000000, 0.65090],
        [1210370400000, 0.64780],
        [1210456800000, 0.64610],
        [1210543200000, 0.64610],
        [1210629600000, 0.64680],
        [1210716000000, 0.64490],
        [1210802400000, 0.6470],
        [1210888800000, 0.64610],
        [1210975200000, 0.64520],
        [1211061600000, 0.64220],
        [1211148000000, 0.64220],
        [1211234400000, 0.64250],
        [1211320800000, 0.64140],
        [1211407200000, 0.63660],
        [1211493600000, 0.63460],
        [1211580000000, 0.6350],
        [1211666400000, 0.63460],
        [1211752800000, 0.63460],
        [1211839200000, 0.63430],
        [1211925600000, 0.63460],
        [1212012000000, 0.63790],
        [1212098400000, 0.64160],
        [1212184800000, 0.64420],
        [1212271200000, 0.64310],
        [1212357600000, 0.64310],
        [1212444000000, 0.64350],
        [1212530400000, 0.6440],
        [1212616800000, 0.64730],
        [1212703200000, 0.64690],
        [1212789600000, 0.63860],
        [1212876000000, 0.63560],
        [1212962400000, 0.6340],
        [1213048800000, 0.63460],
        [1213135200000, 0.6430],
        [1213221600000, 0.64520],
        [1213308000000, 0.64670],
        [1213394400000, 0.65060],
        [1213480800000, 0.65040],
        [1213567200000, 0.65030],
        [1213653600000, 0.64810],
        [1213740000000, 0.64510],
        [1213826400000, 0.6450],
        [1213912800000, 0.64410],
        [1213999200000, 0.64140],
        [1214085600000, 0.64090],
        [1214172000000, 0.64090],
        [1214258400000, 0.64280],
        [1214344800000, 0.64310],
        [1214431200000, 0.64180],
        [1214517600000, 0.63710],
        [1214604000000, 0.63490],
        [1214690400000, 0.63330],
        [1214776800000, 0.63340],
        [1214863200000, 0.63380],
        [1214949600000, 0.63420],
        [1215036000000, 0.6320],
        [1215122400000, 0.63180],
        [1215208800000, 0.6370],
        [1215295200000, 0.63680],
        [1215381600000, 0.63680],
        [1215468000000, 0.63830],
        [1215554400000, 0.63710],
        [1215640800000, 0.63710],
        [1215727200000, 0.63550],
        [1215813600000, 0.6320],
        [1215900000000, 0.62770],
        [1215986400000, 0.62760],
        [1216072800000, 0.62910],
        [1216159200000, 0.62740],
        [1216245600000, 0.62930],
        [1216332000000, 0.63110],
        [1216418400000, 0.6310],
        [1216504800000, 0.63120],
        [1216591200000, 0.63120],
        [1216677600000, 0.63040],
        [1216764000000, 0.62940],
        [1216850400000, 0.63480],
        [1216936800000, 0.63780],
        [1217023200000, 0.63680],
        [1217109600000, 0.63680],
        [1217196000000, 0.63680],
        [1217282400000, 0.6360],
        [1217368800000, 0.6370],
        [1217455200000, 0.64180],
        [1217541600000, 0.64110],
        [1217628000000, 0.64350],
        [1217714400000, 0.64270],
        [1217800800000, 0.64270],
        [1217887200000, 0.64190],
        [1217973600000, 0.64460],
        [1218060000000, 0.64680],
        [1218146400000, 0.64870],
        [1218232800000, 0.65940],
        [1218319200000, 0.66660],
        [1218405600000, 0.66660],
        [1218492000000, 0.66780],
        [1218578400000, 0.67120],
        [1218664800000, 0.67050],
        [1218751200000, 0.67180],
        [1218837600000, 0.67840],
        [1218924000000, 0.68110],
        [1219010400000, 0.68110],
        [1219096800000, 0.67940],
        [1219183200000, 0.68040],
        [1219269600000, 0.67810],
        [1219356000000, 0.67560],
        [1219442400000, 0.67350],
        [1219528800000, 0.67630],
        [1219615200000, 0.67620],
        [1219701600000, 0.67770],
        [1219788000000, 0.68150],
        [1219874400000, 0.68020],
        [1219960800000, 0.6780],
        [1220047200000, 0.67960],
        [1220133600000, 0.68170],
        [1220220000000, 0.68170],
        [1220306400000, 0.68320],
        [1220392800000, 0.68770],
        [1220479200000, 0.69120],
        [1220565600000, 0.69140],
        [1220652000000, 0.70090],
        [1220738400000, 0.70120],
        [1220824800000, 0.7010],
        [1220911200000, 0.70050]
    ];

    function euroFormatter(v, axis) {
        return v.toFixed(axis.tickDecimals) + "€";
    }
    var position = 'right';

    /**
     * multiData - data for multi line chart
     */
    var multiData = [{
        data: oilprices,
        label: "Oil price ($)"
    }, {
        data: exchangerates,
        label: "USD/EUR exchange rate",
        yaxis: 2
    }];

    /**
     * multiOptions - options for multi chart
     */
    var multiOptions = {
        xaxes: [{
            mode: 'time'
        }],
        yaxes: [{
            min: 0
        }, {
            // align if we are to the right
            alignTicksWithAxis: position == "right" ? 1 : null,
            position: position,
            tickFormatter: euroFormatter
        }],
        legend: {
            position: 'sw'
        },
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0,

        },
        tooltip: true,
        tooltipOpts: {
            content: "%s for %x was %y",
            xDateFormat: "%y-%0m-%0d",
            onHover: function(flotItem, $tooltipEl) {}
        }

    }

    /**
     * Definition of variables
     * Flot chart
     */
    this.flotChartData = chartData;
    this.flotBarOptions = barOptions;
    this.flotLineOptions = lineOptions;
    this.flotPieData = pieData;
    this.flotPieOptions = pieOptions;
    this.flotLineAreaData = lineAreaData;
    this.flotLineAreaOptions = lineAreaOptions;
    this.flotMultiData = multiData;
    this.flotMultiOptions = multiOptions;
}

/**
 * rickshawChartCtrl - Controller for data for all Rickshaw chart
 * used in Rickshaw chart view
 */
function rickshawChartCtrl() {

    /**
     * Data for simple chart
     */
    var simpleChartSeries = [{
        color: '#1ab394',
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 30 },
            { x: 4, y: 32 }
        ]
    }];
    /**
     * Options for simple chart
     */
    var simpleChartOptions = {
        renderer: 'area'
    };

    /**
     * Data for Multi Area chart
     */
    var multiAreaChartSeries = [{
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 20 },
            { x: 4, y: 16 }
        ],
        color: '#1ab394',
        stroke: '#17997f'
    }, {
        data: [
            { x: 0, y: 22 },
            { x: 1, y: 25 },
            { x: 2, y: 38 },
            { x: 3, y: 44 },
            { x: 4, y: 46 }
        ],
        color: '#eeeeee',
        stroke: '#d7d7d7'
    }];

    /**
     * Options for Multi chart
     */
    var multiAreaChartOptions = {
        renderer: 'area',
        stroke: true
    };

    /**
     * Options for one line chart
     */
    var oneLineChartOptions = {
        renderer: 'line'
    };

    /**
     * Data for one line chart
     */
    var oneLineChartSeries = [{
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 30 },
            { x: 4, y: 32 }
        ],
        color: '#1ab394'
    }];

    /**
     * Options for Multi line chart
     */
    var multiLineChartOptions = {
        renderer: 'line'
    };

    /**
     * Data for Multi line chart
     */
    var multiLineChartSeries = [{
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 30 },
            { x: 4, y: 32 }
        ],
        color: '#1ab394'
    }, {
        data: [
            { x: 0, y: 20 },
            { x: 1, y: 24 },
            { x: 2, y: 19 },
            { x: 3, y: 15 },
            { x: 4, y: 16 }
        ],
        color: '#d7d7d7'
    }];

    /**
     * Options for Bars chart
     */
    var barsChartOptions = {
        renderer: 'bar'
    };

    /**
     * Data for Bars chart
     */
    var barsChartSeries = [{
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 30 },
            { x: 4, y: 32 }
        ],
        color: '#1ab394'
    }];

    /**
     * Options for Stacked chart
     */
    var stackedChartOptions = {
        renderer: 'bar'
    };

    /**
     * Data for Stacked chart
     */
    var stackedChartSeries = [{
        data: [
            { x: 0, y: 40 },
            { x: 1, y: 49 },
            { x: 2, y: 38 },
            { x: 3, y: 30 },
            { x: 4, y: 32 }
        ],
        color: '#1ab394'
    }, {
        data: [
            { x: 0, y: 20 },
            { x: 1, y: 24 },
            { x: 2, y: 19 },
            { x: 3, y: 15 },
            { x: 4, y: 16 }
        ],
        color: '#d7d7d7'
    }];

    /**
     * Options for Scatterplot chart
     */
    var scatterplotChartOptions = {
        renderer: 'scatterplot',
        stroke: true,
        padding: { top: 0.05, left: 0.05, right: 0.05 }
    }

    /**
     * Data for Scatterplot chart
     */
    var scatterplotChartSeries = [{
        data: [
            { x: 0, y: 15 },
            { x: 1, y: 18 },
            { x: 2, y: 10 },
            { x: 3, y: 12 },
            { x: 4, y: 15 },
            { x: 5, y: 24 },
            { x: 6, y: 28 },
            { x: 7, y: 31 },
            { x: 8, y: 22 },
            { x: 9, y: 18 },
            { x: 10, y: 16 }
        ],
        color: '#1ab394'
    }]

    /**
     * Definition all variables
     * Rickshaw chart
     */
    this.simpleSeries = simpleChartSeries;
    this.simpleOptions = simpleChartOptions;
    this.multiAreaOptions = multiAreaChartOptions;
    this.multiAreaSeries = multiAreaChartSeries;
    this.oneLineOptions = oneLineChartOptions;
    this.oneLineSeries = oneLineChartSeries;
    this.multiLineOptions = multiLineChartOptions;
    this.multiLineSeries = multiLineChartSeries;
    this.barsOptions = barsChartOptions;
    this.barsSeries = barsChartSeries;
    this.stackedOptions = stackedChartOptions;
    this.stackedSeries = stackedChartSeries;
    this.scatterplotOptions = scatterplotChartOptions;
    this.scatterplotSeries = scatterplotChartSeries;

}

/**
 * sparklineChartCtrl - Controller for data for all Sparkline chart
 * used in Sparkline chart view
 */
function sparklineChartCtrl() {

    /**
     * Inline chart
     */
    var inlineData = [34, 43, 43, 35, 44, 32, 44, 52, 25];
    var inlineOptions = {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#1ab394'
    };

    /**
     * Bar chart
     */
    var barSmallData = [5, 6, 7, 2, 0, -4, -2, 4];
    var barSmallOptions = {
        type: 'bar',
        barColor: '#1ab394',
        negBarColor: '#c6c6c6'
    };

    /**
     * Pie chart
     */
    var smallPieData = [1, 1, 2];
    var smallPieOptions = {
        type: 'pie',
        sliceColors: ['#1ab394', '#b3b3b3', '#e4f0fb']
    };

    /**
     * Long line chart
     */
    var longLineData = [34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44];
    var longLineOptions = {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#ffffff'
    };

    /**
     * Tristate chart
     */
    var tristateData = [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1];
    var tristateOptions = {
        type: 'tristate',
        posBarColor: '#1ab394',
        negBarColor: '#bfbfbf'
    };

    /**
     * Discrate chart
     */
    var discreteData = [4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4, 5, 8, 7, 6, 9, 3, 2, 4, 1, 5, 6, 4, 3, 7, ];
    var discreteOptions = {
        type: 'discrete',
        lineColor: '#1ab394'
    };

    /**
     * Pie chart
     */
    var pieCustomData = [52, 12, 44];
    var pieCustomOptions = {
        type: 'pie',
        height: '150px',
        sliceColors: ['#1ab394', '#b3b3b3', '#e4f0fb']
    };

    /**
     * Bar chart
     */
    var barCustomData = [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14, 4, 2, 14, 12, 7];
    var barCustomOptions = {
        type: 'bar',
        barWidth: 8,
        height: '150px',
        barColor: '#1ab394',
        negBarColor: '#c6c6c6'
    };

    /**
     * Line chart
     */
    var lineCustomData = [34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44];
    var lineCustomOptions = {
        type: 'line',
        lineWidth: 1,
        height: '150px',
        lineColor: '#17997f',
        fillColor: '#ffffff'
    };


    /**
     * Definition of variables
     * Flot chart
     */
    this.inlineData = inlineData;
    this.inlineOptions = inlineOptions;
    this.barSmallData = barSmallData;
    this.barSmallOptions = barSmallOptions;
    this.pieSmallData = smallPieData;
    this.pieSmallOptions = smallPieOptions;
    this.discreteData = discreteData;
    this.discreteOptions = discreteOptions;
    this.longLineData = longLineData;
    this.longLineOptions = longLineOptions;
    this.tristateData = tristateData;
    this.tristateOptions = tristateOptions;
    this.pieCustomData = pieCustomData;
    this.pieCustomOptions = pieCustomOptions;
    this.barCustomData = barCustomData;
    this.barCustomOptions = barCustomOptions;
    this.lineCustomData = lineCustomData;
    this.lineCustomOptions = lineCustomOptions;
}

function ChatCtrl($window, $scope, $firebaseAuth, $location, $firebaseObject, $timeout) {




}



/**
 * widgetFlotChart - Data for Flot chart
 * used in Widget view
 */
function widgetFlotChart() {


    /**
     * Flot chart data and options
     */
    var d1 = [
        [1262304000000, 6],
        [1264982400000, 3057],
        [1267401600000, 20434],
        [1270080000000, 31982],
        [1272672000000, 26602],
        [1275350400000, 27826],
        [1277942400000, 24302],
        [1280620800000, 24237],
        [1283299200000, 21004],
        [1285891200000, 12144],
        [1288569600000, 10577],
        [1291161600000, 10295]
    ];
    var d2 = [
        [1262304000000, 5],
        [1264982400000, 200],
        [1267401600000, 1605],
        [1270080000000, 6129],
        [1272672000000, 11643],
        [1275350400000, 19055],
        [1277942400000, 30062],
        [1280620800000, 39197],
        [1283299200000, 37000],
        [1285891200000, 27000],
        [1288569600000, 21000],
        [1291161600000, 17000]
    ];

    var flotChartData1 = [
        { label: "Data 1", data: d1, color: '#17a084' },
        { label: "Data 2", data: d2, color: '#127e68' }
    ];

    var flotChartOptions1 = {
        xaxis: {
            tickDecimals: 0
        },
        series: {
            lines: {
                show: true,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 1
                    }, {
                        opacity: 1
                    }]
                }
            },
            points: {
                width: 0.1,
                show: false
            }
        },
        grid: {
            show: false,
            borderWidth: 0
        },
        legend: {
            show: false
        }
    };

    var flotChartData2 = [
        { label: "Data 1", data: d1, color: '#19a0a1' }
    ];

    var flotChartOptions2 = {
        xaxis: {
            tickDecimals: 0
        },
        series: {
            lines: {
                show: true,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 1
                    }, {
                        opacity: 1
                    }]
                }
            },
            points: {
                width: 0.1,
                show: false
            }
        },
        grid: {
            show: false,
            borderWidth: 0
        },
        legend: {
            show: false
        }
    };

    var flotChartData3 = [
        { label: "Data 1", data: d1, color: '#fbbe7b' },
        { label: "Data 2", data: d2, color: '#f8ac59' }
    ];

    var flotChartOptions3 = {
        xaxis: {
            tickDecimals: 0
        },
        series: {
            lines: {
                show: true,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 1
                    }, {
                        opacity: 1
                    }]
                }
            },
            points: {
                width: 0.1,
                show: false
            }
        },
        grid: {
            show: false,
            borderWidth: 0
        },
        legend: {
            show: false
        }
    };

    /**
     * Definition of variables
     * Flot chart
     */

    this.flotChartData1 = flotChartData1;
    this.flotChartOptions1 = flotChartOptions1;
    this.flotChartData2 = flotChartData2;
    this.flotChartOptions2 = flotChartOptions2;
    this.flotChartData3 = flotChartData3;
    this.flotChartOptions3 = flotChartOptions3;


}

/**
 * modalDemoCtrl - Controller used to run modal view
 * used in Basic form view
 */
function modalDemoCtrl($scope, $modal) {

    $scope.open = function() {

        var modalInstance = $modal.open({
            templateUrl: 'views/modal_example.html',
            controller: ModalInstanceCtrl
        });
    };

    $scope.open1 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_example1.html',
            controller: ModalInstanceCtrl
        });
    };

    $scope.open2 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "animated fadeIn"
        });
    };

    $scope.open3 = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_example3.html',
            size: size,
            controller: ModalInstanceCtrl
        });
    };

    $scope.open4 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "animated flipInY"
        });
    };
};

function ModalInstanceCtrl($scope, $modalInstance) {

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    $scope.states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];

};

/**
 * ionSlider - Controller for data for Ion Slider plugin
 * used in Advanced plugin view
 */
function ionSlider() {
    this.ionSliderOptions1 = {
        min: 0,
        max: 5000,
        type: 'double',
        prefix: "$",
        maxPostfix: "+",
        prettify: false,
        hasGrid: true
    };
    this.ionSliderOptions2 = {
        min: 0,
        max: 10,
        type: 'single',
        step: 0.1,
        postfix: " carats",
        prettify: false,
        hasGrid: true
    };
    this.ionSliderOptions3 = {
        min: -50,
        max: 50,
        from: 0,
        postfix: "°",
        prettify: false,
        hasGrid: true
    };
    this.ionSliderOptions4 = {
        values: [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ],
        type: 'single',
        hasGrid: true
    };
    this.ionSliderOptions5 = {
        min: 10000,
        max: 100000,
        step: 100,
        postfix: " km",
        from: 55000,
        hideMinMax: true,
        hideFromTo: false
    };
}

/**
 * wizardCtrl - Controller for wizard functions
 * used in Wizard view
 */
function wizardCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};

    // After process wizard
    $scope.processForm = function() {
        alert('Wizard completed');
    };

}


/**
 * CalendarCtrl - Controller for Calendar
 * Store data events for calendar
 */
function CalendarCtrl($scope) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    // Events
    $scope.events = [
        { title: 'All Day Event', start: new Date(y, m, 1) },
        { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
        { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
        { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
        { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
        { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ];


    /* message on eventClick */
    $scope.alertOnEventClick = function(event, allDay, jsEvent, view) {
        $scope.alertMessage = (event.title + ': Clicked ');
    };
    /* message on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = (event.title + ': Droped to make dayDelta ' + dayDelta);
    };
    /* message on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = (event.title + ': Resized to make dayDelta ' + minuteDelta);
    };

    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };

    /* Event sources array */
    $scope.eventSources = [$scope.events];
}

/**
 * chartJsCtrl - Controller for data for ChartJs plugin
 * used in Chart.js view
 */
function chartJsCtrl() {

    /**
     * Data for Polar chart
     */
    this.polarData = [{
        value: 300,
        color: "#a3e1d4",
        highlight: "#1ab394",
        label: "App"
    }, {
        value: 140,
        color: "#dedede",
        highlight: "#1ab394",
        label: "Software"
    }, {
        value: 200,
        color: "#b5b8cf",
        highlight: "#1ab394",
        label: "Laptop"
    }];

    /**
     * Options for Polar chart
     */
    this.polarOptions = {
        scaleShowLabelBackdrop: true,
        scaleBackdropColor: "rgba(255,255,255,0.75)",
        scaleBeginAtZero: true,
        scaleBackdropPaddingY: 1,
        scaleBackdropPaddingX: 1,
        scaleShowLine: true,
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false
    };

    /**
     * Data for Doughnut chart
     */
    this.doughnutData = [{
        value: 300,
        color: "#a3e1d4",
        highlight: "#1ab394",
        label: "App"
    }, {
        value: 50,
        color: "#dedede",
        highlight: "#1ab394",
        label: "Software"
    }, {
        value: 100,
        color: "#b5b8cf",
        highlight: "#1ab394",
        label: "Laptop"
    }];

    /**
     * Options for Doughnut chart
     */
    this.doughnutOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false
    };

    /**
     * Data for Line chart
     */
    this.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Example dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        }, {
            label: "Example dataset",
            fillColor: "rgba(26,179,148,0.5)",
            strokeColor: "rgba(26,179,148,0.7)",
            pointColor: "rgba(26,179,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26,179,148,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }]
    };

    this.lineDataDashboard4 = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Example dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 40, 51, 36, 25, 40]
        }, {
            label: "Example dataset",
            fillColor: "rgba(26,179,148,0.5)",
            strokeColor: "rgba(26,179,148,0.7)",
            pointColor: "rgba(26,179,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26,179,148,1)",
            data: [48, 48, 60, 39, 56, 37, 30]
        }]
    };

    /**
     * Options for Line chart
     */
    this.lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };

    /**
     * Options for Bar chart
     */
    this.barOptions = {
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 1
    };

    /**
     * Data for Bar chart
     */
    this.barData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        }, {
            label: "My Second dataset",
            fillColor: "rgba(26,179,148,0.5)",
            strokeColor: "rgba(26,179,148,0.8)",
            highlightFill: "rgba(26,179,148,0.75)",
            highlightStroke: "rgba(26,179,148,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }]
    };

    /**
     * Data for Radar chart
     */
    this.radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        }, {
            label: "My Second dataset",
            fillColor: "rgba(26,179,148,0.2)",
            strokeColor: "rgba(26,179,148,1)",
            pointColor: "rgba(26,179,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
        }]
    };

    /**
     * Options for Radar chart
     */
    this.radarOptions = {
        scaleShowLine: true,
        angleShowLineOut: true,
        scaleShowLabels: false,
        scaleBeginAtZero: true,
        angleLineColor: "rgba(0,0,0,.1)",
        angleLineWidth: 1,
        pointLabelFontFamily: "'Arial'",
        pointLabelFontStyle: "normal",
        pointLabelFontSize: 10,
        pointLabelFontColor: "#666",
        pointDot: true,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };


};

/**
 * GoogleMaps - Controller for data google maps
 */
function GoogleMaps($scope) {
    $scope.mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(40.6700, -73.9400),
        // Style for Google Maps
        styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.mapOptions2 = {
        zoom: 11,
        center: new google.maps.LatLng(40.6700, -73.9400),
        // Style for Google Maps
        styles: [{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" }] }],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.mapOptions3 = {
        center: new google.maps.LatLng(36.964645, -122.01523),
        zoom: 18,
        // Style for Google Maps
        MapTypeId: google.maps.MapTypeId.SATELLITE,
        styles: [{ "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#fffffa" }] }, { "featureType": "water", "stylers": [{ "lightness": 50 }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "lightness": 40 }] }],
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    $scope.mapOptions4 = {
        zoom: 11,
        center: new google.maps.LatLng(40.6700, -73.9400),
        // Style for Google Maps
        styles: [{ "stylers": [{ "hue": "#18a689" }, { "visibility": "on" }, { "invert_lightness": true }, { "saturation": 40 }, { "lightness": 10 }] }],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}

/**
 * nestableCtrl - Controller for nestable list
 */
function nestableCtrl($scope) {
    $scope.remove = function(scope) {
        scope.remove();
    };
    $scope.toggle = function(scope) {
        scope.toggle();
    };
    $scope.moveLastToTheBeginning = function() {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };
    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };
    $scope.collapseAll = function() {
        $scope.$broadcast('collapseAll');
    };
    $scope.expandAll = function() {
        $scope.$broadcast('expandAll');
    };
    $scope.data = [{
        "id": 1,
        "title": "node1",
        "nodes": [{
            "id": 11,
            "title": "node1.1",
            "nodes": [{
                "id": 111,
                "title": "node1.1.1",
                "nodes": []
            }]
        }, {
            "id": 12,
            "title": "node1.2",
            "nodes": []
        }]
    }, {
        "id": 2,
        "title": "node2",
        "nodes": [{
            "id": 21,
            "title": "node2.1",
            "nodes": []
        }, {
            "id": 22,
            "title": "node2.2",
            "nodes": []
        }]
    }, {
        "id": 3,
        "title": "node3",
        "nodes": [{
            "id": 31,
            "title": "node3.1",
            "nodes": []
        }]
    }];
}

/**
 * codeEditorCtrl - Controller for code editor - Code Mirror
 */
function codeEditorCtrl($scope) {
    $scope.editorOptions = {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        theme: "ambiance"
    };

    $scope.editorOptions2 = {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true
    };

}

/**
 * ngGridCtrl - Controller for code ngGrid
 */
function ngGridCtrl($scope) {
    $scope.ngData = [
        { Name: "Moroni", Age: 50, Position: 'PR Menager', Status: 'active', Date: '12.12.2014' },
        { Name: "Teancum", Age: 43, Position: 'CEO/CFO', Status: 'deactive', Date: '10.10.2014' },
        { Name: "Jacob", Age: 27, Position: 'UI Designer', Status: 'active', Date: '09.11.2013' },
        { Name: "Nephi", Age: 29, Position: 'Java programmer', Status: 'deactive', Date: '22.10.2014' },
        { Name: "Joseph", Age: 22, Position: 'Marketing manager', Status: 'active', Date: '24.08.2013' },
        { Name: "Monica", Age: 43, Position: 'President', Status: 'active', Date: '11.12.2014' },
        { Name: "Arnold", Age: 12, Position: 'CEO', Status: 'active', Date: '07.10.2013' },
        { Name: "Mark", Age: 54, Position: 'Analyst', Status: 'deactive', Date: '03.03.2014' },
        { Name: "Amelia", Age: 33, Position: 'Sales manager', Status: 'deactive', Date: '26.09.2013' },
        { Name: "Jesica", Age: 41, Position: 'Ruby programmer', Status: 'active', Date: '22.12.2013' },
        { Name: "John", Age: 48, Position: 'Marketing manager', Status: 'deactive', Date: '09.10.2014' },
        { Name: "Berg", Age: 19, Position: 'UI/UX Designer', Status: 'active', Date: '12.11.2013' }
    ];

    $scope.ngOptions = { data: 'ngData' };
    $scope.ngOptions2 = {
        data: 'ngData',
        showGroupPanel: true,
        jqueryUIDraggable: true
    };
}






/**
 * imageCrop - Controller for image crop functionality
 */
function imageCrop($scope) {

    $scope.dupa = "dasdasdas";

    $scope.myImage = 'data:image/jpeg;base64,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AAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADNwAAAAYAAAAAAAAAAAAAApsAAAPoAAAAAQA1AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAPoAAACmwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAACmwAAAABSZ2h0bG9uZwAAA+gAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAApsAAAAAUmdodGxvbmcAAAPoAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAA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KQ/aw2ZOOQJdZU1loP8AxO7Ze1n/AFr+Qostdh5NGRS7c1nupsaSQSw/QG6Hsc2ffS731qQ3T37cwhdref6Q3jjl30f+E/8ARfqJwYz+KbqubZldSyrTY57DdZ6TXknY0u0YFQe6edVPJ/n7449V/wD1XmgO57oxrSls7s2//9k4QklNBCEAAAAAAFUAAAABAQAAAA8AQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAAAATAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwACAAQwBTADUAAAABADhCSU0EBgAAAAAABwAGAQEAAQEA/+EM3Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iMzgwNENBMjhEOUNGQzNEQkYwNUIwMTk1MEQ4QkVFRUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTVCQUJDMTYxNkE3RTQxMTgwQzI4NTIzMzdBQjhEMjMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iMzgwNENBMjhEOUNGQzNEQkYwNUIwMTk1MEQ4QkVFRUQiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNS0wMS0yOFQxODo0Njo0MiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTUtMDEtMjhUMTg6NTA6NDkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTUtMDEtMjhUMTg6NTA6NDkrMDE6MDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNUJBQkMxNjE2QTdFNDExODBDMjg1MjMzN0FCOEQyMyIgc3RFdnQ6d2hlbj0iMjAxNS0wMS0yOFQxODo1MDo0OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+IMWElDQ19QUk9GSUxFAAEBAAAMSExpbm8CEAAAbW50clJHQiBYWVogB84AAgAJAAYAMQAAYWNzcE1T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';
    $scope.myCroppedImage = '';

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
}


/**
 * diff - Controller for diff function
 */
function diff($scope) {
    $scope.oldText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only centuries, but also the leap into electronic typesetting.';
    $scope.newText = 'Lorem Ipsum is simply typesetting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s standard dummy text ever the 1500s, when an printer took a galley of type and simply it to make a type. It has survived not only five centuries, but survived not also the leap into electronic typesetting.';

    $scope.oldText1 = 'Lorem Ipsum is simply printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text eve';
    $scope.newText1 = 'Ting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s';
}

/**
 * idleTimer - Controller for Idle Timer
 */
function idleTimer($scope, Idle, notify) {

    // Custm alter
    $scope.customAlert = false;

    // Start watching idle
    Idle.watch();

    // Config notify behavior
    notify.config({
        duration: '5000'
    });

    // function you want to fire when the user goes idle
    $scope.$on('IdleStart', function() {
        notify({
            message: 'Idle time - You can call any function after idle timeout.',
            classes: 'alert-warning',
            templateUrl: 'views/common/notify.html'
        });
        $scope.customAlert = true;

    });

    // function you want to fire when the user becomes active again
    $scope.$on('IdleEnd', function() {
        notify({
            message: 'You are back, Great that you decided to move a mouse.',
            classes: 'alert-success',
            templateUrl: 'views/common/notify.html'
        });
        $scope.customAlert = false;
    });

}


/**
 * liveFavicon - Controller for live favicon
 */
function liveFavicon($scope) {

    $scope.example1 = function() {
        Tinycon.setBubble(1);
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example2 = function() {
        Tinycon.setBubble(1000);
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example3 = function() {
        Tinycon.setBubble('In');
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example4 = function() {
        Tinycon.setOptions({
            background: '#e0913b'
        });
        Tinycon.setBubble(8);
    }

}

/**
 * formValidation - Controller for validation example
 */
function formValidation($scope) {

    $scope.signupForm = function() {
        if ($scope.signup_form.$valid) {
            // Submit as normal

        } else {
            $scope.signup_form.submitted = true;
        }
    }

    $scope.signupForm2 = function() {
        if ($scope.signup_form.$valid) {
            // Submit as normal
        }
    }

};

/**
 * agileBoard - Controller for agile Board view
 */
function agileBoard($scope, $firebaseAuth, $timeout) {


    $scope.todoList = [];
    $scope.inProgressList = [];
    $scope.completedList = [];

    $scope.sortableOptions = {
        connectWith: ".connectList"
    };
    /* baord inProgress */
    $scope.$watchCollection('todoList', function() {
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Board")
                .orderByChild("email")
                .equalTo(user.email)
                .limitToLast(1)
            ref.once("value", function(snapshot) {
                key = Object.keys(snapshot.val())
                todoList = JSON.stringify($scope.todoList);
                todoList = todoList.slice(1, -1);
                firebase.database().ref().child('Board/' + key)
                    .update({ todoList: todoList, });
            });
        });
    });
    $scope.$watchCollection('inProgressList', function() {
        console.log($scope.inProgressList);
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Board")
                .orderByChild("email")
                .equalTo(user.email)
                .limitToLast(1)
            ref.once("value", function(snapshot) {
                console.log(snapshot.val());
                inProgressList = JSON.stringify($scope.inProgressList);
                inProgressList = inProgressList.slice(1, -1);
                key = Object.keys(snapshot.val())
                firebase.database().ref().child('Board/' + key)
                    .update({ inProgressList: inProgressList });
            });
        });
    });

    $scope.$watchCollection('completedList', function() {
        console.log($scope.completedList);
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Board")
                .orderByChild("email")
                .equalTo(user.email)
                .limitToLast(1)
            ref.once("value", function(snapshot) {
                console.log(snapshot.val());
                completedList = JSON.stringify($scope.completedList);
                completedList = completedList.slice(1, -1);
                key = Object.keys(snapshot.val())
                firebase.database().ref().child('Board/' + key)
                    .update({ completedList: completedList });

            });
        });
    });


    /* board add task */

    var auth = $firebaseAuth();
    firebase.auth().onAuthStateChanged((user) => {
        let ref = firebase.database().ref("Board")
            .orderByChild("email")
            .equalTo(user.email)
            .limitToLast(1)
        ref.once("value", function(snapshot) {
            $timeout(function() {
                console.log("Boards", snapshot.val());
                if (snapshot.val() == null) {
                    post = firebase.database().ref('Board/').push({
                        user: user.uid,
                        email: user.email,
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    });
                }

                keys = Object.keys(snapshot.val());

                todoKey = snapshot.val()[keys].todoList;
                console.log('todoList', todoKey);
                splitTodo = todoKey.split(/[{}]+/).filter(function(e) { return e; });
                console.log("todo", splitTodo);
                for (var i = splitTodo.length - 1; i >= 0; i--) {
                    if (splitTodo[i] == ",") {
                        splitTodo[i] = null;
                    }
                }
                filteredTodo = splitTodo.filter(n => n)
                arr = [];

                err = [];
                for (var i = filteredTodo.length - 1; i >= 0; i--) {
                    str = "{" + filteredTodo[i] + "}";
                    err.push(JSON.parse(str));
                }

                console.log("err", err);
                for (var i = err.length - 1; i >= 0; i--) {
                    $scope.todoList.push(err[i]);
                }

                console.log("todo", $scope.todoList);

                if (snapshot.val()[keys].inProgressList !== null) {
                    todoProgress = snapshot.val()[keys].inProgressList;
                    splitProgress = todoProgress.split(/[{}]+/).filter(function(e) { return e; });
                    console.log("todo", splitTodo);
                    for (var i = splitProgress.length - 1; i >= 0; i--) {
                        if (splitProgress[i] == ",") {
                            splitProgress[i] = null;
                        }
                    }
                    filteredProgress = splitProgress.filter(n => n)
                    arr = [];

                    err = [];
                    for (var i = filteredProgress.length - 1; i >= 0; i--) {
                        str = "{" + filteredProgress[i] + "}";
                        err.push(JSON.parse(str));
                    }

                    console.log("err", err);
                    for (var i = err.length - 1; i >= 0; i--) {
                        $scope.inProgressList.push(err[i]);
                    }
                }

                if (snapshot.val()[keys].completedList !== null) {
                    todocompletedList = snapshot.val()[keys].completedList;
                    splitcompletedList = todocompletedList.split(/[{}]+/).filter(function(e) { return e; });
                    console.log("todo", splitTodo);
                    for (var i = splitcompletedList.length - 1; i >= 0; i--) {
                        if (splitcompletedList[i] == ",") {
                            splitcompletedList[i] = null;
                        }
                    }
                    filteredcompletedList = splitcompletedList.filter(n => n)
                    arr = [];

                    err = [];
                    for (var i = filteredcompletedList.length - 1; i >= 0; i--) {
                        str = "{" + filteredcompletedList[i] + "}";
                        err.push(JSON.parse(str));
                    }

                    console.log("err", err);
                    for (var i = err.length - 1; i >= 0; i--) {
                        $scope.completedList.push(err[i]);
                    }
                }
            });



        });


    });





    $scope.addTask = function() {
        timeInMs = Date.now();
        UpdatedTime = new Date(timeInMs);
        humanTime = UpdatedTime.toString();
        var todo = {
            content: $scope.taskText,
            date: humanTime,
            tagName: 'remove'
        };

        $scope.todoList.push(todo);


        console.log($scope.todoList[0]);

        todoList = JSON.stringify($scope.todoList);
        todoList = todoList.slice(1, -1);
        var auth = $firebaseAuth();
        firebase.auth().onAuthStateChanged((user) => {
            let ref = firebase.database().ref("Board")
            ref.once("value", function(snapshot) {
                if (snapshot.val() == null) {

                    var post = firebase.database().ref('Board/').push({
                        user: user.uid,
                        email: user.email,
                        todoList: todoList,
                        createdAt: firebase.database.ServerValue.TIMESTAMP

                    });
                } else {
                    let ref = firebase.database().ref("Board")
                        .orderByChild("email")
                        .equalTo(user.email)
                        .limitToLast(1)
                    ref.once("value", function(snapshot) {
                        key = Object.keys(snapshot.val())
                        firebase.database().ref().child('Board/' + key)
                            .update({ todoList: todoList, createdAt: firebase.database.ServerValue.TIMESTAMP });
                    });


                }

            });

        });

        console.log("array", JSON.stringify($scope.todoList));
    }



}






/**
 * draggablePanels - Controller for draggable panels example
 */
function draggablePanels($scope) {

    $scope.sortableOptions = {
        connectWith: ".connectPanels",
        handler: ".ibox-title"
    };

}




/**
 *
 * Pass all functions into module
 */


angular
    .module('cabao')
    .controller('LoginCtrl', LoginCtrl)
    .controller('MainCtrl', MainCtrl)
    .controller('dashboardFlotOne', dashboardFlotOne)
    .controller('dashboardFlotTwo', dashboardFlotTwo)
    .controller('dashboardMap', dashboardMap)
    .controller('flotChartCtrl', flotChartCtrl)
    .controller('rickshawChartCtrl', rickshawChartCtrl)
    .controller('sparklineChartCtrl', sparklineChartCtrl)
    .controller('widgetFlotChart', widgetFlotChart)
    .controller('modalDemoCtrl', modalDemoCtrl)
    .controller('ionSlider', ionSlider)
    .controller('wizardCtrl', wizardCtrl)
    .controller('CalendarCtrl', CalendarCtrl)
    .controller('chartJsCtrl', chartJsCtrl)
    .controller('GoogleMaps', GoogleMaps)
    .controller('ngGridCtrl', ngGridCtrl)
    .controller('codeEditorCtrl', codeEditorCtrl)
    .controller('nestableCtrl', nestableCtrl)
    .controller('translateCtrl', translateCtrl)
    .controller('imageCrop', imageCrop)
    .controller('diff', diff)
    .controller('idleTimer', idleTimer)
    .controller('liveFavicon', liveFavicon)
    .controller('formValidation', formValidation)
    .controller('agileBoard', agileBoard)
    .controller('draggablePanels', draggablePanels)
    .controller('ChatCtrl', ChatCtrl)

