let noteObj = new Notes();

window.onload = getAllNotes;
let notes = document.getElementById('notes'); // pull Div tag in HTML structure code that has id called id="notes";

// Action of add note button
let btn = document.querySelector('.btn');
btn.addEventListener('click', async (e) => {
    if (e.target) {
        await addNotes();
    }
})

// Action of Clear All notes button
let clearBtn = document.getElementById('clearAllBtn');
clearBtn.addEventListener('click', async (e) => {
    location.reload();
    if (confirm('Are you sure?')) {
        await clearNotes();
    }
})

// Action of Reverse note button
reverseBtn.onclick = () => {
    noteObj.reverse = !noteObj.reverse
    getAllNotes();
};

notes.addEventListener('click',(e)=>{
    let target = e.target;
    if(target.classList.value === 'delete'){
        deleteSpecificNote(parseInt(target.id));
    }else if(target.classList.value === 'edit'){
        editNote(parseInt(target.id));
    }
})


// getAllNotes is a function that clone notes as object then convert object into array then call displayAllnote function
async function getAllNotes() {

    let display = await noteObj.all();
    let noteList = [];


    display.onsuccess = () => {
        let cursor = display.result;
        if (cursor) {
            noteList.push(cursor.value);
            cursor.continue();
        } else {
            displayAllNotes(noteList);
        }
    }

}

// displayALlNotes function is to create a tags by using DOM and append into notes variable.
function displayAllNotes(noteList) {
    // Reach to notes id in HTML code and create ul tag inside it
    let UlElement = document.createElement('ul');

    // Loop to reach each object in noteList array and create li tag to append it inside ul tag
    for (let i = 0; i < noteList.length; i++) {
        let LiElement = document.createElement('li');
        LiElement.className = `note`
        LiElement.id = `note-${noteList[i]['id']}`
        LiElement.innerHTML = `
        <div>
        <img src="imgs/delete-icon.png" class="delete" id="${noteList[i]['id']}">
        <img src="imgs/edit-icon.png" class="edit" id="${noteList[i]['id']}">
        </div>
        <div class="content">${noteList[i]['note']}</div>`;
        UlElement.append(LiElement);
    }
    notes.innerHTML = '';
    notes.append(UlElement);


}

// addNotes function is add note by using class add.
async function addNotes() {
    let textAreaValue = document.querySelector('.add-note').children[0];
    let note = textAreaValue.value;
    await noteObj.add({'note': note});
}

// clearNotes function is to clear all note by using class clear.
async function clearNotes() {
    await noteObj.clear();
}

async function deleteSpecificNote(noteID){
    location.reload();
    await noteObj.delete(noteID);
}

//editNote function is to edit specific note
async function editNote(noteID){
    let note = notes.getElementsByClassName('note').namedItem("note-"+String(noteID));
    let editTextarea = document.createElement('textarea');
    let updateButton = document.createElement('button');
    let oldNote = note.innerHTML; // take current HTML code note for to use in future

    editTextarea.value = note.getElementsByClassName('content')[0].textContent;
    updateButton.className = 'btn';
    updateButton.textContent = 'Update';
    note.innerHTML = '' // to make a note as empty note

    note.append(editTextarea);
    note.append(updateButton);

    updateButton.addEventListener('click',async ()=>{
        note.innerHTML = oldNote; // take same
        note.getElementsByClassName('content')[0].textContent = editTextarea.value; // to change current content without reload page

        await noteObj.update({'id':noteID, 'note':editTextarea.value});

    })


}








