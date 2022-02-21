let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = "";
let input = null;
let flag = null;
let intermedateResult = "";

window.onload = function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  render();
 };

const onClickButton = () => {
  allTask.push({
    text: valueInput,
    isCheck: false,
  });
  localStorage.setItem('tasks', JSON.stringify(allTask));
  valueInput = "";
  input.value = "";
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
  // console.log("event.target.value;", event.target.value);
};

const render = () => {
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTask.sort((a, b) => {return a.isCheck - b.isCheck});
  allTask.map((item, index) => {
  
    const container = document.createElement("div");
    container.id = `task-${index}`;
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.className = "check";
    checkbox.onchange = function () {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (index === flag) {
    
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "type1";
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
        imageOk.className = "but";

        const imageCancel = document.createElement("img");
        imageCancel.src = "img/otmena.jpg";
        imageCancel.type = "button";
        imageCancel.className = "but";
      
        imageOk.onclick = function () {
          saveResult(index);
          doneEditTask();
        };

        imageCancel.onclick = function () {
          doneEditTask();
        };
        container.appendChild(imageOk);
        container.appendChild(imageCancel);
      } else {
      
        const imageEdit = document.createElement("img");
        imageEdit.src = "img/111.png";
        imageEdit.type = "button";
        imageEdit.className = "but";
        imageEdit.onclick = function () {
          flag = index;
          render();
        };
        container.appendChild(imageEdit);
      }
    }
    const imageDel = document.createElement("img");
    imageDel.src = "img/222.png";
    imageDel.type = "button";
    imageDel.className = "but";
    imageDel.onclick = function () {
      deleteTask(index);
    };
    container.appendChild(imageDel);

    content.appendChild(container);
  });
  // console.log(content);
};

const onChangeCheckbox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};

const deleteTask = (index) => {
  allTask.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};

const updateTaskText = (event) => {
  intermedateResult = event.target.value;
  console.log("intermedateResult", intermedateResult);
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