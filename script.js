import {
  auth,
  db,
  signOut,
  getDoc,
  getDocs,
  doc,
  onAuthStateChanged,
  collection,
} from "./utils/utils.js";
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
const user_img = document.getElementById("user_img");
const user_mail = document.getElementById("useremailhtml");
const user_name = document.getElementById("usernamehtml");
const login_link = document.getElementById("login_btn");
const blog_container = document.getElementById("blog_container");
const logout_btn = document.getElementById("logout_btn");
// const create_blog = document.getElementById("create_blog");
//   const myEvents_link = document.getElementById("myEvents_link");
//   const cart_link = document.getElementById("cart_link");

getallevents();
// addProduct_links.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    logout_btn.style.display = "inline-block"
    //   addProduct_links.style.display = "inline-block";
    //   myEvents_link.style.display = "inline-block";
    //   cart_link.style.display = "inline-block";
    getUserInfo(uid);
  } else {
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
    logout_btn.style.display = "none"
    //   addProduct_links.style.display = "none"; 
    //   myEvents_link.style.display = "none";
    //   cart_link.style.display = "none";
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
      user_img.src = userData.img;
      user_mail.textContent = userData.email;
      user_name.textContent = `${userData.firstname} ${userData.lastname}`;
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
}

async function getallevents() {
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    blog_container.innerHTML = "";
    querySnapshot.forEach((doc, index) => {
      const blog = doc.data();
      const { banner, title, description, createdByemail, date } = blog;

      const card = `
        <div class="group w-full max-lg:max-w-xl lg:w-1/3 border border-gray-300 rounded-2xl flex flex-col self-start h-96 overflow-scroll" id="card-${index}">

          <div class="flex items-center">
            <img src="${banner}" alt="blogs tailwind section" class="rounded-t-2xl w-full h-44">
          </div>
          <div class="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
            <span class="text-indigo-600 font-medium mb-3 block">${date}</span>
            <span class="text-indigo-600 font-medium mb-3 block">${createdByemail}</span>
            <h4 class="text-xl text-gray-900 font-medium leading-8 mb-5">${title}</h4>
    
            <!-- Text that will be initially collapsed -->
            <div class="description overflow-hidden max-h-20 text-gray-500 leading-6 transition-all duration-300 mb-10">
              ${description}
            </div>
    
            <!-- "Read more" button -->
            <a href="javascript:;" class="readMoreBtn cursor-pointer text-lg text-indigo-600 font-semibold">Read more..</a>
          </div>
         
        </div>
      `;

      blog_container.innerHTML += card;

      // Select specific elements within the current card
      const currentCard = document.querySelector(`#card-${index}`);
      const descriptionDiv = currentCard.querySelector('.description');
      const readMoreBtn = currentCard.querySelector('.readMoreBtn');

      // Event listener for expanding/collapsing the specific blog
      readMoreBtn.addEventListener('click', function () {
        if (descriptionDiv.classList.contains('max-h-20')) {
          descriptionDiv.classList.remove('max-h-20');
          descriptionDiv.classList.add('max-h-full', 'overflow-auto');
          readMoreBtn.textContent = 'Show less';
        } else {
          descriptionDiv.classList.add('max-h-20');
          descriptionDiv.classList.remove('max-h-full', 'overflow-auto');
          readMoreBtn.textContent = 'Read more..';
        }
      });
    });
    ;
  } catch (err) {
    console.error("Error fetching events: ", err);
    alert(err);
  }
}


