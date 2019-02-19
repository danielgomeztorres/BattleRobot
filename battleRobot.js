var app = new Vue({
	el: "#app",
	data: {
		robotLeague: [],
		page: "index1",
		tableTeams: [],
		arrayMatchs: [],
		infoTeams: [],
		tableWin: [],
		setImg: [],
		login: true,
		logout: false,
		main: false

	},
	methods: {
		fetchStart: function () {
			fetch("https://api.jsonbin.io/b/5c697e6cad5128320aff0e23", {}).then(function (data) {
				return data.json();
			}).then(function (myData) {
				console.log(myData);
				app.robotLeague = myData.robotLeague
				app.tableTeams = app.table();
				app.arrayMatchs = app.matchs();
				app.tableWin = app.calculateWin();
				console.log("foto1")
				app.startTime();
				

			})
		},
		startTime: function () {
			
			var objImage = {
				img1:"https://www.realityblurred.com/realitytv/images/2018/02/battlebots-discovery-science.jpg",
				img2: "http://jhdgroup.net/wp-content/uploads/2015/08/port-battlebots3.jpg"
			}
			var tDate = new Date();
			if (tDate.getSeconds() % 5 == 0) {
				var img = document.getElementById("img1");
				if(img.getAttribute("src") == objImage.img1){
					img.setAttribute("src", objImage.img2);
				}else{
					img.setAttribute("src", objImage.img1);
				}
			}
			setTimeout("app.startTime()", 1000);
			console.log("foto2")
		},


		showTeam: function (value) {
			this.infoTeams = [];
			this.infoTeams.push(value);
		},
		//...........SHOW ELEMENTS.........//

		showElement: function (id) {
			this.page = id;
			if (this.login == true) {
				this.main = false;
				this.id = true;
			} else {
				this.main = true;
			}
			document.getElementById("closeIcon").checked = false

		},

		//...........TEAMS NEW OBJECT.......//

		table: function () { //.......PUT  ALL TEAMS IN ARRAY//
			var arrayTeams = [];
			for (var i = 0; i < this.robotLeague[0].teams.length; i++) {
				arrayTeams.push(this.robotLeague[0].teams[i]);
			}

			return arrayTeams;
		},
		//...........MATCHS NEW OBJECT.......//

		matchs: function () { //.......PUT  ALL MATCHS IN ARRAY//
			var arrayMatchs = [];
			for (var i = 0; i < this.robotLeague[0].matchs.length; i++) {
				arrayMatchs.push(this.robotLeague[0].matchs[i]);
			}
			return arrayMatchs;
		},

		//..........WIN RATE.............//

		calculateWin: function () { //.........CALCULATED EL RATE/WIN 
			var winRate = [];
			for (var i = 0; i < this.tableTeams.length; i++) {
				var round = this.tableTeams[i].win / this.tableTeams[i].numberEvents * 100;
				winRate.push(this.tableTeams[i].winRate = round.toFixed(1));
			}
			return winRate;
		},

		//..........CHAT...........//

		logins: function () {
			var provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider).then(function () {
				console.log("login");
				app.login = false;
				app.logout = true;
			});

		},
		logouts: function () {
			firebase.auth().signOut().then(function () {
				alert("Sign-out successful.")

			}, function (error) {

			});
			this.logout = false;
			this.login = true;
		},
		writeNewPost: function () {
			var textInput = document.getElementById("textInput").value;
			var name = firebase.auth().currentUser.displayName;
			var photo = firebase.auth().currentUser.photoURL;
			var message = {
				imgPhoto: photo,
				textMessage: textInput,
				username: name,
			};
			textInput = document.getElementById("textInput").value = "";


			firebase.database().ref('myChat').push(message);


			this.getPosts();
		},
		getPosts: function () {
			firebase.database().ref('myChat').on('value', function (data) {
				var posts = document.getElementById("posts");
				posts.innerHTML = "";
				var messages = data.val();
				for (var key in messages) {
					var chatBox = document.createElement("div");
					chatBox.setAttribute("class", "chatFlexbox");
					var contend = messages[key];
					var ImgUrl = contend.imgPhoto;
					var userImg = document.createElement("img");
					userImg.setAttribute("src", ImgUrl);
					userImg.setAttribute("class", "userImg");
					var userMsg = `${contend.username}: ${contend.textMessage}`;
					chatBox.append(userImg, userMsg);
					posts.append(chatBox);
				}
			})

		}
	},
	computed: {
		sorted_winrate() {
			return this.tableTeams.sort((a, b) => {
				return b.winRate - a.winRate;
			});
		},
		
	},
	created: function () {
		this.fetchStart()
			// this.getPosts(),
			// this.writeNewPost(),
			// this.login(),
			// this.changeClass()
			

	}
});
// var timerid = 0;
// var images = new Array(

// 	"https://www.realityblurred.com/realitytv/images/2018/02/battlebots-discovery-science.jpg",
// 	"http://jhdgroup.net/wp-content/uploads/2015/08/port-battlebots3.jpg"
// )

// console.log(images)
// var countimages = 0;

// function startTime() {
// 	if (timerid) {
// 		timerid = 0;
// 	}
// 	var tDate = new Date();

// 	if (countimages == images.length) {
// 		countimages = 0;
// 	}
// 	if (tDate.getSeconds() % 5 == 0) {
// 		document.getElementById("img1").src = images[countimages];
// 	}
// 	countimages++;

// 	timerid = setTimeout("startTime()", 1000);
// }
// startTime();