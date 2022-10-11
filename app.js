import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyBjMdG6cTVrKheNCmqlH1fTJHy7nfqOa6o",
    authDomain: "news-website2.firebaseapp.com",
    projectId: "news-website2",
    storageBucket: "news-website2.appspot.com",
    messagingSenderId: "909944181564",
    appId: "1:909944181564:web:6672a47ae7da05e94a4439"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list")
let allID = [];
let unsub;

const todoValue = document.getElementById("todo-value");
addBtn.addEventListener("click", async () => {
    try {
        await addDoc(collection(db, "todo-list"), {
            value: todoValue.value,
            timestamp: new Date(),
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})
let getTodo = () => {
    unsub = onSnapshot(
        query(collection(db, "todo-list"), orderBy("timestamp", "asc")),
        (querySnapshot) => {
            todoList.innerHTML = ""
            allID = []
            querySnapshot.forEach((doc) => {
                allID.push(doc.id)
                todoList.innerHTML += `<li id='${doc.id}'>${doc.data().value}<div>
                <button onclick="editTodo('${doc.id}','${doc.data().value}')">Edit</button><button onclick="deleteTodo('${doc.id}')">Delete</button></div></li>`
            });
            todoValue.value = ""
        }
    )
}
getTodo()


const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todo-list", id));

}
const editTodo = async (id, oldValue) => {
    let editValue = prompt("Enter Update Value:", oldValue)
    const updateRef = doc(db, "todo-list", id);
    await updateDoc(updateRef, {
        value: editValue
    });


}
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;

let deleteAll = document.getElementById("deleteAll-btn");
deleteAll.addEventListener("click", async () => {
    unsub()
    for (var i = 0; i < allID.length; i++) {
        let todo = document.getElementById(allID[i]);
        await deleteDoc(doc(db, "todo-list", allID[i]));
        todo.remove();
    };
    getTodo()
});