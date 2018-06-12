new Vue({
  el: "#app",
  data: {
    isLoggedIn: false,
    isRegister: false,
    todos: [],
    email: "",
    password: "",
    name: "",
    newItem: "",
    tags: "",
    editItemId: "",
    updateItem: "",
    addTags: "",
    removeTags: "",
    warning: "",
    hasWarning: false,
    search: "",
    user: ""
  },
  methods: {
    login: function() {
      let payload = {
        email: this.email,
        password: this.password
      };
      axios
        .post("http://localhost:3000/signin", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
          } else {
            this.warning = data;
            this.hasWarning = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    logout: function() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
    },
    register: function() {
      let payload = {
        email: this.email,
        password: this.password,
        name: this.name
      };
      axios
        .post("http://localhost:3000/signup", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
            this.isRegister = false;
          } else {
            this.warning = data;
            this.hasWarning = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginFB: function() {
      let self = this;
      FB.getLoginStatus(function(response) {
        FB.login(function(response) {
          console.log("statusChangeCallback");
          console.log(response);
          if (response.status === "connected") {
            // Logged into your app and Facebook.
            let accessToken = response.authResponse.accessToken;
            localStorage.setItem("fbAccess", accessToken);
            axios
              .post(
                "http://localhost:3000/fb-login",
                {},
                { headers: { accessToken } }
              )
              .then(({ data }) => {
                self.isLoggedIn = true;
                self.user = data.name;
                localStorage.setItem("token", data.token);
                self.getTodos();
              })
              .catch(err => {
                if (err) {
                  console.log(err);
                }
              });
          }
        });
      });
    },
    getTodos: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .get("http://localhost:3000/user/", config)
        .then(({ data }) => {
          console.log(data);
          this.todos = data.todos;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addTodo: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      let payload = {
        action: this.newItem,
        tags: this.tags.split(" ")
      };
      axios
        .post("http://localhost:3000/user", payload, config)
        .then(({ data }) => {
          if (data.action) {
            this.warning = data;
            this.hasWarning = true;
          } else {
            this.getTodos();
            this.cleanInput();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateTodo: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      let itemId = this.editItemId;
      let payload = {
        addTags: this.addTags.split(" "),
        removeTags: this.removeTags.split(" ")
      };
      if (this.newItem !== "") {
        payload.action = this.newItem;
      }
      axios
        .put(`http://localhost:3000/user/todo/${itemId}`, payload, config)
        .then(({ data }) => {
          console.log(data);
          this.getTodos();
          this.cleanInput();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteTodo: function(itemId) {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .delete(`http://localhost:3000/user/todo/${itemId}`, config)
        .then(({ data }) => {
          console.log(data);
          this.getTodos();
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateStatus: function(itemId, statusUpdate) {
      let update = { completed: statusUpdate };
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .put(`http://localhost:3000/user/todo/${itemId}`, update, config)
        .then(({ data }) => {
          console.log(data);
          this.getTodos();
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchTag: function() {
      if (this.search !== "") {
        let token = localStorage.getItem("token");
        let config = { headers: { token } };
        let query = this.search;
        axios
          .get(`http://localhost:3000/user?tag=${query}`, config)
          .then(({ data }) => {
            console.log(data);
            this.todos = data.todos;
            this.cleanInput();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getDate: function(input) {
      let d = new Date(input);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDay();
      return `${day}/${month}/${year}`;
    },
    getStatus: function(input, updatedAt) {
      if (input) {
        return "Completed on " + this.getDate(updatedAt);
      } else {
        return "Not Completed";
      }
    },
    cleanInput: function() {
      this.newItem = "";
      this.tags = "";
      this.updateItem = "";
      this.addTags = "";
      this.removeTags = "";
      this.email = "";
      this.password = "";
      this.name = "";
      this.warning = "";
      this.search = "";
    }
  },
  created: function() {
    if (localStorage.getItem("token")) {
      this.getTodos();
    }
  }
});
