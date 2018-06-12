new Vue({
  el: "#app",
  data: {
    isLoggedIn: false,
    isRegister: false,
    todos: [],
    email: "mc@mail.com",
    password: "michaelcang",
    name: "michael",
    newItem: "",
    tags: "",
    editItemId: "",
    updateItem: "",
    addTags: "",
    removeTags: ""
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
          console.log("USER DATA", data);
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("token", data.token);
            this.getTodos();
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
          console.log("USER DATA", data);
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("token", data.token);
            this.getTodos();
          }
        })
        .catch(err => {
          console.log(err);
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
          console.log(data);
          this.getTodos();
          this.cleanInput();
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
    }
  },
  created: function() {
    if (localStorage.getItem("token")) {
      this.getTodos();
    }
  }
});
