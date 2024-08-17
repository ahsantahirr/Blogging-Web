import {
    auth,
    db,
    signOut,
    getDoc,
    getDocs,
    doc,
    onAuthStateChanged,
    collection,
    query, 
    where,
    deleteDoc
} from "../utils/utils.js";

document.getElementById('user-menu-button').addEventListener('click', function () {
    var dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', function () {
    window.createblog = function () {
        if (auth.currentUser) {
            window.location.href = "./createblog/index.html";
        } else {
            window.location.href = "./login/index.html";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('[data-collapse-toggle="navbar-user"]');
    const navbarMenu = document.getElementById("navbar-sticky");

    toggleButton.addEventListener("click", function () {
        // Toggle the "hidden" class to show/hide the navbar
        navbarMenu.classList.toggle("hidden");
    });
});

const user_img = document.getElementById("user_img");
const user_mail = document.getElementById("useremailhtml");
const user_name = document.getElementById("usernamehtml");
const login_link = document.getElementById("login_btn");
const blog_container = document.getElementById("blog_container");
const logout_btn = document.getElementById("logout_btn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        login_link.style.display = "none";
        user_img.style.display = "inline-block";
        logout_btn.style.display = "inline-block"
        getUserInfo(uid);
        getmyevents(uid); // Pass uid to getmyevents
    } else {
        login_link.style.display = "inline-block";
        user_img.style.display = "none";
        logout_btn.style.display = "none"
    }
});

logout_btn.addEventListener("click", () => {
    signOut(auth);
});

function getUserInfo(uid) {
    const userRef = doc(db, "users", uid);
    getDoc(userRef)
        .then((data) => {
            const userData = data.data();
            console.log(userData);

            user_img.src = userData.img;
            user_mail.textContent = userData.email;
            user_name.textContent = userData.username
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
        });
}

async function getmyevents(uid) {
    if (!uid) {
        console.error("UID is undefined. Cannot fetch events.");
        return;
    }
    
    try {
        const q = query(collection(db, "blogs"), where("createdBy", "==", uid));
        const querySnapshot = await getDocs(q);
        blog_container.innerHTML = ""; // Clear the container before adding new content

        querySnapshot.forEach((doc, index) => {
            const blog = doc.data();
            const { banner, title, description, createdByemail, date } = blog;

            // Create the HTML content for each card
            const cardHTML = `
                <div class="group w-full max-lg:max-w-xl lg:w-1/3 border border-gray-300 rounded-2xl flex flex-col self-start h-96 overflow-scroll custom-scrollbar" id="card-${index}">
                    <div class="flex items-center">
                        <img src="${banner}" alt="blogs tailwind section" class="rounded-t-2xl w-full h-44">
                    </div>
                    <div class="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                        <span class="text-green-500 font-medium mb-3 block">${date}</span>
                        <span class="text-green-500 font-medium mb-3 block">${createdByemail}</span>
                        <h4 class="text-xl text-gray-900 font-medium leading-8 mb-5">${title}</h4>
                        <!-- Text that will be scrollable -->
                        <div class="description overflow-scroll max-h-80 text-gray-500 leading-6 ">
                            ${description}
                        </div>
                        <a href="#" class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-12"   onclick = "deleteEvent(this)" id = ${doc.id}>Delete</a>

                    </div>
                </div>
            `;
window.deleteEvent = deleteEvent;


            // Append the card HTML to the blog container
            blog_container.innerHTML += cardHTML;

            // Debugging: Check if card is appended and contains the expected ID
            // console.log(`Card ${index} HTML:`, cardHTML);
        });
    } catch (err) {
        console.error("Error fetching events: ", err);
        alert(err);
    }
}
async function deleteEvent(e) {
    console.log(e);
  
    const docRef = doc(db, "blogs", e.id);
    await deleteDoc(docRef);
    getmyevents(auth.currentUser.uid);
  }
