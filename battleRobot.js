var app = new Vue({
	el: "#app",
	data: {
		robotLeague: [],
		page: "index1",
		tableTeams: [],
		arrayMatchs: [],
		infoTeams: [],
		tableWin: [],
		login: true,
		logout: false,
		main: false


	},
	methods: {
		fetchStart: function () {
			fetch("https://api.jsonbin.io/b/5bf35541746e9b593ebfd094", {}).then(function (data) {
				return data.json();
			}).then(function (myData) {
				console.log(myData);
				app.robotLeague = myData.robotLeague
				app.tableTeams = app.table();
				app.arrayMatchs = app.matchs();
				app.tableWin = app.calculateWin();

				console.log(app.infoTeams);
				console.log(app.tableTeams);
				console.log(app.tableWin);
				console.log(app.infoTeams);

			})
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

		table: function () { //.......METEMOS LOS TEAMS EN UNA ARRAY PARA GENERAR LA TABLA//
			var arrayTeams = [];

			for (var i = 0; i < this.robotLeague[0].teams.length; i++) {
				arrayTeams.push(this.robotLeague[0].teams[i]);
			}


			return arrayTeams;
		},

		//...........MATCHS NEW OBJECT.......//

		matchs: function () { //.......METEMOS LOS TEAMS EN UNA ARRAY PARA GENERAR LA TABLA//
			var arrayMatchs = [];
			for (var i = 0; i < this.robotLeague[0].matchs.length; i++) {
				arrayMatchs.push(this.robotLeague[0].matchs[i]);
			}
			return arrayMatchs;
		},

		//..........WIN RATE.............//

		calculateWin: function () { //.........CALCULA EL RATE/WIN (DE LA ARRAY DONDE ESTAN LOS TEAMS)  Y LO METE EN UNA ARRAY
			var winRate = [];

			for (var i = 0; i < this.tableTeams.length; i++) {
				//				winRate.push(this.tableTeams[i].win / this.tableTeams[i].numberEvents * 100);
				var round = this.tableTeams[i].win / this.tableTeams[i].numberEvents * 100;
				winRate.push(this.tableTeams[i].winRate = round.toFixed(1));

			}

			return winRate;
		},

		//..........CHAT...........//

		logins: function () {

			var provider = new firebase.auth.GoogleAuthProvider();
			// How to Log In
			firebase.auth().signInWithPopup(provider).then(function(){
				console.log("login");
				app.login = false;
				app.logout = true;
			});
			

		},
		logouts: function () {
			firebase.auth().signOut().then(function () {
				alert("Sign-out successful.")

			}, function (error) {
				// An error happened.

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
			console.log(message);
			// Get a key for a new Post.
			firebase.database().ref('myChat').push(message);
			//Write data
			console.log("write");
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
			console.log("getting posts");
		}

	},
	computed: {
		sorted_winrate() {
			return this.tableTeams.sort((a, b) => {
				return b.winRate - a.winRate;
			});
		}
	},

	created: function () {
		this.fetchStart(),
			this.getPosts(),
			this.writeNewPost(),
			this.login(),
			this.changeClass()

	}
});

