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
        .post("http://35.240.242.164/signin", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("name", data.name);
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
          } else {
            swal({
              title: "Warning!",
              text: data.err.message,
              icon: "warning"
            });
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
        .post("http://35.240.242.164/signup", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("name", data.name);
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
            this.isRegister = false;
          } else {
            swal({
              title: "Warning!",
              text: data.err.message,
              icon: "warning"
            });
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
                "http://35.240.242.164/fb-login",
                {},
                { headers: { accessToken } }
              )
              .then(({ data }) => {
                self.isLoggedIn = true;
                localStorage.setItem("name", data.name);
                this.user = data.name;
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
        .get("http://35.240.242.164/user/", config)
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
        .post("http://35.240.242.164/user", payload, config)
        .then(({ data }) => {
          if (data.action) {
            swal({
              title: "Warning!",
              text: data.action.message,
              icon: "warning"
            });
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
        .put(`http://35.240.242.164/user/todo/${itemId}`, payload, config)
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
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this todo item!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          let token = localStorage.getItem("token");
          let config = { headers: { token } };
          axios
            .delete(`http://35.240.242.164/user/todo/${itemId}`, config)
            .then(({ data }) => {
              console.log(data);
              this.getTodos();
            })
            .catch(err => {
              console.log(err);
            });
          swal("Your to do item has been deleted!", {
            icon: "success"
          });
        } else {
          swal("Your to do item is not deleted!");
        }
      });
    },
    updateStatus: function(itemId, statusUpdate) {
      let update = { completed: statusUpdate };
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .put(`http://35.240.242.164/user/todo/${itemId}`, update, config)
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
          .get(`http://35.240.242.164/user?tag=${query}`, config)
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
      this.search = "";
    }
  },
  created: function() {
    if (localStorage.getItem("token")) {
      this.user = localStorage.getItem("name");
      this.isLoggedIn = true;
      this.getTodos();
    }
  }
});
