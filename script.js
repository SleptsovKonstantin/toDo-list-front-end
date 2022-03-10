let allTask = [];

let valueInput = "";
let input = null;
let flag = null;
let intermedateResult = "";

window.onload = init = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:3000/allTasks", {
    method: "GET",
  });
  let result = await resp.json();
  allTask = result.data;
  render();
};

const onClickButton = async () => {
  if (valueInput !== "") {
    allTask.push({
      text: valueInput,
      isCheck: false,
    });
    const resp = await fetch("http://localhost:3000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });
    let result = await resp.json();
    allTask = result.data;
    input.value = "";
    valueInput = "";
    render();
  }
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTask.sort((a, b) => {
    return a.isCheck - b.isCheck;
  });

  allTask.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "newTask";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.className = "check";
    checkbox.onchange = () => onChangeCheckbox(index);
    container.appendChild(checkbox);

    if (index === flag) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "textChange";
      editInput.value = item.text;
      editInput.addEventListener("change", updateTaskText);
      container.appendChild(editInput);
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "task-done" : "task";
      container.appendChild(text);
    }

    if (!item.isCheck) {
      if (index === flag) {
        const imageOk = document.createElement("img");
        imageOk.src = "img/ok.png";
        imageOk.type = "button";
        imageOk.className = "buttonClick";
        const imageCancel = document.createElement("img");
        imageCancel.src = "img/otmena.jpg";
        imageCancel.type = "button";
        imageCancel.className = "buttonClick";
        imageOk.onclick = () => {
          saveResult(index);
          doneEditTask();
        };
        imageCancel.onclick = () => doneEditTask();
        container.appendChild(imageOk);
        container.appendChild(imageCancel);
      } else {
        const imageEdit = document.createElement("img");
        imageEdit.src = "img/111.png";
        imageEdit.type = "button";
        imageEdit.className = "buttonClick";
        imageEdit.onclick = () => {
          flag = index;
          render();
        };
        container.appendChild(imageEdit);
        const imageDel = document.createElement("img");
        imageDel.src = "img/222.png";
        imageDel.type = "button";
        imageDel.className = "buttonClick";
        imageDel.onclick = () => deleteTask(index);
        container.appendChild(imageDel);
      }
    }

    content.appendChild(container);
  });
};

const onChangeCheckbox = async (index) => {
  let { isCheck } = allTask[index];
  let id = allTask[index]._id;
  isCheck = !isCheck;
  const resp = await fetch(`http://localhost:3000/updateTask`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id,
      isCheck,
    }),
  });
  let result = await resp.json();
  allTask = result.data;
  render();
};

const deleteTask = async (index) => {
  let id = allTask[index]._id;
  const resp = await fetch(`http://localhost:3000/deleteTask?_id=${id}`, {
    method: "DELETE",
  });
  let result = await resp.json();
  allTask = result.data;
  render();
};

const updateTaskText = (event) => {
  intermedateResult = event.target.value;
};

const saveResult = async (index) => {
  if (intermedateResult !== "") {
    allTask[index].text = intermedateResult;
    let id = allTask[index]._id;
    const resp = await fetch(`http://localhost:3000/updateTask`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id,
        text: intermedateResult,
      }),
    });
    let result = await resp.json();
    allTask = result.data;
    intermedateResult = "";
  }
};

const doneEditTask = () => {
  flag = null;
  render();
};

const deleteArr = async () => {
  const resp = await fetch(`http://localhost:3000/clearTask`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let result = await resp.json();
  allTask = result.data;
  render();
};
