let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = "";
let input = null;
let flag = null;
let intermedateResult = "";

window.onload = init = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await resp.json();
  allTask = result.data;
  console.log('result', result);
  render();
 };

const onClickButton = async () => {
  allTask.push({
    text: valueInput,
    isCheck: false
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false
    })
  });
  let result = await resp.json();
  allTask = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  valueInput = "";
  input.value = "";
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild)
  }

  allTask.sort((a, b) =>  {
    return a.isCheck - b.isCheck
  });

  allTask.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
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
      }
    }
    const imageDel = document.createElement("img");
    imageDel.src = "img/222.png";
    imageDel.type = "button";
    imageDel.className = "buttonClick";
    imageDel.onclick = () => deleteTask(index);
    container.appendChild(imageDel);
    content.appendChild(container);
  });
};

const onChangeCheckbox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};

const deleteTask = async (index) => {
  allTask.splice(index, 1);
  // const resp = await fetch('http://localhost:8000/deleteTask', {
  //   method: 'DEL'
  // });
  // let result = await resp.json();
  // // allTask = result.data;
  // console.log('result', result);
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};

const updateTaskText = (event) => {
  intermedateResult = event.target.value;
};

const saveResult = (index) => {
  allTask[index].text = intermedateResult;
  intermedateResult = "";
  localStorage.setItem('tasks', JSON.stringify(allTask));
};

const doneEditTask = () => {
  flag = null;
  render();
};

const deleteArr = () => {
  allTask.length = 0;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
}