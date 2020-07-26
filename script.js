let perPage = 5;
const data = Array.from({ length: 100 }).map((_, i) => `Item ${i + 1}`);

const html = {
  get(element) {
    return document.querySelector(element);
  },
};

const state = {
  page: 1,
  perPage,
  totalPages: Math.ceil(data.length / perPage),
};

const controls = {
  next() {
    console.log(state.page);
    state.page++;
    console.log(state.page);

    if (state.page > state.totalPages) {
      state.page--;
    }
  },
  prev() {
    state.page--;

    if (state.page < 1) {
      state.page++;
    }
  },
  goTo(page) {
    if (page < 1) {
      page = 1;
    }

    state.page = +page;
    if (page > state.totalPages) {
      state.page = state.totalPages;
    }
  },
  createListener() {
    html.get(".first").addEventListener("click", () => {
      controls.goTo(1);
      update();
    });

    html.get(".last").addEventListener("click", () => {
      controls.goTo(state.totalPages);
      update();
    });

    html.get(".next").addEventListener("click", () => {
      controls.next();
      update();
    });

    html.get(".prev").addEventListener("click", () => {
      controls.prev();
      update();
    });
  },
};

const list = {
  create(item) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = item;

    html.get(".list").appendChild(div);
  },
  update() {
    html.get(".list").innerHTML = "";

    let page = state.page - 1;
    let start = page * state.perPage;
    let end = start + state.perPage;

    const itemsPaginated = data.slice(start, end);

    itemsPaginated.forEach(list.create);
  },
};

const buttons = {
  create(number) {
    console.log(number);
    const button = document.createElement("div");
    button.innerHTML = number;

    if (state.page == number) {
      button.classList.add("active");
    }

    button.addEventListener("click", (event) => {
      const page = event.target.innerText;
      controls.goTo(page);
      update();
    });

    html.get(".pagination .numbers").appendChild(button);
  },
  update() {
    html.get(".pagination .numbers").innerHTML = "";
    const { maxLeft, maxRight } = buttons.calculateMaxVisibleButtons();

    for (let page = maxLeft; page <= maxRight; page++) {
      this.create(page);
    }
  },
  calculateMaxVisibleButtons() {
    let maxLeft = state.page - Math.floor(5 / 2);
    let maxRight = state.page + Math.floor(5 / 2);
    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = 5;
    }
    if (maxRight > state.totalPages) {
      maxLeft = state.totalPages - (5 - 1);
      maxRight = state.totalPages;

      if (maxLeft < 1) {
        maxLeft = 1;
      }
    }
    return {
      maxLeft,
      maxRight,
    };
  },
};

function update() {
  list.update();
  buttons.update();
}

function init() {
  update();
  controls.createListener();
}

init();
